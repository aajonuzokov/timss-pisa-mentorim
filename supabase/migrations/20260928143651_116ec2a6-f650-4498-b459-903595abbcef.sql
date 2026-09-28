CREATE TABLE public.test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 200),
  university text NOT NULL CHECK (char_length(university) BETWEEN 1 AND 200),
  course text NOT NULL CHECK (char_length(course) BETWEEN 1 AND 50),
  test_type text NOT NULL CHECK (char_length(test_type) BETWEEN 1 AND 100),
  score integer NOT NULL CHECK (score >= 0),
  total_questions integer NOT NULL CHECK (total_questions > 0),
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  level text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.test_results TO anon, authenticated;
GRANT ALL ON public.test_results TO service_role;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a test result" ON public.test_results FOR INSERT TO anon, authenticated WITH CHECK (score <= total_questions);