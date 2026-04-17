# Google Stitch UI Generation Prompt
# AT Ticket System — Full Platform UI Specification
# Version 2 — Algérie Télécom Brand · Admin First

---

## PLATFORM OVERVIEW

You are generating the complete UI for **AT Ticket System**, a professional web platform for managing hosting infrastructure issue tickets. The system integrates a RAG AI engine that automatically analyzes tickets, conducts clarification conversations with developers, and either resolves tickets autonomously or escalates them to the right engineer with a full context summary.

**CRITICAL REQUIREMENT:** You must explicitly follow the Stitch UI that is connected with MCP and generate the entire application using React UI and components.

The backend is a fully working FastAPI REST API (base URL: `http://localhost:8000/api/v1`). Every screen described below maps directly to real, tested endpoints. Authentication uses JWT Bearer tokens stored in memory and sent via `Authorization: Bearer <token>` headers on all protected requests.

---

## DESIGN DIRECTION

### React UI & MCP Integration
All components described below must be translated into React functional components. Use hooks for state management and API integration. Ensure the architecture seamlessly connects with the MCP-integrated Stitch UI generation workflow.

**Mock Data to API Integration Workflow (CRITICAL):**
The UI will initially be built with mock data, which will later be replaced by the live FastAPI backend. To make this transition effortless:
1. **Do NOT hardcode data directly inside UI components.**
2. Create an **abstraction layer**: use custom hooks (e.g., `useTickets()`, `useStats()`) or a mock API service file that returns the mock data.
3. The mock data must strictly follow the expected FastAPI response schemas described in this document. 
4. When we are ready to connect to the backend, we will only need to swap the internals of these hooks/services to make real `fetch` or `axios` calls, leaving the UI components completely untouched.

**Smart Routing & Architecture:** Use modern routing (e.g., `react-router-dom`) to logically link pages (like clicking a ticket row in the Dashboard to open the Ticket Detail view). Break down the UI into highly modular, reusable components (e.g., StatusBadge, TicketCard, ActionModal) that accept props dynamically instead of hardcoding repetitive structures.
**Interactivity & Smooth Transitions:** Ensure the UI feels highly responsive and fluid. Implement smooth hover effects, micro-interactions on actionable items (buttons, rows, links), and seamless transitions between pages or component states. Modals, dropdowns, and side-drawers (like the notification panel) must enter and exit with smooth animations (e.g., slide-in, soft fade-in) without abrupt snaps or layout shifts.

### Theme: Clean Professional Modernism
**Core Concept:** A precision management platform built on the trusted identity of Algérie Télécom — structured, authoritative, and human. The interface should feel like a well-organized operations center: information-dense but never cluttered, technical but never cold.

**Visual Metaphor:** "A control room with daylight" — every metric is immediately readable, every action is intentional, and the brand colors carry authority without heaviness.

---

### Color Palette

**Brand Colors (Algérie Télécom):**
- Primary Blue: `#0056B3`
- Primary Blue Dark: `#003F82`
- Primary Blue Light (tints/hover): `#E8F1FB`
- Accent Yellow: `#FFC107`
- Accent Yellow Light: `#FFF8E1`
- Accent Yellow Dark (text on yellow): `#7A5800`

**Neutral Surface System:**
- Page Background: `#F0F4F9` (cool light grey, not pure white)
- Card / Panel Background: `#FFFFFF`
- Card Border: `#E0E8F1`
- Divider: `#EDF2F7`
- Input Background: `#F7FAFC`
- Input Border: `#CBD5E0`
- Input Border Focus: `#0056B3`

**Text:**
- Text Primary: `#1A202C`
- Text Secondary: `#4A5568`
- Text Muted: `#718096`
- Text on Blue: `#FFFFFF`
- Text on Yellow: `#7A5800`

**Semantic Colors:**
- Success: `#2F855A` / light `#F0FFF4`
- Warning: `#C05621` / light `#FFFAF0`
- Danger: `#C53030` / light `#FFF5F5`
- Info: `#2B6CB0` / light `#EBF8FF`

---

### Status Badge Definitions
Each badge is a small pill with colored background and matching text — no border:

| Status | Background | Text |
|---|---|---|
| `OPEN` | `#E8F1FB` | `#0056B3` |
| `AWAITING_CLARIFICATION` | `#FFF8E1` | `#7A5800` |
| `IN_PROGRESS` | `#EBF8FF` | `#2B6CB0` |
| `AUTO_RESOLVED` | `#E6FFFA` | `#285E61` |
| `RESOLVED` | `#F0FFF4` | `#2F855A` |

---

