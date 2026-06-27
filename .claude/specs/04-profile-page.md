# Step 04 — Profile Page

## Overview

Replace the `/profile` stub with a fully designed profile page showing static, hardcoded data. The goal is to establish the complete UI layout — user info card, transaction history table, summary stats, and category breakdown — before any real database queries are wired up in Step 5. Building the UI first lets the team validate the design in isolation and ensures the templates are ready for the backend-connection step.

## Depends on

- Step 01 — Database Setup (schema must exist)
- Step 02 — Registration (user accounts must be creatable)
- Step 03 — Login + Logout (session must be set; `/profile` must be a protected route)

---

## Routes

| Method | Path       | Access          | Description                                              |
|--------|------------|-----------------|----------------------------------------------------------|
| GET    | `/profile` | logged-in only  | Render profile page; redirect to `/login` if not authed  |

---

## Database changes

None. The existing `users` and `expenses` tables are sufficient.

---

## Templates

**Create:** `templates/profile.html` — full profile page extending `base.html`, containing four sections:

1. **User info card** — avatar initials, name, email, member-since date (all hardcoded)
2. **Summary stats row** — total spent, number of transactions, top category (hardcoded)
3. **Transaction history table** — recent expenses with date, description, category badge, amount (hardcoded rows; minimum 3)
4. **Category breakdown** — per-category totals as a simple list or progress-bar rows (hardcoded; minimum 3 categories)

---

## Files to change

| File      | Change                                                                                                      |
|-----------|-------------------------------------------------------------------------------------------------------------|
| `app.py`  | Replace the `/profile` stub with a real view function that guards auth and passes hardcoded context to the template |

## Files to create

| File                      | Description              |
|---------------------------|--------------------------|
| `templates/profile.html`  | Full profile page layout |

---

## New dependencies

None.

---

## Implementation rules

- No SQLAlchemy or ORMs — use raw `sqlite3` via `get_db()` if any DB call is ever needed
- Parameterized queries only — never string-format SQL
- Use CSS variables — never hardcode hex values
- No inline styles in the template
- All templates extend `base.html`
- Authentication guard: check `session.get("user_id")`; if absent, `redirect(url_for("login"))`
- All data passed to the template must be hardcoded Python dicts/lists in `app.py` — no DB queries in this step
- Category badges must use a CSS class, not inline colour styles
- Use `url_for()` for every internal link — never hardcode paths

---

## Definition of done

- [ ] Visiting `/profile` without being logged in redirects to `/login`
- [ ] Visiting `/profile` while logged in returns HTTP 200
- [ ] The page displays a user info card with a name and email
- [ ] The page displays at least three summary stat values (e.g. total spent, transaction count, top category)
- [ ] The page displays a transaction history table with at least three hardcoded rows
- [ ] The page displays a category breakdown section with at least three categories
- [ ] The navbar shows the logged-in state (username + logout link)
- [ ] No hex colour values appear in `profile.html` — only CSS variables
