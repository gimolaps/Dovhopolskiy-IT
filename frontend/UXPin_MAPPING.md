# Сопоставление с загруженным UXPin HTML Export

Источником является **`UXPin-HTML-Untitled.zip`**, полученный в этом чате. Он содержит данные семи экранов `data/page_*.js`. Экспорт UXPin предназначен для показа прототипа и не представляет собой обычную HTML/CSS кодовую базу сайта.

| Экран | UXPin page_id | Основа дизайна |
| --- | --- | --- |
| `main` | 228747074 | Hero “Your IT Repairs, Simplified”, preview Dashboard, Features, How It Works, Devices, Demo Reviews, FAQ, CTA, footer |
| `registr` | 228747075 | First/Last Name, Email, Password, Confirm Password, confirmation |
| `login` | 228747076 | Email/Password, error/loading states, sign in |
| `customer` | 228747077 | Sidebar, Welcome back, Anna, 4 statistics, Recent Requests table |
| `technician` | 228747078 | Sidebar, 3 status metrics, request list, Request Details, Status/Save Changes |
| `admin` | 228747079 | 5 metrics, Requests Overview, Search requests, All statuses, User Management and placeholder |
| `request` | 228747081 | Device Type, Problem Description, validation, Submit Request, success state |

## Style tokens from UXPin export

- Light background `#F8FAFC`, primary `#2563EB`, main text `#0F172A`, muted `#64748B`, border `#E2E8F0`.
- The dark theme is implemented with complementary colors and CSS variables.
- Type uses the Inter/system font stack. No external font binaries are packaged.
- The source is designed for desktop width 1440px. Additional mobile breakpoints are implemented manually.

## Notes about parity

- All seven UXPin screens are represented by an independently running frontend.
- Some complex multi-state screens from UXPin are implemented as separate clickable pages and interactive states, which is more appropriate for a working website.
- The initial mock data is adapted for testable interactions; statistics count real demo records, rather than preserving every number from screenshots.
- Table search, profile links, navigation, demo authorization and status updates are added as real client-side behavior.
- UI parity was checked against structured layer/text data in the export. Pixel-perfect equivalence has not been verified in a browser.
- No original UXPin engine files or fonts are shipped in this build.