### Typography
- **Font:** Inter (primary) — import from Google Fonts
- **Display / Page Titles:** `Inter 700`, 24–28px, color `#1A202C`
- **Section Headers:** `Inter 600`, 16–18px, color `#1A202C`
- **Body / Table:** `Inter 400`, 14px, color `#4A5568`
- **Labels / Captions:** `Inter 500`, 12px, color `#718096`, uppercase tracking for column headers
- **Numeric / ID values:** `Inter Mono` or monospace fallback, 13px, color `#2D3748`
- **Generous line-height:** 1.6 for body text, 1.3 for headers

---

### Component Style Rules

**Cards:**
- White background `#FFFFFF`
- Border: `1px solid #E0E8F1`
- Border-radius: `10px`
- Box-shadow: `0 1px 4px rgba(0, 86, 179, 0.06), 0 4px 16px rgba(0,0,0,0.04)`
- Padding: `24px`
- Hover (clickable cards): shadow deepens to `0 4px 20px rgba(0, 86, 179, 0.12)`

**Buttons:**
- Primary: `#0056B3` background, white text, `border-radius: 8px`, `padding: 10px 20px`, hover `#003F82`
- Secondary: white background, `1px solid #CBD5E0`, `#4A5568` text, hover border `#0056B3`
- Danger: `#C53030` background, white text
- Accent (CTA): `#FFC107` background, `#7A5800` text — use sparingly for key primary actions
- All buttons: `Inter 500`, 14px, no uppercase

**Inputs & Selects:**
- Background `#F7FAFC`, border `1px solid #CBD5E0`, border-radius `8px`
- Focus: border `#0056B3`, soft blue glow `0 0 0 3px rgba(0, 86, 179, 0.12)`
- Label above input, `Inter 500` 13px, `#4A5568`

**Tables:**
- White background, `border-radius: 10px`, outer card shadow
- Column headers: `Inter 500`, 12px, `#718096`, uppercase, `letter-spacing: 0.05em`, background `#F7FAFC`
- Row border: `1px solid #EDF2F7`
- Row hover: `#F0F4F9` background
- Row height: `52px`
- First column (ID): monospace, muted color

**Sidebar Navigation:**
- Background: `#0056B3` (blue)
- Logo / Platform name at top in white
- Nav links: white text `Inter 500` 14px, `padding: 12px 20px`, `border-radius: 8px`
- Active link: `#FFC107` accent yellow background, `#7A5800` text, slightly indented
- Hover: `rgba(255,255,255,0.12)` overlay
- Bottom section: profile avatar + name + logout

**Top Header Bar:**
- Background: `#FFFFFF`, `border-bottom: 1px solid #E0E8F1`
- Height: `64px`
- Contains: page breadcrumb (left), notification bell + avatar (right)

**Modals:**
- Backdrop: `rgba(0,0,0,0.35)`
- Modal card: white, `border-radius: 12px`, `max-width: 480px`, shadow `0 20px 60px rgba(0,0,0,0.18)`
- Header: title `Inter 600` 18px + close X button
- Footer: action buttons right-aligned
- Smooth fade + slide-up animation on open

**Notification Drawer:**
- Slides in from the right, `width: 360px`
- Background: white, left shadow
- Each notification row: white, hover `#F0F4F9`, unread dot in `#FFC107`

**Form Sections:**
- Group related fields under a subtle section heading
- Dividers between sections: `1px solid #EDF2F7`

**Charts / Data Viz (Dashboard):**
- Use clean donut charts and bar charts
- Chart colors follow brand palette: primary blue for main data, yellow for secondary, teal for AI-resolved, grey for neutral
- No chart borders — rely on negative space and color contrast
- Tooltip cards: white, rounded, subtle shadow

**Toasts:**
- Bottom-right, `border-radius: 8px`, `min-width: 280px`
- Success: white card with `3px solid #2F855A` left border, green check icon
- Error: white card with `3px solid #C53030` left border, red X icon
- Info: white card with `3px solid #0056B3` left border, blue info icon
- Auto-dismiss success/info: 4s. Error: persist until dismissed.

**Skeleton Loaders:**
- Light grey `#EDF2F7` animated shimmer for table rows and cards while loading

---

### Layout Principles
- **Sidebar width:** `240px` fixed, left side
- **Main content:** fluid, `padding: 32px`
- **Max content width:** `1280px`, centered
- **Grid:** 12-column, `24px` gutters
- **Section spacing:** `32px` between major page sections
- **Filter bar:** full-width card above the main table, `padding: 16px 24px`

---
---

## SHARED AUTH SCREENS

These screens are role-agnostic and shown before any user is authenticated.

---

### SCREEN: Login
**Route:** `/login`
**API:** `POST /auth/login` — body: `{ email, password }` → returns `{ access_token, refresh_token, token_type }`

