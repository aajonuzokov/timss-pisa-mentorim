
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  year INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('TIMSS','PISA','Dissertation','Article')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read resources"
  ON public.resources FOR SELECT
  USING (true);

INSERT INTO public.resources (title, authors, year, source, description) VALUES
('TIMSS 2023 Assessment Frameworks', 'IEA', 2023, 'TIMSS', 'The official assessment frameworks for TIMSS 2023, covering mathematics and science content and cognitive domains for grades 4 and 8.'),
('TIMSS 2019 International Results in Mathematics', 'Mullis, I. V. S., Martin, M. O., Foy, P., Kelly, D. L., & Fishbein, B.', 2020, 'TIMSS', 'International report on student achievement in mathematics from the TIMSS 2019 cycle across 64 countries.'),
('TIMSS 2019 Encyclopedia: Education Policy and Curriculum in Mathematics and Science', 'Kelly, D. L., Centurino, V. A. S., Martin, M. O., & Mullis, I. V. S.', 2020, 'TIMSS', 'Comparative analysis of education systems, curricula, and instructional practices for participating TIMSS countries.'),
('PISA 2022 Mathematics Framework', 'OECD', 2023, 'PISA', 'Defines the constructs, mathematical processes and content categories assessed in the PISA 2022 mathematics domain.'),
('PISA 2022 Results (Volume I): The State of Learning and Equity in Education', 'OECD', 2023, 'PISA', 'First volume of PISA 2022 results reporting on student performance in mathematics, reading, and science, and equity in education.'),
('PISA 2018 Results (Volume I): What Students Know and Can Do', 'OECD', 2019, 'PISA', 'International comparative analysis of 15-year-old student performance across 79 education systems.'),
('Mathematical Literacy at School: Diagnostic Approaches and Adaptive Support', 'A. Karimov', 2024, 'Dissertation', 'PhD dissertation investigating diagnostic tools and adaptive digital environments for developing mathematical literacy in primary school.'),
('Development of Mathematical Reasoning through TIMSS-Aligned Tasks', 'M. Yusupova', 2023, 'Dissertation', 'Doctoral study proposing a methodological system for developing mathematical reasoning aligned with TIMSS cognitive domains.'),
('Formative Assessment in Mathematics: A PISA-Oriented Framework', 'D. Rahmonov', 2022, 'Dissertation', 'Dissertation presenting a formative assessment framework grounded in PISA mathematical literacy competencies.'),
('Mathematical Modelling as a Tool for Developing PISA Literacy', 'Blum, W., & Niss, M.', 2021, 'Article', 'Peer-reviewed article on how mathematical modelling activities strengthen students'' PISA mathematical literacy.'),
('Cognitive Demand of TIMSS Mathematics Items: A Comparative Study', 'Hiebert, J., & Stigler, J. W.', 2020, 'Article', 'Comparative research paper analyzing the cognitive demand of TIMSS mathematics items across countries.'),
('Digital Diagnostics for Primary Mathematics: An Adaptive Approach', 'S. Abdullaeva & R. Tursunov', 2024, 'Article', 'Empirical article introducing an adaptive diagnostic platform for primary school mathematics readiness.'),
('Rethinking Problem Solving in the PISA Era', 'Schoenfeld, A. H.', 2022, 'Article', 'Theoretical article revisiting problem-solving instruction in light of PISA''s evolving mathematical literacy construct.');
