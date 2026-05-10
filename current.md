# ArkAnu — Requirements specification

Derived from live exploration of [ArkAnu login](https://devphp.coderkubes.com/arkanu/public/login) and authenticated areas (`/dashboard`, `/quotes/index`), plus public HTML for `/register` and `/forgot-password`. The product is a **customer logistics portal** centered on **freight quotes**, **carrier rates**, and **booking / tracking**.

---

## 1. Document control

| Field | Value |
|--------|--------|
| **Product name** | ArkAnu (branded “Ark Anu” in UI) |
| **Base URL** | `https://devphp.coderkubes.com/arkanu/public/` |
| **Primary personas** | Shipper / customer (guest account used for review) |
| **Date observed** | 2026-05-09 |

---

## 2. Product vision & scope

**Vision:** Let authenticated users manage **freight quote requests**, compare **carrier services and prices**, move toward **booking**, and monitor **status / tracking**, with a **logistics dashboard** (charts, KPIs, recent activity).

**In scope (observed):**

- Authentication (email/password, OAuth, registration, password recovery).
- Post-login **dashboard** with analytics widgets and quote/booking activity.
- **Quote list** with search, status filters, sorting, pagination, rate viewing, carrier selection, booking CTA, tracking CTA.
- **Multi-step “Create Quote”** flow (shipment, addresses, commodities, DG, accessorials, confirmation).
- **Account**: profile photo, personal info, international phone, email, notification settings, password change.

**Out of scope / not verified:** Admin/back-office, payment capture, email deliverability, exact API contracts, Google/Facebook OAuth behavior beyond redirect URLs.

---

## 3. Information architecture & routes

| Route / area | Purpose |
|----------------|---------|
| `/login` | Sign in |
| `/register` | New account |
| `/forgot-password` | Password reset request |
| `/auth/google/redirect`, `/auth/facebook/redirect` | Social login entry |
| `/dashboard` | Authenticated home / logistics overview |
| `/quotes/index` | “My Freight Quotes” list and quote actions |
| `/notifications` | Exists (session-protected; unauthenticated returns redirect to login) |

**Navigation (observed):**

- Header: brand **“Ark Anu”**, icon buttons (e.g. notifications / layout controls), **Create Quote**.
- User menu (opened from header): **My Profile**, **Settings**, **Log Out** (seen when interacting with brand area on dashboard).

---

## 4. Feature catalogue (by module)

### 4.1 Authentication & onboarding

| ID | Feature | Notes |
|----|---------|--------|
| AUTH-01 | Email + password login | Required fields; “Remember Me” checkbox |
| AUTH-02 | Google sign-in | Link to `/auth/google/redirect` |
| AUTH-03 | Facebook sign-in | Link to `/auth/facebook/redirect` |
| AUTH-04 | Forgot password | `/forgot-password`; email field; submit; return to login |
| AUTH-05 | Sign up | `/register`; full name, email, password, confirm password, terms acceptance |
| AUTH-06 | Post-login landing | Redirect to `/dashboard` after successful login |

**Requirements:**

- Validate credentials; show errors on failure (standard expectation; not fully exercised in spec).
- OAuth flows initiate from branded buttons on login/register.
- Password policy on registration/change: **minimum 8 characters** (stated on change-password UI).

---

### 4.2 Dashboard (`/dashboard`)

| ID | Feature | Notes |
|----|---------|--------|
| DASH-01 | Welcome / overview copy | e.g. “Welcome back! Here's your logistics overview” |
| DASH-02 | KPI summary | Four headline metrics (numeric cards observed) |
| DASH-03 | Date range filter | Options: All time, Last 6 / 3 months, Last 30 days, This month, Last month |
| DASH-04 | Booking Request Overview | Chart region (loading state observed) |
| DASH-05 | TQL Carrier Usage | Chart / analytics block |
| DASH-06 | Track Booking Status | Widget / chart block |
| DASH-07 | Recent Booking Requests | List/table region with **Create Quote** entry point |
| DASH-08 | Quote list affordances on dashboard | Search box; status chips: **All, Pending, Rejected, Approved, Confirmed** |

**Requirements:**

- Changing date range updates dependent widgets (charts/lists).
- KPIs and lists reflect same **status** and **time window** semantics as quotes list where applicable.

---

### 4.3 Quotes list & quote lifecycle (`/quotes/index`)

| ID | Feature | Notes |
|----|---------|--------|
| QLIST-01 | Page title / purpose | “My Freight Quotes”; subtitle about viewing status and details |
| QLIST-02 | Create Quote | Primary action opens / continues quote wizard |
| QLIST-03 | Search | Free-text **Search…** on quote list |
| QLIST-04 | Status filters | **All, Pending, Rejected, Approved, Confirmed** |
| QLIST-05 | Sortable grid | Columns: **Quote ID, Date, Origin, Destination, Available Rates, Status** (each “Activate to sort”) |
| QLIST-06 | Row actions | **View Rates**, **Order tracking now** per row |
| QLIST-07 | Pagination | Previous / numbered pages / Next |
| QLIST-08 | Carrier & pricing modal | **Select Carrier Service**; e.g. **R+L Carriers – Standard** vs **Guaranteed**; radio selection |
| QLIST-09 | Request booking | Button pattern **“Request Booking - $<price>”** (price in UI) |
| QLIST-10 | Freight quote summary | **Freight Quote** section with lifecycle labels **Pending Review**, **Approved**, **Completed** |
| QLIST-11 | Lane summary | Pick/Drop **City, State, Zip Code** |
| QLIST-12 | Back navigation in modal | **←** control in modal context |

**Requirements:**

- Table supports **multi-column sort** (or cycle sort per column—behavior to confirm with product).
- **View Rates** loads carrier options and price for the selected quote context.
- **Request Booking** confirms selected carrier/service at displayed price (backend rules not visible).
- **Order tracking now** deep-links or opens tracking experience (implementation not inspected).

---

### 4.4 Create Quote wizard (modal / multi-step)

Observed steps and fields (labels from UI):

1. **Shipment information**  
   - Pickup location type*, Drop location type*, Shipment date*.

2. **Pickup details**  
   - Company name*, Country*, State*, City*, Postal code*, Address lines (1 required, 2 optional), Contact phone*.

3. **Delivery details**  
   - Same address structure; **Contact email** (optional label), **Contact number***.

4. **Add quote commodities**  
   - Product description*, Quantity*, Unit type*, Freight class code*, Weight (lbs)*, L/W/H (inches)*, NMFC / Sub-NMFC optional.  
   - **Dangerous goods (DG)?** Yes/No with conditional **UN number, Packing group, Hazardous class, Proper shipping name, Emergency contact name/phone**.  
   - **Additional services (accessorials)**.

5. **Origin options (pickup)**  
   Toggles/flags: Origin liftgate, Residential pickup, Limited access pickup, Inside pickup.

6. **Destination options (delivery)**  
   Destination liftgate, Residential delivery, Limited access delivery, Inside delivery, Delivery appointment, Sort and segregate.

7. **Navigation**  
   **Back** / **Next** between steps.

8. **Success**  
   Message: quote submitted for review; team will verify and update status.

**Requirements:**

- Enforce required field validation per step before **Next**.
- Conditional DG block visible and required when DG = Yes.
- Persist draft or abandon behavior: not observed—flag as **open requirement** if autosave is needed.

---

### 4.5 Account, profile & settings (modal)

| ID | Feature | Notes |
|----|---------|--------|
| PROF-01 | Profile header | Display name (e.g. “guest”) |
| PROF-02 | Upload photo | Avatar / photo upload |
| PROF-03 | Personal information | First name*, Last name*, Contact phone* with **country calling code** combobox (large country list) |
| PROF-04 | Email | Editable email* |
| PROF-05 | Notification settings | Section heading present (specific toggles not fully enumerated in snapshot) |
| PROF-06 | Change password | Current*, New* (min 8 chars), Confirm* |
| PROF-07 | Actions | **Cancel**, **Save Changes** |

---

### 4.6 Global UI & compliance

| ID | Feature | Notes |
|----|---------|--------|
| GLB-01 | Branding & footer | “© 2026 ArkAnu. All rights reserved.” |
| GLB-02 | Responsive layout | Sidebar / drawer toggles observed |
| GLB-03 | Session security | Laravel-style session + CSRF on forms (forgot-password/register HTML) |

---

## 5. Non-functional requirements (proposed)

- **Security:** HTTPS; CSRF tokens on forms; authenticated routes redirect unauthenticated users to `/login`.
- **Performance:** Chart widgets should load within acceptable SLA; show loading states (**Booking Request Overview** showed “Loading chart…”).
- **Accessibility:** Table sort controls expose “Activate to sort”; broader WCAG pass not verified.
- **Internationalization:** Phone control supports many regions; copy is English.

---

## 6. Open questions / assumptions

1. **Settings** and **My Profile** targets: menu entries seen; exact URLs not confirmed beyond modal-based profile.
2. **`/notifications`**: requires session; UI content not captured after redirect when session was missing.
3. **OAuth**: only redirect endpoints confirmed from HTML, not token exchange or account linking rules.
4. **“TQL Carrier Usage”** naming suggests a specific integration (TQL); scope of carriers and rating engine is **implementation-dependent**.

---

## 7. Traceability summary

| User goal | Primary features |
|-----------|-------------------|
| Access account | Login, OAuth, Register, Forgot password |
| Understand workload | Dashboard KPIs, charts, recent requests |
| Request pricing | Create Quote wizard, success confirmation |
| Compare & buy | Quotes list, View Rates, carrier choice, Request Booking |
| Track shipments | Order tracking now (from list) |
| Maintain profile | Photo, personal data, notifications, password |
