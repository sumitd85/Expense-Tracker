# Step 02 — User Registration

## Overview

Implement user registration so new visitors can create a Spendly account. This step upgrades the existing stub `GET /register` route into a fully functional form that accepts a POST, validates input, hashes the password, and inserts a new row into the `users` table. On success the user is shown a success message and then redirected to the login page. This is the entry point for all authenticated features that follow.

## Depends on

Step 01 — Database setup (`users` table, `get_db()`)

---

## Routes

| Method | Path        | Access | Description                                              |
|--------|-------------|--------|----------------------------------------------------------|
| GET    | `/register` | public | Render registration form (upgrade existing stub)         |
| POST   | `/register` | public | Process form, insert user, redirect to `/login`          |

---

## Database changes

No new tables or columns. The existing `users` table (`id`, `name`, `email`, `password_hash`, `created_at`) covers all requirements.

### New helper — `database/db.py`

**`create_user(name, email, password)`**
- Hashes `password` with `werkzeug.security.generate_password_hash`
- Inserts a row into `users` using a parameterized query
- Returns the new user's `id`
- Raises `sqlite3.IntegrityError` if the email is already taken (UNIQUE constraint)

---

## Templates

**Modify:** `templates/register.html`

- Set form `action="{{ url_for('register') }}"` and `method="post"`
- Add `name` attributes to all inputs: `name`, `email`, `password`, `confirm_password`
- Add a block to display flashed error messages (e.g. "Email already registered", "Passwords do not match")
- Keep all existing visual design intact

---

## Files to change

| File                    | Change                                                          |
|-------------------------|-----------------------------------------------------------------|
| `app.py`                | Upgrade `register()` to handle GET and POST; flash + redirect   |
| `database/db.py`        | Add `create_user()` helper                                      |
| `templates/register.html` | Wire form `action`/`method` and flash message display         |

## Files to create

None.

---

## New dependencies

None. Uses `werkzeug.security` (already installed) and Flask's built-in `flash`, `redirect`, `url_for`.

---

## Implementation rules

- No SQLAlchemy or ORMs
- Parameterized queries only — never use f-strings in SQL
- Hash passwords with `werkzeug.security.generate_password_hash` — never store plaintext
- `app.secret_key` must be set in `app.py` for `flash()` to work (use a hardcoded dev string for now)
- Server-side validation must check:
  - All fields are non-empty
  - `password == confirm_password`
  - Email is not already registered (catch `sqlite3.IntegrityError`)
- On any validation failure: re-render the form with a flashed error message — do not redirect
- On success: flash a success message and redirect to `url_for('login')`
- Use `abort(405)` if an unsupported HTTP method reaches the route
- All templates extend `base.html`
- Use CSS variables — never hardcode hex values
- Use `url_for()` for every internal link — never hardcode URLs

---

## Definition of done

- [ ] `GET /register` renders the registration form without errors
- [ ] Submitting with all valid fields creates a new user in `users` and redirects to `/login`
- [ ] Submitting with mismatched passwords re-renders the form with an error message, no DB insert
- [ ] Submitting with an already-registered email re-renders the form with "Email already registered"
- [ ] Submitting with any empty field re-renders the form with a validation error
- [ ] Password is stored as a hash — never plaintext — verifiable by inspecting `spendly.db`
- [ ] No duplicate user is created on repeated valid submissions with the same email
