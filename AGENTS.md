# Project architecture

- Item-level CSV exports are generated in the browser from already-authorized result reads and version-matched banks; retain raw answers and unresolved IDs to avoid inventing historical scores.
- Store checkbox acceptance time in answers._meta.consent_at, clear restored profile consent, and export consent only from recorded evidence; historical submission times must never stand in for acceptance times.