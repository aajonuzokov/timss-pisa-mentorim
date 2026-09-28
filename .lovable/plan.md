# Connect TIMSS/PISA test results to the `test_results` table

## What exists today (inspection)

- `src/routes/timss.tsx` — TIMSS page. Picks a category (Knowing / Applying / Reasoning) and renders the shared `Quiz` component. Changing category remounts `Quiz` (fresh test).
- `src/routes/pisa.tsx` — PISA page. Renders the same `Quiz` component with all PISA questions.
- `src/components/Quiz.tsx` — the only place with test logic:
  - **Test start:** when `Quiz` mounts (no explicit start step; no name/university/course is collected anywhere).
  - **Answers:** stored in `answers` state (`{ questionId: chosenIndex }`) via `select()`.
  - **Scoring:** the `result` memo computes `correct`, `total`, `pct`.
  - **Final result:** shown after the "Natijani tekshirish" button sets `submitted = true` (Trophy box with score, % and level text: A'lo / Yaxshi / O'rta / Quyi).

## Important finding

The `test_results` table does **not** exist in this project's database (the project is connected to its own Lovable Cloud database, not the one where you created the table). I will create it here with exactly your columns, plus security rules.

## Data flow

```text
Quiz mounts  -> record started_at
User answers -> answers state (unchanged)
"Natijani tekshirish" click
   -> existing scoring (unchanged) -> correct, total, pct, level
   -> save row to test_results:
        full_name, university, course   (from a small participant form)
        test_type  ("TIMSS - Bilish" / "TIMSS - Qo'llash" / "TIMSS - Mulohaza" / "PISA")
        score = correct, total_questions = total, percentage = pct
        level = existing level text
        answers = { questionId: chosenIndex, ... }
        started_at, completed_at = now
   -> toast "Natija saqlandi" / error toast; result box shows as today
```

## Open decision: participant details

Nothing in the current UI asks for full name, university or course. Options:
1. Add a small inline form (3 fields) above the questions inside the existing header card, styled with existing inputs — minimal UI addition, required before submitting.
2. Save without these fields (leave them empty) for now.

I recommend option 1. Please confirm.

## Files to modify

- **Database migration (new):** create `test_results` with your columns; allow anyone to insert results (students are not signed in); no public reading of results (protects personal data).
- `src/components/Quiz.tsx` — add `testType` prop, `started_at` tracking, save-on-submit, participant fields (if option 1). Questions and scoring untouched.
- `src/routes/timss.tsx` — pass `testType` per category.
- `src/routes/pisa.tsx` — pass `testType="PISA"`.
