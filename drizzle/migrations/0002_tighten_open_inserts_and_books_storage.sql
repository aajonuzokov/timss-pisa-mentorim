DROP POLICY IF EXISTS "Anyone can send feedback" ON public.feedback;
CREATE POLICY "Anyone can send feedback" ON public.feedback FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 2 AND 120
  AND char_length(btrim(email)) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(btrim(message)) BETWEEN 5 AND 5000
);

DROP POLICY IF EXISTS "Anyone can add reflection" ON public.portfolio_reflections;
CREATE POLICY "Anyone can add reflection" ON public.portfolio_reflections FOR INSERT TO anon, authenticated
WITH CHECK (
  code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'
  AND char_length(btrim(difficulty)) BETWEEN 3 AND 2000
  AND char_length(btrim(next_step)) BETWEEN 3 AND 2000
  AND EXISTS (
    SELECT 1 FROM public.test_results t
    WHERE t.id = result_id AND t.answers -> '_meta' ->> 'code' = code
  )
);

DROP POLICY IF EXISTS "Public read books bucket" ON storage.objects;