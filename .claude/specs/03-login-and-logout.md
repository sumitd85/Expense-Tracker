# Step 03 — Login and Logout

## Overview

Implement user authentication for Spendly. Converts the `/login` stub into a functional POST handler that verifies credentials against the database, stores the authenticated user's ID in the session, and redirects to the landing page. Also implements the `/logout` stub, which clears the session and redirects to the landing page. After this step, the app can distinguish logged-in users from guests — a prerequisite for all expense features.

## Depends on

- Step 01 — Database Setup (`users` table must exist)
- Step 02 — Registration (`create_user` and password hashing must be in place; a user must exist to log in against)

---

## Routes

| Method | Path      | Access | Description                                          |
|--------|-----------|--------|------------------------------------------------------|
| GET    | `/login`  | public | Render login form                                    |
| POST   | `/login`  | public | Validate credentials, set session, redirect          |
| GET    | `/logout` | public | Clear session, redirect to `/` (no login required)   |

---

## Database changes

None. The `users` table from Step 01 already stores `email` and `password_hash`.

### New helper — `database/db.py`

**`get_user_by_email(email)`**
- Queries `users` by `email` using a parameterized query
- Returns the matching `sqlite3.Row`, or `None` if not found
- Must live in `database/db.py` — not inline in the route

---

## Templates

**Modify:** `templates/login.html`
- Add a `<form>` with `action="{{ url_for('login') }}"` and `method="post"`
- Add inputs with `name="email"` and `name="password"`
- Add a block to display flashed error messages
- Add a link to `/register` for new users
- Keep all existing visual design intact

---

## Files to change

| File                    | Change                                                              |
|-------------------------|---------------------------------------------------------------------|
| `app.py`                | Implement `login()` as GET+POST handler; implement `logout()`       |
| `database/db.py`        | Add `get_user_by_email()` helper                                    |
| `templates/login.html`  | Add POST form, flash display, and register link                     |

## Files to create

None.

---

## New dependencies

None. `werkzeug.security.check_password_hash` is already available via the existing `werkzeug` install.

---

## Implementation rules

- No SQLAlchemy or ORMs — use raw `sqlite3` via `get_db()`
- Parameterized queries only — never use f-strings in SQL
- Verify passwords with `werkzeug.security.check_password_hash`
- Session key for the logged-in user must be `session["user_id"]` (integer)
- Use `flask.session` — do not roll a custom session mechanism
- On failed login show a generic flash error: `"Invalid email or password."` — do not reveal which field was wrong
- After successful login redirect to `url_for("landing")` until a dashboard route exists
- `logout()` must call `session.clear()` then redirect to `url_for("landing")`
- `get_user_by_email` belongs in `database/db.py`, not inline in the route
- All templates extend `base.html`
- Use CSS variables — never hardcode hex values
- Use `url_for()` for every internal link — never hardcode paths

---

## Definition of done

- [ ] `GET /login` renders the login form with email and password fields
- [ ] Submitting with valid credentials (e.g. `demo@spendly.com` / `password123`) sets `session["user_id"]` and redirects to `/`
- [ ] Submitting with a wrong password shows `"Invalid email or password."` flash and stays on the login page
- [ ] Submitting with an unregistered email shows the same generic error flash
- [ ] `GET /logout` clears the session and redirects to `/`
- [ ] After logout, `session["user_id"]` is no longer present
- [ ] The `/logout` route no longer returns the raw stub string