**UI:**
- Full-page split layout: left half is a brand panel, right half is the login form
- **Left panel:** solid `#0056B3` blue background, large AT Ticket System logo centered, white tagline "Plateforme de gestion des tickets d'hébergement", and a subtle yellow `#FFC107` geometric accent shape in the bottom corner
- **Right panel:** white background, vertically centered form card (no extra card border — the white panel IS the card)
- Platform name "AT Ticket System" in `Inter 700` 24px, `#0056B3`, above the form
- Subtitle: "Connectez-vous à votre espace" in `#718096`
- Email input with envelope icon prefix
- Password input with lock icon prefix and show/hide toggle
- "Se connecter" primary blue button (full width)
- On submit: call login endpoint, store tokens in memory, decode JWT to extract `role`, then redirect:
  - `DEVELOPER` → `/developer/dashboard`
  - `ENGINEER` → `/engineer/dashboard`
  - `ADMIN` → `/admin/dashboard`
- Inline error banner on 401: "Identifiants incorrects. Veuillez réessayer."
### SCREEN: Admin Dashboard — Statistics
**Route:** `/admin/dashboard`
**API:** `GET /admin/stats` → `Stats`

**UI — KPI Row (6 cards in a responsive grid):**

| Card | Value from API | Style |
|---|---|---|
| Total Tickets | `total_tickets` | Blue icon, neutral |
| Tickets Ouverts | `open_tickets` | Blue accent |
| Résolus par l'IA | `auto_resolved_tickets` + `ai_resolved_percentage`% | Teal/green |
| Résolus par ingénieur | `resolved_by_engineer_tickets` + `engineer_resolved_percentage`% | Green |
| Total Escalades | `total_escalations` | Yellow accent |
| Signalements | `total_misassignments` | Red if > 0, grey if 0 |

Each KPI card: white rounded card, large bold number in brand blue, label in muted text, small icon top-right in light blue circle

**UI — Metrics Row (2 wider cards):**
- Avg Resolution Time: `avg_resolution_time` displayed in hours, with a thin horizontal progress bar (blue)
- Avg AI Confidence Score: `avg_ai_confidence_score` as a percentage, with a circular gauge (teal)

**UI — Charts Row:**
- **Donut chart** (left): "Répartition des résolutions" — slices: AI Resolved (teal), Engineer Resolved (blue), Open (yellow)
- **Bar chart** (right): "Résolutions par statut" — bars for each `StatusEnum` value, colored by status badge color
- Both charts: white card, clean legend, no gridlines, tooltip on hover

---

### SCREEN: Admin — Tous les tickets
**Route:** `/admin/tickets`
**API:** `GET /admin/tickets?status=&developer_id=&engineer_id=&skip=0&limit=10` → `PaginatedResponse[TicketOut]`

**UI:**
- Page title: "Tous les Tickets"
- **Filter bar card** (above table): three inline fields — Status dropdown, Developer ID number input, Engineer ID number input — followed by "Filtrer" blue button and "Réinitialiser" secondary button
- **Data table:**
  - Columns: `#`, `Titre`, `Catégorie`, `Statut` (badge), `Développeur ID`, `Ingénieur ID`, `Créé le`, `Actions`
  - Each row: clickable title cell shows ticket ID and title
  - "Assigner" action button per row (opens Assign modal)
    - **MODAL: Assigner un ingénieur**
      - Title: "Assigner un ingénieur"
      - Field: "ID de l'ingénieur" (number input)
      - Button: "Confirmer l'assignation" (blue primary)
      - API: `PATCH /admin/tickets/:id/assign` — body: `{ engineer_id }` → `200 TicketOut`
      - On success: toast "Ingénieur assigné avec succès", refresh table
- Pagination: "Précédent / Suivant" + page info "Page X sur Y"

---

### SCREEN: Admin — Gestion des utilisateurs
**Route:** `/admin/users`
**API LIST:** `GET /admin/users?skip=0&limit=10` → `PaginatedResponse[UserOut]`

**UI:**
- Page title: "Gestion des Utilisateurs"
- **Action bar:** three buttons top-right: "＋ Ajouter un ingénieur" (blue), "＋ Ajouter un développeur" (secondary), "＋ Ajouter un admin" (secondary)
- **Data table:**
  - Columns: `#`, `Nom`, `Email`, `Rôle` (badge), `Entreprise / Spécialité`, `Niveau`, `Disponibilité` (green dot / grey dot), `Créé le`, `Actions`
  - Per-row: "Modifier" button (pencil icon) + "Supprimer" button (trash icon, red)
  - Delete → confirmation dialog: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
    - API: `DELETE /admin/users/:id`
    - On self-delete attempt (409): error toast "Vous ne pouvez pas supprimer votre propre compte."
    - On last admin delete attempt (409): error toast "Impossible de supprimer le dernier administrateur."

