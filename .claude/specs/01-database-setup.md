# Step 01 — Database Setup

## 1. Overview

- Replaces the stub functions in `database/db.py` with a working SQLite implementation
- This is the foundational step: every subsequent feature depends on the database being available and correctly structured
- Authentication (registration, login), the profile page, and all expense tracking features require both the `users` and `expenses` tables to exist with correct constraints
- Without this step, no other step can be built or tested

## 2. Depends on

- None — this is the first step; it has no prerequisites

## 3. Routes

- No new routes
- Existing placeholder routes in `app.py` remain unchanged

## 4. Database Schema

### Table A: `users`

| Column        | SQLite Type | Constraints                        |
|---------------|-------------|------------------------------------|
| id            | INTEGER     | PRIMARY KEY AUTOINCREMENT          |
| name          | TEXT        | NOT NULL                           |
| email         | TEXT        | NOT NULL UNIQUE                    |
| password_hash | TEXT        | NOT NULL                           |
| created_at    | TEXT        | NOT NULL DEFAULT CURRENT_TIMESTAMP |

### Table B: `expenses`

| Column      | SQLite Type | Constraints                                       |
|-------------|-------------|---------------------------------------------------|
| id          | INTEGER     | PRIMARY KEY AUTOINCREMENT                         |
| user_id     | INTEGER     | NOT NULL REFERENCES users(id)                     |
| amount      | REAL        | NOT NULL                                          |
| category    | TEXT        | NOT NULL                                          |
| date        | TEXT        | NOT NULL — must always be in YYYY-MM-DD format    |
| description | TEXT        | (none)                                            |
| created_at  | TEXT        | NOT NULL DEFAULT CURRENT_TIMESTAMP                |

## 5. Functions to Implement (`database/db.py`)

- **`get_db()`**
  - Opens `spendly.db` in the project root
  - Sets `row_factory = sqlite3.Row` so columns are accessible by name
  - Runs `PRAGMA foreign_keys = ON` to enable FK enforcement
  - Returns the open connection

- **`init_db()`**
  - Creates both tables using `CREATE TABLE IF NOT EXISTS`
  - Safe to call multiple times — must not fail or duplicate tables on repeated calls
  - Commits and closes the connection before returning

- **`seed_db()`**
  - Checks `SELECT COUNT(*) FROM users`; if the count is greater than 0, returns immediately without inserting anything
  - Otherwise inserts one demo user:
    - `name`: Demo User
    - `email`: demo@spendly.com
    - `password`: demo123, hashed via `werkzeug.security.generate_password_hash`
  - Inserts 8 sample expenses linked to the demo user's `id`, covering all 7 categories, with dates spread across the current month
  - Commits and closes the connection before returning

## 6. Changes to `app.py`

- Import `get_db`, `init_db`, `seed_db` from `database.db`
- Call `init_db()` and `seed_db()` inside `with app.app_context():` immediately after the app is created
- The database must be fully initialised and seeded before any route is served

## 7. Files to Change

- `database/db.py` — replace stub bodies with working implementation
- `app.py` — add imports and startup calls inside `app.app_context()`

## 8. Files to Create

- None

## 9. Dependencies

- No new pip packages
- Use `sqlite3` from the Python standard library
- Use `werkzeug.security.generate_password_hash` — `werkzeug` is already listed in `requirements.txt`

## 10. Categories (Fixed List)

- Food
- Transport
- Bills
- Health
- Entertainment
- Shopping
- Other

These are the only valid category values for the `expenses` table.

## 11. Rules for Implementation

- No ORM, no SQLAlchemy — use raw `sqlite3` only
- Parameterized queries only — never use string formatting or f-strings in SQL
- `PRAGMA foreign_keys = ON` must be issued on every connection, inside `get_db()`
- Store `amount` as `REAL`, not `INTEGER`
- Hash passwords with `generate_password_hash` from `werkzeug.security` — never store plaintext
- `seed_db()` must be idempotent — safe to call multiple times with no side effects after the first call
- Dates must always be stored as `YYYY-MM-DD` text strings

## 12. Expected Behavior

- **`get_db()`** — when called, returns an open `sqlite3.Connection` with `row_factory = sqlite3.Row` set and foreign key enforcement active; the caller is responsible for closing it
- **`init_db()`** — when called on a fresh database, creates both tables; when called again on an existing database, completes without error and leaves existing data intact
- **`seed_db()`** — when called on an empty database, inserts exactly 1 user and 8 expenses; when called again on a database that already has users, exits immediately and leaves all data unchanged
- **Database-level constraints** must enforce:
  - `users.email` uniqueness — duplicate emails are rejected at the DB level
  - `expenses.user_id` referential integrity — inserting an expense with a non-existent `user_id` fails

## 13. Error Handling Expectations

- Inserting a duplicate email → SQLite raises `UNIQUE constraint failed: users.email`; this must propagate as `sqlite3.IntegrityError` for callers to handle
- Inserting an expense with an invalid `user_id` → SQLite raises a foreign key constraint failure (requires `PRAGMA foreign_keys = ON` to be active); this must propagate as `sqlite3.IntegrityError`
- Invalid or malformed queries → must raise clear Python exceptions that surface the root cause for debugging; do not swallow exceptions silently

## 14. Definition of Done

- [ ] Database file (`spendly.db`) is created in the project root on app startup
- [ ] Both `users` and `expenses` tables exist with correct columns and constraints
- [ ] Demo user (`demo@spendly.com`) exists with a hashed password — never plaintext
- [ ] 8 sample expenses exist, linked to the demo user, spanning all 7 categories
- [ ] No duplicate seed data is created on repeated runs of the app
- [ ] App starts without errors after the changes to `app.py`
- [ ] Foreign key enforcement is active: inserting an expense with a non-existent `user_id` raises a constraint error
- [ ] All SQL in `db.py` uses parameterized `?` placeholders — no string-formatted values
