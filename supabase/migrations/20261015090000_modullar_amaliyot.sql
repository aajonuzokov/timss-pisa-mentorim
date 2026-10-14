-- Variativ modul, oraliq diagnostika va amaliy metodik ishlar (MKT vositalari).
-- MUHIM: qo'llashdan oldin test_results va rubric_scores jadvallarining zaxira nusxasini oling.
-- Migratsiya mavjud yozuvlarni o'zgartirmaydi va o'chirmaydi.

-- 1. test_results: "Oraliq diagnostika · d1" (30 topshiriq, 60 ball) qabul qilinadi ----------
CREATE OR REPLACE FUNCTION public.validate_test_result()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  meta jsonb := NEW.answers -> '_meta';
  answered int;
  is_diag boolean := NEW.test_type ~ '^Diagnostik test [AB] · d[0-9]+$';
  is_oraliq boolean := NEW.test_type ~ '^Oraliq diagnostika · d[0-9]+$';
  -- Diagnostik testda ochiq (matnli) javoblar bor, shuning uchun hajm chegarasi kattaroq.
  max_size int := 20000;
  max_answers int := NEW.total_questions;
BEGIN
  IF is_diag THEN
    max_size := 60000;
    max_answers := 20;
  END IF;
  IF is_oraliq THEN
    max_size := 90000;
    max_answers := 30;
  END IF;
  IF NEW.test_type !~ '^(TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|PISA|Rasmiy TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|Rasmiy PISA|Sinov testi [AB]|Diagnostik test [AB]|Oraliq diagnostika)( · [vrd][0-9]+)?$' THEN
    RAISE EXCEPTION 'Noma''lum test turi: %', NEW.test_type;
  END IF;
  IF (NEW.test_type ~ '^Diagnostik test' AND NOT is_diag)
     OR (NEW.test_type ~ '^Oraliq diagnostika' AND NOT is_oraliq) THEN
    RAISE EXCEPTION 'Diagnostik test versiyasi ko''rsatilmagan';
  END IF;
  -- Diagnostik test: 20 topshiriq × 2 ball = 40 ball; total_questions — maksimal ball.
  IF is_diag AND NEW.total_questions <> 40 THEN
    RAISE EXCEPTION 'Diagnostik testda maksimal ball 40 bo''lishi kerak';
  END IF;
  -- Oraliq diagnostika: 30 topshiriq × 2 ball = 60 ball.
  IF is_oraliq AND NEW.total_questions <> 60 THEN
    RAISE EXCEPTION 'Oraliq diagnostikada maksimal ball 60 bo''lishi kerak';
  END IF;
  IF NEW.total_questions > 200 THEN
    RAISE EXCEPTION 'Savollar soni juda katta';
  END IF;
  IF char_length(trim(NEW.full_name)) < 3 THEN
    RAISE EXCEPTION 'F.I.Sh. juda qisqa';
  END IF;
  IF abs(NEW.percentage - round(NEW.score::numeric * 100 / NEW.total_questions)) > 1 THEN
    RAISE EXCEPTION 'Foiz va ball mos emas';
  END IF;
  IF jsonb_typeof(NEW.answers) <> 'object' OR pg_column_size(NEW.answers) > max_size THEN
    RAISE EXCEPTION 'Javoblar formati noto''g''ri';
  END IF;
  SELECT count(*) INTO answered FROM jsonb_object_keys(NEW.answers) k WHERE k <> '_meta';
  IF answered > max_answers THEN
    RAISE EXCEPTION 'Javoblar soni savollar sonidan ko''p';
  END IF;
  IF NEW.test_type ~ ' · [vrd][0-9]+$' AND meta IS NOT NULL
     AND coalesce((meta ->> 'consent')::boolean, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Ishtirokchi roziligi yo''q';
  END IF;
  -- Diagnostik testda ishtirokchi kodi majburiy (portfolio va juftlash shu kod bo'yicha).
  IF (is_diag OR is_oraliq) AND coalesce(meta ->> 'code', '') !~ '^[A-Z0-9][A-Z0-9-]{2,19}$' THEN
    RAISE EXCEPTION 'Ishtirokchi kodi noto''g''ri';
  END IF;
  IF NEW.completed_at < NEW.started_at OR NEW.completed_at > now() + interval '5 minutes' THEN
    RAISE EXCEPTION 'Vaqt noto''g''ri';
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Rubrika: oraliq diagnostika topshiriqlari (DO-1 … DO-30) ham baholanadi ---------------
ALTER TABLE public.rubric_scores DROP CONSTRAINT IF EXISTS rubric_scores_item_id_check;
ALTER TABLE public.rubric_scores ADD CONSTRAINT rubric_scores_item_id_check
  CHECK (item_id ~ '^D[AB]-([1-9]|1[0-9]|20)$' OR item_id ~ '^DO-([1-9]|[12][0-9]|30)$');

-- 3. Talaba ishlari: modul topshiriqlari, amaliy metodik ishlar, o'z-o'zini baholash -------
CREATE TABLE IF NOT EXISTS public.portfolio_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'),
  kind text NOT NULL CHECK (kind IN ('modul-metodik', 'modul-bajarildi', 'maqsad', 'xato-tahlil',
    'moslashtirish', 'dars-ishlanmasi', 'microteaching', 'lesson-study', 'self-score')),
  ref text NOT NULL DEFAULT '' CHECK (char_length(ref) <= 100),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND pg_column_size(payload) <= 30000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portfolio_submissions_code_idx ON public.portfolio_submissions (code);
GRANT INSERT ON public.portfolio_submissions TO anon, authenticated;
GRANT SELECT ON public.portfolio_submissions TO authenticated;
GRANT ALL ON public.portfolio_submissions TO service_role;
ALTER TABLE public.portfolio_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit work" ON public.portfolio_submissions;
CREATE POLICY "Anyone can submit work" ON public.portfolio_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Teachers read work" ON public.portfolio_submissions;
CREATE POLICY "Teachers read work" ON public.portfolio_submissions
  FOR SELECT TO authenticated USING (public.is_teacher());

-- Ish faqat diagnostika topshirgan kod nomidan yuboriladi; kuniga ko'pi bilan 100 ta;
-- o'z-o'zini baholash — o'sha kodli natijaga, 24 soat ichida, bir marta.
CREATE OR REPLACE FUNCTION public.validate_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
  r record;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.test_results WHERE answers -> '_meta' ->> 'code' = NEW.code) THEN
    RAISE EXCEPTION 'Bu kod bilan topshirilgan test topilmadi';
  END IF;
  SELECT count(*) INTO n FROM public.portfolio_submissions
    WHERE code = NEW.code AND created_at > now() - interval '1 day';
  IF n >= 100 THEN
    RAISE EXCEPTION 'Bir kunlik ishlar soni chegaradan oshdi';
  END IF;
  IF NEW.kind = 'self-score' THEN
    IF NEW.ref !~ '^[0-9a-f-]{36}$' THEN
      RAISE EXCEPTION 'Natija topilmadi';
    END IF;
    SELECT answers -> '_meta' ->> 'code' AS code, completed_at INTO r
      FROM public.test_results WHERE id = NEW.ref::uuid;
    IF NOT FOUND OR r.code IS DISTINCT FROM NEW.code THEN
      RAISE EXCEPTION 'Natija topilmadi';
    END IF;
    IF now() > r.completed_at + interval '24 hours' THEN
      RAISE EXCEPTION 'O''z-o''zini baholash muddati o''tgan';
    END IF;
    IF EXISTS (SELECT 1 FROM public.portfolio_submissions
               WHERE kind = 'self-score' AND ref = NEW.ref) THEN
      RAISE EXCEPTION 'Bu natija allaqachon baholangan';
    END IF;
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_submission ON public.portfolio_submissions;
CREATE TRIGGER validate_submission
  BEFORE INSERT ON public.portfolio_submissions
  FOR EACH ROW EXECUTE FUNCTION public.validate_submission();

-- 4. O'qituvchi bahosi: 0–2 ball, ixtiyoriy mezonlar va izoh -----------------------------
CREATE TABLE IF NOT EXISTS public.submission_scores (
  submission_id uuid PRIMARY KEY REFERENCES public.portfolio_submissions (id) ON DELETE CASCADE,
  score smallint NOT NULL CHECK (score BETWEEN 0 AND 2),
  criteria jsonb CHECK (criteria IS NULL OR jsonb_typeof(criteria) = 'object'),
  comment text CHECK (char_length(comment) <= 2000),
  rater uuid DEFAULT auth.uid(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_scores TO authenticated;
GRANT ALL ON public.submission_scores TO service_role;
ALTER TABLE public.submission_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers manage work scores" ON public.submission_scores;
CREATE POLICY "Teachers manage work scores" ON public.submission_scores
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 5. E-portfolio: talaba ishlari va baholari ham qaytariladi ------------------------------
CREATE OR REPLACE FUNCTION public.portfolio_open(p_code text, p_pin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c text := upper(trim(coalesce(p_code, '')));
  p record;
  created boolean := false;
BEGIN
  IF c !~ '^[A-Z0-9][A-Z0-9-]{2,19}$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Ishtirokchi kodi noto''g''ri.');
  END IF;
  IF coalesce(p_pin, '') !~ '^[0-9]{4,8}$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'PIN 4–8 ta raqamdan iborat bo''lishi kerak.');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.test_results WHERE answers -> '_meta' ->> 'code' = c) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu kod bilan topshirilgan test topilmadi.');
  END IF;

  SELECT * INTO p FROM public.portfolio_pins WHERE code = c FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.portfolio_pins (code, pin_hash) VALUES (c, public.portfolio_pin_hash(c, p_pin));
    created := true;
  ELSE
    IF p.locked_until IS NOT NULL AND p.locked_until > now() THEN
      RETURN jsonb_build_object('ok', false, 'error',
        'Ko''p marta noto''g''ri PIN kiritildi. 15 daqiqadan keyin urinib ko''ring.');
    END IF;
    IF p.pin_hash <> public.portfolio_pin_hash(c, p_pin) THEN
      UPDATE public.portfolio_pins
        SET failed = CASE WHEN p.failed + 1 >= 5 THEN 0 ELSE p.failed + 1 END,
            locked_until = CASE WHEN p.failed + 1 >= 5 THEN now() + interval '15 minutes' ELSE NULL END
        WHERE code = c;
      RETURN jsonb_build_object('ok', false, 'error',
        'PIN noto''g''ri. Unutgan bo''lsangiz, o''qituvchingiz uni qayta tiklaydi.');
    END IF;
    UPDATE public.portfolio_pins SET failed = 0, locked_until = NULL WHERE code = c;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'created', created,
    'results', coalesce((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.completed_at)
      FROM public.test_results t WHERE t.answers -> '_meta' ->> 'code' = c), '[]'::jsonb),
    'rubric', coalesce((
      SELECT jsonb_agg(jsonb_build_object('result_id', r.result_id, 'item_id', r.item_id,
                                          'score', r.score, 'comment', r.comment))
      FROM public.rubric_scores r JOIN public.test_results t ON t.id = r.result_id
      WHERE t.answers -> '_meta' ->> 'code' = c), '[]'::jsonb),
    'reflections', coalesce((
      SELECT jsonb_agg(to_jsonb(f) ORDER BY f.created_at)
      FROM public.portfolio_reflections f WHERE f.code = c), '[]'::jsonb),
    'feedback', coalesce((
      SELECT jsonb_agg(jsonb_build_object('id', f.id, 'code', f.code, 'result_id', f.result_id,
                                          'comment', f.comment,
                                          'recommendations', f.recommendations,
                                          'created_at', f.created_at) ORDER BY f.created_at)
      FROM public.teacher_feedback f WHERE f.code = c), '[]'::jsonb),
    'submissions', coalesce((
      SELECT jsonb_agg(jsonb_build_object('id', s.id, 'kind', s.kind, 'ref', s.ref,
                                          'payload', s.payload, 'created_at', s.created_at,
                                          'score', sc.score, 'criteria', sc.criteria,
                                          'comment', sc.comment) ORDER BY s.created_at)
      FROM public.portfolio_submissions s
      LEFT JOIN public.submission_scores sc ON sc.submission_id = s.id
      WHERE s.code = c), '[]'::jsonb)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.portfolio_open(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.portfolio_open(text, text) TO anon, authenticated;