**MODAL: Ajouter un ingénieur**
- API: `POST /admin/users/engineer` — body: `{ name, email, password, specialite?, niveau?, disponibilite? }` → `201 UserOut`
- Fields: Nom (text), Email (email), Mot de passe (password), Spécialité (text, optional), Niveau (dropdown: `JUNIOR`, `MID`, `SENIOR`), Disponible (toggle switch, default ON)
- On 409: inline error "Cet email est déjà utilisé."
- On success: toast "Ingénieur créé avec succès", close modal, refresh table

**MODAL: Ajouter un développeur**
- API: `POST /admin/users/developer` — body: `{ name, email, password, entreprise? }` → `201 UserOut`
- Fields: Nom, Email, Mot de passe, Entreprise (text, optional)
- On success: toast "Développeur créé avec succès"

**MODAL: Ajouter un admin**
- API: `POST /admin/users/admin` — body: `{ name, email, password }` → `201 UserOut`
- Fields: Nom, Email, Mot de passe
- Yellow warning banner inside modal: "⚠️ Les administrateurs ont un accès complet à la plateforme."
- On success: toast "Administrateur créé avec succès"

**MODAL: Modifier un développeur**
- API: `PATCH /admin/users/:id/developer` — body: `{ name?, email?, password?, entreprise? }` → `200 UserOut`
- Pre-fills all current values
- On success: toast "Profil mis à jour"

**MODAL: Modifier un ingénieur**
- API: `PATCH /admin/users/:id/engineer` — body: `{ name?, email?, password?, specialite?, niveau?, disponibilite? }` → `200 UserOut`
- Pre-fills all current values including Niveau dropdown and Disponibilité toggle
- On success: toast "Profil mis à jour"

---

### SCREEN: Admin — Signalements de mauvaise assignation
**Route:** `/admin/misassignments`
**API LIST:** `GET /admin/misassignments?skip=0&limit=10` → `PaginatedResponse[ReportOut]`

**UI:**
- Page title: "Signalements d'assignation"
- Subtitle: "Rapports soumis par les ingénieurs lorsqu'un ticket leur semble mal assigné."
- **Status filter tabs** (pill-style tabs, not dropdown): `Tous` | `PENDING` | `REVIEWED` | `REASSIGNED`
- **Data table:**
  - Columns: `#`, `Ticket ID`, `Ingénieur signalant`, `Raison` (truncated, 60 chars), `Statut` (badge), `Signalé le`, `Actions`
  - PENDING rows: `4px solid #FFC107` left accent border on the row
  - Per-row actions: "Voir" (eye icon) + "Réassigner" button (only shown if status ≠ REASSIGNED)

**MODAL: Détail du signalement**
- API: `GET /admin/misassignments/:id` → `ReportOut`
- Shows: full reason text in a grey quote block, Ticket ID (clickable link), Ingénieur ID, Statut badge, Signalé le, Résolu le (if present)
- "Réassigner le ticket" yellow accent button at the bottom of this modal → opens Reassign modal

**MODAL: Réassigner l'ingénieur**
- API: `PATCH /admin/misassignments/:id/reassign` — body: `{ new_engineer_id }` → `200 TicketOut`
- Field: "ID du nouvel ingénieur" (number input)
- Warning note below input: "⚠️ Vous ne pouvez pas réassigner au même ingénieur."
- "Confirmer la réassignation" blue primary button
- On success: toast "Ticket réassigné — le nouvel ingénieur a été notifié", close modal, refresh table
- On 409 (same engineer): inline error "Cet ingénieur est déjà assigné à ce ticket."

---

### SCREEN: Admin — Base de connaissances
**Route:** `/admin/kb`
**API:** `GET /admin/kb?skip=0&limit=10` → `PaginatedResponse[KBEntryOut]`

**UI:**
- Page title: "Base de Connaissances"
- Subtitle: "Alimentée automatiquement à chaque résolution par un ingénieur."
- Info banner (blue tint): "🧠 Ces entrées sont utilisées par le moteur IA pour résoudre automatiquement les futurs tickets similaires."
- **Data table:**
  - Columns: `#`, `Ticket source`, `Description du problème` (truncated), `Solution` (truncated), `Créé le`
  - Row click → expands the row inline (accordion) to show full `problemDescription` text and full `solution` text in a grey block
  - No edit/delete actions — read-only
- Pagination controls

---

### SCREEN: Admin — Logs IA
**Route:** `/admin/logs/ai`
**API:** `GET /admin/logs/ai?skip=0&limit=10` → `PaginatedResponse[AIDecisionLogOut]`

