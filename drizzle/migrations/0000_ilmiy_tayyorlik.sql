-- Ilmiy tayyorlik: natijalar validatsiyasi, fikr-mulohaza jadvali, tekshirilgan manbalar.
-- MUHIM: qo'llashdan oldin test_results, resources va books jadvallarining zaxira nusxasini (CSV) oling.
-- Trigger eski va yangi kod versiyalari yuboradigan yozuvlarni qabul qiladi (tekshirilgan), tartib muhim emas.

-- 1. test_results: soxta yoki buzilgan yozuvlarni server tomonda rad etish ------------------
CREATE OR REPLACE FUNCTION public.validate_test_result()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  meta jsonb := NEW.answers -> '_meta';
  answered int;
BEGIN
  -- Faqat platformadagi test turlari (eski v1 nomlari ham, yangi versiyali nomlar ham).
  IF NEW.test_type !~ '^(TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|PISA|Rasmiy TIMSS - (Bilish|Qo''llash|Mulohaza yuritish)|Rasmiy PISA|Sinov testi [AB])( · [vr][0-9]+)?$' THEN
    RAISE EXCEPTION 'Noma''lum test turi: %', NEW.test_type;
  END IF;
  IF NEW.total_questions > 200 THEN
    RAISE EXCEPTION 'Savollar soni juda katta';
  END IF;
  IF char_length(trim(NEW.full_name)) < 3 THEN
    RAISE EXCEPTION 'F.I.Sh. juda qisqa';
  END IF;
  -- Foiz ball bilan mos bo'lishi kerak (yaxlitlash farqi ±1).
  IF abs(NEW.percentage - round(NEW.score::numeric * 100 / NEW.total_questions)) > 1 THEN
    RAISE EXCEPTION 'Foiz va ball mos emas';
  END IF;
  IF jsonb_typeof(NEW.answers) <> 'object' OR pg_column_size(NEW.answers) > 20000 THEN
    RAISE EXCEPTION 'Javoblar formati noto''g''ri';
  END IF;
  -- Javoblar soni savollar sonidan oshmasligi kerak (_meta hisobga olinmaydi).
  SELECT count(*) INTO answered FROM jsonb_object_keys(NEW.answers) k WHERE k <> '_meta';
  IF answered > NEW.total_questions THEN
    RAISE EXCEPTION 'Javoblar soni savollar sonidan ko''p';
  END IF;
  -- Yangi (versiyali) yozuvlarda rozilik majburiy.
  IF NEW.test_type ~ ' · [vr][0-9]+$' AND meta IS NOT NULL
     AND coalesce((meta ->> 'consent')::boolean, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Ishtirokchi roziligi yo''q';
  END IF;
  IF NEW.completed_at < NEW.started_at OR NEW.completed_at > now() + interval '5 minutes' THEN
    RAISE EXCEPTION 'Vaqt noto''g''ri';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_test_result ON public.test_results;
CREATE TRIGGER validate_test_result
  BEFORE INSERT ON public.test_results
  FOR EACH ROW EXECUTE FUNCTION public.validate_test_result();

-- Monitoringda kod va bosqich bo'yicha tez qidirish uchun.
CREATE INDEX IF NOT EXISTS test_results_meta_code_idx
  ON public.test_results ((answers -> '_meta' ->> 'code'));

-- 2. Aloqa formasi uchun fikr-mulohaza jadvali (faqat yozish; o'qish faqat egasiga) -------
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send feedback" ON public.feedback;
CREATE POLICY "Anyone can send feedback" ON public.feedback
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 3. Ilmiy manbalar: havola ustuni, tekshirilmagan yozuvlarni olib tashlash -------------
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS url text;

-- Mavjudligi tasdiqlanmagan (qidiruvda topilmagan) 7 ta manba.
DELETE FROM public.resources WHERE title IN (
  'Mathematical Literacy at School: Diagnostic Approaches and Adaptive Support',
  'Development of Mathematical Reasoning through TIMSS-Aligned Tasks',
  'Formative Assessment in Mathematics: A PISA-Oriented Framework',
  'Mathematical Modelling as a Tool for Developing PISA Literacy',
  'Cognitive Demand of TIMSS Mathematics Items: A Comparative Study',
  'Digital Diagnostics for Primary Mathematics: An Adaptive Approach',
  'Rethinking Problem Solving in the PISA Era'
);

-- Rasmiy nashrlar: nom, yil, mualliflar va havolalar aniqlashtirildi.
UPDATE public.resources SET
  year = 2021,
  authors = 'Mullis, I. V. S., Martin, M. O., & von Davier, M. (Eds.)',
  url = 'https://timssandpirls.bc.edu/timss2023/frameworks/'
WHERE title = 'TIMSS 2023 Assessment Frameworks';

UPDATE public.resources SET
  title = 'TIMSS 2019 International Results in Mathematics and Science',
  url = 'https://timssandpirls.bc.edu/timss2019/international-results/'
WHERE title = 'TIMSS 2019 International Results in Mathematics';

UPDATE public.resources SET url = 'https://timssandpirls.bc.edu/timss2019/encyclopedia/'
WHERE title LIKE 'TIMSS 2019 Encyclopedia%';

UPDATE public.resources SET
  title = 'PISA 2022 Assessment and Analytical Framework',
  url = 'https://www.oecd.org/en/publications/pisa-2022-assessment-and-analytical-framework_dfe0bf9c-en.html'
WHERE title = 'PISA 2022 Mathematics Framework';

UPDATE public.resources SET url = 'https://doi.org/10.1787/53f23881-en'
WHERE title LIKE 'PISA 2022 Results (Volume I)%';

UPDATE public.resources SET url = 'https://search.oecd.org/pisa/publications/pisa-2018-results-volume-i-5f07c754-en.htm'
WHERE title LIKE 'PISA 2018 Results (Volume I)%';

-- Tekshirilgan qo'shimcha manbalar.
INSERT INTO public.resources (title, authors, year, source, description, url)
SELECT * FROM (VALUES
  ('Content Knowledge for Teaching: What Makes It Special?',
   'Ball, D. L., Thames, M. H., & Phelps, G.', 2008, 'Article',
   'Journal of Teacher Education, 59(5), 389–407. Mathematical Knowledge for Teaching (MKT) modeli: o''qituvchi uchun maxsus mazmuniy bilim va pedagogik mazmuniy bilim.',
   'https://doi.org/10.1177/0022487108324554'),
  ('Mathematical competencies revisited',
   'Niss, M., & Højgaard, T.', 2019, 'Article',
   'Educational Studies in Mathematics, 102(1). PISA matematik savodxonlik konsepsiyasiga asos bo''lgan matematik kompetensiyalar tizimi.',
   'https://forskning.ruc.dk/en/publications/mathematical-competencies-revisited/'),
  ('The PISA View of Mathematical Literacy in Indonesia',
   'Stacey, K.', 2011, 'Article',
   'Journal on Mathematics Education, 2(2). PISA matematik savodxonlik jarayonlari va namunaviy topshiriqlar tahlili.',
   'https://ejournal.unsri.ac.id/index.php/jme/article/view/746'),
  ('TIMSS 2011 Grade 4 and Grade 8 Released Mathematics Items',
   'IEA / NCES', 2013, 'TIMSS',
   'Ochiq e''lon qilingan TIMSS 2011 matematika topshiriqlari va xalqaro natijalar; platformadagi rasmiy namunaviy topshiriqlar manbai.',
   'https://nces.ed.gov/timss/pdf/TIMSS2011_G4_Math.pdf'),
  ('PISA Released Mathematics Items',
   'OECD / ACER', 2006, 'PISA',
   'PISA matematik savodxonlik bo''yicha ochiq e''lon qilingan topshiriqlar va baholash yo''riqnomasi.',
   'https://www.acer.org/files/pisa_relitems_maths_2.pdf')
) AS v(title, authors, year, source, description, url)
WHERE NOT EXISTS (SELECT 1 FROM public.resources r WHERE r.title = v.title);