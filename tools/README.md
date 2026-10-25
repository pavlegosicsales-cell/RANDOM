# tools/

Deterministic Python scripts that do the actual work: API calls, data
transformations, file operations, database queries.

- One script = one clear job. Keep them consistent, testable, and fast.
- Read credentials/keys from `.env` (never hardcode secrets).
- Before building a new tool, check whether one already exists here.