**UI:**
- Page title: "Logs de décision IA"
- Info banner: "Ces logs sont générés à chaque analyse d'un ticket par le moteur IA."
- **Data table:**
  - Columns: `#`, `Ticket ID`, `Décision` (badge), `Raison`, `Score richesse`, `Score similarité`, `Durée (ms)`, `Créé le`
  - Decision badge colors: `AUTO_RESOLVE` → teal, `OPEN_CLARIFICATION` → yellow, `ESCALATE_DIRECTLY` → red
  - Score columns: thin inline progress bar (0–1 range) next to the numeric value
- Pagination controls

---

### SCREEN: Admin — Logs d'audit
**Route:** `/admin/logs/audit`
**API:** `GET /admin/logs/audit?skip=0&limit=10` → `PaginatedResponse[AuditLogOut]`

**UI:**
- Page title: "Logs d'audit"
- **Filter bar:** Actor Type dropdown (ADMIN / ENGINEER / DEVELOPER) + "Filtrer" button
- **Data table:**
  - Columns: `#`, `Acteur ID`, `Type d'acteur` (role badge), `Action` (monospace), `Cible`, `Cible ID`, `Date`
  - Action and Target fields: `Inter Mono` or monospace, `#2D3748`
  - Each row has a subtle left border color matching the actor role badge color
- Pagination controls

---

### SCREEN: Admin — Profil
**Route:** `/admin/profile`
**API GET:** `GET /admin/profile` → `UserOut`
**API PATCH:** `PATCH /admin/profile` — body: `{ name?, password? }` → `UserOut`

**UI:**
- White card, left section: large initials avatar circle (blue background, white text), Name in `Inter 700` 20px, Email in muted, role badge "ADMIN", and if `super_admin: true` → a yellow "⭐ Super Admin" badge
- Right section: editable fields form (toggle into edit mode with "Modifier" button)
- Editable: Nom, Nouveau mot de passe (optional)
- Read-only: Email, Rôle
- "Enregistrer" primary button, "Annuler" secondary button
- On success: toast "Profil mis à jour"

---

### PANEL: Notifications Admin
**Trigger:** Bell icon in header (yellow badge with unread count)
**API GET:** `GET /admin/notifications` → `list[NotificationOut]`
**API PATCH:** `PATCH /admin/notifications/:id/read` → `NotificationOut`

**UI:**
- Slide-in drawer from right, `width: 360px`, white background with shadow
- Header: "Notifications" title + "Tout marquer comme lu" text button
- Each notification row: yellow unread dot (hidden if read), message text in `Inter 400` 14px, timestamp in muted 12px
- Hover: `#F0F4F9` row background
- Click on row → mark as read (call PATCH), dot disappears
- Empty state: centered icon + "Aucune notification pour le moment"

---
---

## USER TYPE 2 — DEVELOPER

**Base route:** `/developer`
**Role guard:** All endpoints require `role = DEVELOPER` in JWT
**Dashboard purpose:** Submit tickets, track their progress, respond to AI clarification, refill context when requested

---

### LAYOUT: Developer Shell
**Sidebar (blue `#0056B3` background):**
- Navigation links:
  - 🎫 Mes tickets → `/developer/dashboard`
  - ➕ Nouveau ticket → opens Create Ticket modal
  - 👤 Profil → `/developer/profile`
- Bottom: developer name, role badge "DEVELOPER", logout

**Header bar:** breadcrumb + notification bell + avatar

---

### SCREEN: Developer Dashboard — Mes tickets
**Route:** `/developer/dashboard`
**API:** `GET /developer/tickets?skip=0&limit=10` → `PaginatedResponse[TicketOut]`

**UI:**
- Page title: "Mes Tickets"
- **Summary strip** (above table, 5 small stat chips): ticket counts per status — OPEN (blue), AWAITING_CLARIFICATION (yellow), IN_PROGRESS (light blue), AUTO_RESOLVED (teal), RESOLVED (green) — each chip clickable to filter the table
- **Filter bar card:** Status dropdown + "Filtrer" button + "Nouveau ticket ＋" yellow accent button (top right)
- **Data table:**
  - Columns: `#`, `Titre`, `Catégorie`, `Statut` (badge), `Créé le`, `Mis à jour le`, `Actions`
  - Row click → navigates to `/developer/tickets/:id`
  - `AWAITING_CLARIFICATION` rows: yellow `4px` left border (needs developer attention)
- Empty state: blue dashed border card, illustration, "Aucun ticket pour le moment. Ouvrez votre premier ticket ＋"

