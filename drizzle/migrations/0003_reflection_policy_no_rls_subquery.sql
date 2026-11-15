DROP POLICY IF EXISTS "Anyone can add reflection" ON public.portfolio_reflections;
CREATE POLICY "Anyone can add reflection" ON public.portfolio_reflections FOR INSERT TO anon, authenticated
WITH CHECK (
  code ~ '^[A-Z0-9][A-Z0-9-]{2,19}$'
  AND result_id IS NOT NULL
  AND char_length(btrim(difficulty)) BETWEEN 3 AND 2000
  AND char_length(btrim(next_step)) BETWEEN 3 AND 2000
);