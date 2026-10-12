-- Dissertatsiyaga moslash: diagnostik test (Ilova 1), o'qituvchi kabineti, rubrika bo'yicha
-- baholash, E-portfolio (refleksiya va o'qituvchi izohlari).
-- MUHIM: qo'llashdan oldin test_results jadvalining zaxira nusxasini (CSV) oling.
-- Migratsiya mavjud yozuvlarni o'zgartirmaydi va o'chirmaydi.

-- 1. test_results: diagnostik test turini qabul qilish -------------------------------------
CREATE OR REPLACE FUNCTION public.validate_test_result()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  meta jsonb := NEW.answers -> '_meta';
  answered int;
  is_diag boolean := NEW.test_type ~ '^Diagnostik test [AB] · d[0-9]+$';
  -- Diagnostik testda ochiq (matnli) javoblar bor, shuning uchun hajm chegarasi kattaroq.
  max_size int := 20000;
  max_answers int := NEW.total_questions;
BEGIN
  IF is_diag THEN
    max_size := 60000;
    max_answers := 20;
  END IF;
  IF NEW.test_type !~ '^(TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|PISA|Rasmiy TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|Rasmiy PISA|Sinov testi [AB]|Diagnostik test [AB])( · [vrd][0-9]+)?$' THEN
    RAISE EXCEPTION 'Noma''lum test turi: %', NEW.test_type;
  END IF;
  IF NEW.test_type ~ '^Diagnostik test' AND NOT is_diag THEN
    RAISE EXCEPTION 'Diagnostik test versiyasi ko''rsatilmagan';
  END IF;
  -- Diagnostik test: 20 topshiriq × 2 ball = 40 ball; total_questions — maksimal ball.
  IF is_diag AND NEW.total_questions <> 40 THEN
    RAISE EXCEPTION 'Diagnostik testda maksimal ball 40 bo''lishi kerak';
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
  IF is_diag AND coalesce(meta ->> 'code', '') !~ '^[A-Z0-9][A-Z0-9-]{2,19}$' THEN
    RAISE EXCEPTION 'Ishtirokchi kodi noto''g''ri';
  END IF;
  IF NEW.completed_at < NEW.started_at OR NEW.completed_at > now() + interval '5 minutes' THEN
    RAISE EXCEPTION 'Vaqt noto''g''ri';
  END IF;
  RETURN NEW;
END;
$$;

-- 2. O'qituvchilar ro'yxati ------------------------------------------------------------------
-- Foydalanuvchi Lovable Cloud → Users bo'limida yaratiladi, so'ng shu yerga qo'shiladi:
--   INSERT INTO public.teachers (user_id, email)
--   SELECT id, email FROM auth.users WHERE email = 'oqituvchi@example.com';
CREATE TABLE IF NOT EXISTS public.teachers (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.teachers TO authenticated;
GRANT ALL ON public.teachers TO service_role;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teacher sees own row" ON public.teachers;
CREATE POLICY "Teacher sees own row" ON public.teachers
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.teachers WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_teacher() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated;

-- 3. Natijalarni faqat o'qituvchi o'qiydi (anonim foydalanuvchi hamon faqat yozadi) ---------
GRANT SELECT ON public.test_results TO authenticated;
DROP POLICY IF EXISTS "Teachers read results" ON public.test_results;
CREATE POLICY "Teachers read results" ON public.test_results
  FOR SELECT TO authenticated USING (public.is_teacher());

-- 4. Rubrika bo'yicha baholash (Ilova 5): har bir topshiriq 0–2 ball -----------------------
CREATE TABLE IF NOT EXISTS public.rubric_scores (
  result_id uuid NOT NULL REFERENCES public.test_results (id) ON DELETE CASCADE,
  item_id text NOT NULL CHECK (item_id ~ '^D[AB]-([1-9]|1[0-9]|20)$'),
  score smallint NOT NULL CHECK (score BETWEEN 0 AND 2),
  comment text CHECK (char_length(comment) <= 1000),
  rater uuid DEFAULT auth.uid(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (result_id, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rubric_scores TO authenticated;
GRANT ALL ON public.rubric_scores TO service_role;
ALTER TABLE public.rubric_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers manage rubric" ON public.rubric_scores;
CREATE POLICY "Teachers manage rubric" ON public.rubric_scores
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 5. O'qituvchi izohi va individual tavsiyalar (E-portfolio) -------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'),
  result_id uuid REFERENCES public.test_results (id) ON DELETE SET NULL,
  comment text NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 3000),
  recommendations text NOT NULL DEFAULT '' CHECK (char_length(recommendations) <= 3000),
  author uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS teacher_feedback_code_idx ON public.teacher_feedback (code);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_feedback TO authenticated;
GRANT ALL ON public.teacher_feedback TO service_role;
ALTER TABLE public.teacher_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers manage feedback" ON public.teacher_feedback;
CREATE POLICY "Teachers manage feedback" ON public.teacher_feedback
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 6. Talaba refleksiyasi: test topshirilgandan keyin (24 soat ichida) yoziladi --------------
CREATE TABLE IF NOT EXISTS public.portfolio_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'),
  result_id uuid NOT NULL REFERENCES public.test_results (id) ON DELETE CASCADE,
  test_type text NOT NULL CHECK (char_length(test_type) BETWEEN 1 AND 100),
  difficulty text NOT NULL CHECK (char_length(difficulty) BETWEEN 1 AND 1000),
  next_step text NOT NULL CHECK (char_length(next_step) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portfolio_reflections_code_idx ON public.portfolio_reflections (code);
GRANT INSERT ON public.portfolio_reflections TO anon, authenticated;
GRANT SELECT ON public.portfolio_reflections TO authenticated;
GRANT ALL ON public.portfolio_reflections TO service_role;
ALTER TABLE public.portfolio_reflections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can add reflection" ON public.portfolio_reflections;
CREATE POLICY "Anyone can add reflection" ON public.portfolio_reflections
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Teachers read reflections" ON public.portfolio_reflections;
CREATE POLICY "Teachers read reflections" ON public.portfolio_reflections
  FOR SELECT TO authenticated USING (public.is_teacher());

-- Refleksiya faqat o'sha kodli natijaga va natija yuborilgandan keyin 24 soat ichida;
-- bitta natijaga ko'pi bilan 3 ta refleksiya.
CREATE OR REPLACE FUNCTION public.validate_reflection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  n int;
BEGIN
  SELECT answers -> '_meta' ->> 'code' AS code, test_type, completed_at INTO r
  FROM public.test_results WHERE id = NEW.result_id;
  IF NOT FOUND OR r.code IS DISTINCT FROM NEW.code THEN
    RAISE EXCEPTION 'Natija topilmadi';
  END IF;
  IF now() > r.completed_at + interval '24 hours' THEN
    RAISE EXCEPTION 'Refleksiya muddati o''tgan';
  END IF;
  SELECT count(*) INTO n FROM public.portfolio_reflections WHERE result_id = NEW.result_id;
  IF n >= 3 THEN
    RAISE EXCEPTION 'Refleksiyalar soni chegaradan oshdi';
  END IF;
  NEW.test_type := r.test_type;
  NEW.created_at := now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_reflection ON public.portfolio_reflections;
CREATE TRIGGER validate_reflection
  BEFORE INSERT ON public.portfolio_reflections
  FOR EACH ROW EXECUTE FUNCTION public.validate_reflection();

-- 7. E-portfolioga kirish: ishtirokchi kodi + PIN ------------------------------------------
-- PIN birinchi kirishda o'rnatiladi (kod bo'yicha kamida bitta natija bo'lishi shart).
-- 5 ta noto'g'ri urinishdan keyin kod 15 daqiqaga bloklanadi. PIN ochiq saqlanmaydi.
CREATE TABLE IF NOT EXISTS public.portfolio_pins (
  code text PRIMARY KEY CHECK (code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'),
  pin_hash text NOT NULL,
  failed smallint NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.portfolio_pins TO authenticated;
GRANT ALL ON public.portfolio_pins TO service_role;
ALTER TABLE public.portfolio_pins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers see pins" ON public.portfolio_pins;
CREATE POLICY "Teachers see pins" ON public.portfolio_pins
  FOR SELECT TO authenticated USING (public.is_teacher());
DROP POLICY IF EXISTS "Teachers reset pins" ON public.portfolio_pins;
CREATE POLICY "Teachers reset pins" ON public.portfolio_pins
  FOR DELETE TO authenticated USING (public.is_teacher());

CREATE OR REPLACE FUNCTION public.portfolio_pin_hash(p_code text, p_pin text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(sha256(convert_to('mentorim:' || p_code || ':' || p_pin, 'UTF8')), 'hex');
$$;
REVOKE ALL ON FUNCTION public.portfolio_pin_hash(text, text) FROM PUBLIC, anon, authenticated;

-- Javob: {"ok": true, "created": bool, "results": [...], "rubric": [...],
--         "reflections": [...], "feedback": [...]} yoki {"ok": false, "error": "..."}.
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
      FROM public.teacher_feedback f WHERE f.code = c), '[]'::jsonb)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.portfolio_open(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.portfolio_open(text, text) TO anon, authenticated;