**MODAL: Nouveau ticket**
- API: `POST /developer/tickets` — body: `{ title, description, category }` → `201 TicketOut`
- Fields: Titre (text, required), Description (textarea, required, 5 rows), Catégorie (dropdown: `NETWORK`, `DATABASE`, `SERVER_OS`, `DEPLOYMENT`, `SECURITY`, `API_GATEWAY`, `STORAGE`, `OTHER`)
- Footer buttons: "Soumettre le ticket" (blue primary), "Annuler" (secondary)
- On success: close modal, toast "Ticket soumis — l'IA est en train d'analyser votre demande 🤖", refresh table
- On 422: highlight invalid fields with red border + error message below

---

### SCREEN: Ticket Detail (Developer View)
**Route:** `/developer/tickets/:id`
**API:** `GET /developer/tickets/:id` → `TicketDetail`

**UI — Ticket Header card:**
- Breadcrumb: "Mes tickets / Ticket #ID"
- Large title in `Inter 700` 22px
- Row of badges: ID badge (monospace, grey), Status badge, Category badge
- Two timestamps: "Créé le" + "Mis à jour le", muted 13px

**UI — Ticket Info card:**
- "Description" section label
- Full description text in `Inter 400` 15px, `#4A5568`
- "Ingénieur assigné" row: engineer name if present, or "Non assigné" in muted italic

**UI — Pièces jointes (Attachments) card:**
- Card title: "Pièces jointes (X/5)"
- Grid of file chips: filename + file type icon + "Télécharger" link
- "Ajouter un fichier ＋" button — triggers file picker → `POST /developer/tickets/:id/attachments` (multipart)
  - On 409 (limit reached): toast "Limite de 5 pièces jointes atteinte"
  - On 422 (bad extension): toast "Format de fichier non autorisé"
  - Hide upload button when 5 attachments reached
- API: `POST /developer/tickets/{ticket_id}/attachments` — multipart/form-data

**UI — Analyse IA card** *(visible only when `analysis` is non-null)*:
- Card title: "Analyse IA" with a robot icon
- Grid of 2 columns:
  - Left: "Catégorie détectée" → value, "Décision" → badge, "Raison" → text
  - Right: "Score de richesse" → `[████░░] 68%` progress bar (blue), "Score de similarité" → `[██████] 85%` progress bar (teal)
- Collapsed by default with "Voir l'analyse ▼" toggle

**UI — Session de clarification panel** *(visible only when `status = AWAITING_CLARIFICATION`)*:
- Yellow notice banner above panel: "🤖 L'IA a besoin de plus d'informations pour traiter votre ticket."
- API: `GET /developer/tickets/:id/clarification` → `SessionWithMessages`
- Chat bubble panel:
  - BOT messages: left-aligned, grey `#F0F4F9` bubble, bot avatar (robot icon in blue circle)
  - USER messages: right-aligned, blue `#0056B3` bubble, white text
  - Timestamps below each bubble in 11px muted
- Bottom input bar (only if session `status = OPEN`): text input + "Envoyer ↵" blue button
  - API: `POST /developer/tickets/:id/clarification/messages` — body: `{ content }` → `201 MessageOut`
  - Append new message to chat on success without page reload
- If session is closed: muted banner "Cette session de clarification est clôturée" + read-only history

**UI — Demande de contexte (Refill) section** *(visible only when `status = IN_PROGRESS` and a context request was sent)*:
- Yellow card with left border: "🔔 L'ingénieur a demandé des informations supplémentaires. Veuillez mettre à jour votre ticket."
- Inline edit form: Description (textarea), Catégorie (dropdown) — pre-filled with current values
- "Mettre à jour et notifier l'ingénieur" yellow accent button
- API: `PATCH /developer/tickets/:id/refill` — body: `{ description?, category? }` → `200 TicketOut`
- On success: toast "L'ingénieur a été notifié de votre mise à jour ✓", refresh ticket

**UI — Réponse IA card** *(visible only when `ai_response` is non-null)*:
- Teal-tinted card (left border `#2F855A`), title "✅ Réponse automatique de l'IA"
- Response text in `Inter 400` 15px
- Footer: "Score de confiance: 94%" as a small green badge + "Résolu automatiquement le [date]"

**UI — Réponse de l'ingénieur card** *(visible only when `engineer_response` is non-null)*:
- Green-tinted card (left border `#38A169`), title "✅ Réponse de l'ingénieur"
- Response text in `Inter 400` 15px
- Footer: "Par [engineer name] · Résolu le [date]"

---

### SCREEN: Developer Profile
**Route:** `/developer/profile`
**API GET:** `GET /developer/profile` → `UserOut`
**API PATCH:** `PATCH /developer/profile` — body: `{ name?, password? }` → `UserOut`

**UI:**
- White card: initials avatar circle (blue), Name, Email (read-only), role badge "DEVELOPER", Entreprise (if present)
- "Modifier le profil" button → inline edit mode
- Editable: Nom, Nouveau mot de passe (optional)
- "Enregistrer" + "Annuler" buttons
- On success: toast "Profil mis à jour"

---

### PANEL: Notifications Developer
**Trigger:** Bell icon in header
**API GET:** `GET /developer/notifications` → `list[NotificationOut]`
**API PATCH:** `PATCH /developer/notifications/:id/read` → `NotificationOut`

**UI:**
- Same slide-in drawer as Admin
- Notification types include: ticket auto-resolved by AI, engineer response posted, engineer requesting more context, ticket reassigned
- Yellow unread dot per item, click to mark as read

---
---

## USER TYPE 3 — ENGINEER

**Base route:** `/engineer`
**Role guard:** All endpoints require `role = ENGINEER` in JWT
**Dashboard purpose:** View assigned tickets, read AI context, write responses, resolve tickets, signal problems

---

### LAYOUT: Engineer Shell
**Sidebar (blue `#0056B3` background):**
- Navigation links:
  - 🎫 Tickets assignés → `/engineer/dashboard`
  - 👤 Profil → `/engineer/profile`
- Bottom: engineer name, speciality in muted 12px, role badge "ENGINEER", logout

**Header bar:** breadcrumb + notification bell + avatar

---

### SCREEN: Engineer Dashboard — Tickets assignés
**Route:** `/engineer/dashboard`
**API:** `GET /engineer/tickets?skip=0&limit=10` → `PaginatedResponse[TicketOut]`

**UI:**
- Page title: "Mes Tickets Assignés"
- **Summary strip:** ticket counts — IN_PROGRESS (blue), AWAITING_CLARIFICATION (yellow), RESOLVED (green)
- **Filter bar:** Status dropdown + "Filtrer" button
- **Data table:**
  - Columns: `#`, `Titre`, `Catégorie`, `Statut` (badge), `Développeur ID`, `Créé le`, `Actions`
  - Row click → `/engineer/tickets/:id`
  - `IN_PROGRESS` rows: blue left border
  - `AWAITING_CLARIFICATION` rows: yellow left border (clarification still open but may need review)
- Empty state: "Aucun ticket assigné pour le moment."

---

### SCREEN: Engineer Ticket Detail
**Route:** `/engineer/tickets/:id`
**API:** `GET /engineer/tickets/:id` → `TicketDetail`

**UI — Ticket Header card:**
- Title, ID badge, Status badge, Category badge
- "Développeur" row: developer name (or ID)
- Timestamps

**UI — Description card:**
- Full description, attachments list with download links (read-only)

**UI — Analyse IA card** *(visible if `analysis` is non-null)*:
- Same 2-column layout as Developer view
- Purpose: engineer sees why AI couldn't resolve it

**UI — Résumé de clarification card** *(visible if `clarification_session.summary` is non-null)*:
- Blue-tinted card (left border `#0056B3`): "🤖 Résumé de la clarification IA"
- Summary text in a styled blockquote
- "Voir la conversation complète ▼" expandable section showing the full message history (read-only)

**UI — Rédiger une réponse card:**
- If no response yet:
  - Textarea: "Rédigez votre solution ici..." (6 rows)
  - "Soumettre la réponse" blue primary button
  - API: `POST /engineer/tickets/:id/response` — body: `{ response_text }` → `201 EngineerResponseOut`
  - On 409 (already resolved): disable form, banner "Ce ticket est déjà clôturé."
- If response already submitted:
  - Shows current response in a green-tinted card
  - "Modifier la réponse" button → switches to edit mode
  - API on save: `PUT /engineer/tickets/:id/response` — body: `{ response_text }` → `200 EngineerResponseOut`

**UI — Barre d'actions** (bottom sticky bar or card footer with 3 buttons):

1. **"Résoudre le ticket ✓"** — green primary button
   - Disabled if no response has been submitted yet (tooltip: "Rédigez une réponse avant de résoudre")
   - Confirmation dialog: "Résoudre ce ticket ? Une entrée sera ajoutée à la base de connaissances."
   - API: `PATCH /engineer/tickets/:id/resolve` → `200 TicketOut`
   - On success: toast "Ticket résolu — base de connaissances mise à jour ✓", navigate back to dashboard

2. **"Demander plus de contexte"** — yellow accent button
   - API: `POST /engineer/tickets/:id/request-context` → `204`
   - On success: toast "Demande envoyée au développeur par email et notification ✓"
   - On 409 (resolved): disabled with tooltip "Ce ticket est déjà clôturé"

3. **"Signaler une mauvaise assignation"** — ghost/outline red button
   - Opens confirmation modal
   - **MODAL: Signalement de mauvaise assignation**
     - Title: "Signaler une mauvaise assignation"
     - Field: "Raison du signalement" (textarea, required)
     - Warning: "Un administrateur sera notifié et pourra réassigner ce ticket."
     - "Envoyer le signalement" red button
     - API: `POST /engineer/tickets/:id/misassignment` — body: `{ reason }` → `201 ReportOut`
     - On success: toast "Signalement envoyé — l'administrateur a été notifié", close modal, navigate to dashboard

---

### SCREEN: Engineer Profile
**Route:** `/engineer/profile`
**API GET:** `GET /engineer/profile` → `UserOut`
**API PATCH:** `PATCH /engineer/profile` — body: `{ name?, password? }` → `UserOut`

**UI:**
- White profile card: initials avatar circle, Name, Email (read-only), role badge "ENGINEER"
- Read-only info row: Spécialité, Niveau badge (JUNIOR / MID / SENIOR in color), Disponibilité (green dot if true / grey dot if false)
- "Modifier" button → inline edit mode for Nom and Mot de passe only (Niveau, Disponibilité, Spécialité are managed by admin)
- On success: toast "Profil mis à jour"

---

### PANEL: Notifications Engineer
**Trigger:** Bell icon in header
**API GET:** `GET /engineer/notifications` → `list[NotificationOut]`
**API PATCH:** `PATCH /engineer/notifications/:id/read` → `NotificationOut`

**UI:**
- Same slide-in drawer
- Notification types: new ticket assigned, developer refilled context, misassignment reviewed/reassigned
- Yellow unread dot, click to mark as read

---
---

## GLOBAL COMPONENTS

These components are shared across all three user types and must be consistent.

---

### WebSocket Real-Time Notifications
- On login, open WebSocket connection to `WS /ws/:userId?token=<access_token>`
- On receiving a push event: append notification to the drawer, increment bell badge counter (animate badge: quick scale pulse)
- On token expiry: silently call `POST /auth/refresh` → update tokens → reconnect WebSocket
- On connection drop: show persistent top banner "Connexion perdue — reconnexion en cours..." with a spinner, auto-retry every 5s

---

### Token Refresh (Axios Interceptor)
- On every `401` response: attempt `POST /auth/refresh` with `{ refresh_token }` → get new tokens → retry original request
- If refresh also returns `401`: clear all stored tokens → redirect to `/login` with toast "Session expirée — veuillez vous reconnecter"

---

### Pagination
- All paginated endpoints use `skip` (offset) and `limit=10`
- Controls: "← Précédent" / "Suivant →" buttons, both styled as secondary buttons
- Center label: "Page X — Y à Z résultats sur N"
- Previous disabled on page 1, Next disabled on last page

---

### Skeleton Loaders
- For tables: 5 grey shimmer rows (`#EDF2F7` animated gradient), matching row height `52px`
- For cards: rectangular shimmer blocks matching card layout
- Never show a spinner alone for data loading — always use skeletons

---

### Toast Notifications
- Position: bottom-right, stacked vertically
- Style: white card, `border-radius: 8px`, left colored border `4px`
- ✅ Success: `#2F855A` border, green check icon, auto-dismiss 4s
- ❌ Error: `#C53030` border, red X icon, persist until dismissed (×)
- ℹ️ Info: `#0056B3` border, blue info icon, auto-dismiss 3s
- ⚠️ Warning: `#C05621` border, amber warning icon, auto-dismiss 5s

---

### Error States

| HTTP Code | Behavior |
|---|---|
| `401` | Interceptor attempts refresh. If refresh fails → redirect `/login` |
| `403` | Full-page centered card: lock icon, "Accès refusé", "Vous n'avez pas les droits nécessaires pour accéder à cette page.", Back button |
| `404` | Inline empty state within the page section — not a redirect |
| `409` | Inline error below the triggering form field or inside the modal |
| `422` | Highlight all invalid fields with red border + error message below each |
| `500` | Error toast: "Une erreur serveur s'est produite. Veuillez réessayer." |
| Network | Persistent top banner: "Connexion perdue — réessai en cours..." |

---

### Role-Based Routing Guard
- On app load, decode JWT and extract `role`
- Redirect rules:
  - `/developer/*` accessible only to `DEVELOPER` role
  - `/engineer/*` accessible only to `ENGINEER` role
  - `/admin/*` accessible only to `ADMIN` role
  - Any mismatch → 403 page

---

## API BASE CONFIGURATION

```
Base URL:        http://localhost:8000/api/v1
Auth Header:     Authorization: Bearer <access_token>
Content-Type:    application/json
File Uploads:    multipart/form-data
WebSocket:       ws://localhost:8000/api/v1/ws/:userId?token=<access_token>
```

All protected endpoints return:
- `401` if token is missing or expired → handled by interceptor
- `403` if the user's role is not authorized → show 403 page
