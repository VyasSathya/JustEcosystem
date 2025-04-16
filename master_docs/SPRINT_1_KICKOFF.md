# JustEcosystem: Sprint 1 Kickoff

## Overview
This document summarizes the highest-priority MVP tasks, actionable sub-tasks, and parallelization requirements for all teams (JustWorks, JustStuff, JustCreate) for Sprint 1. Use this as the single source of truth for sprint planning, daily standups, and onboarding.

---

## 🥇 JustWorks: Authentication System (MASTER-010)
- **Goal:** Establish a robust, unified authentication backend for all products.
- **Sub-Tasks:**
    - [ ] Set up backend project structure and repo (JustWorks)
    - [ ] Implement JWT/OAuth2 endpoints (login, register, refresh, logout)
    - [ ] Add SSO and role management logic
    - [ ] Write OpenAPI/Swagger docs for all endpoints
    - [ ] Create integration tests for all clients (JustCreate, JustStuff)
    - [ ] Manual QA: auth flows, error handling, edge cases
    - [ ] Reference: QA_TEMPLATES/AUTHENTICATION.md
- **Acceptance:** All clients pass auth integration tests.

---

## 🥈 JustStuff: Cross-Platform UI & Viral Features

### MASTER-016: Simultaneous Mobile and Desktop Support
- **Goal:** Achieve feature and UX parity for mobile and desktop from day one.
- **Sub-Tasks:**
    - [ ] Build responsive layout for all core screens (feed, profile, publish) **(MOBILE & DESKTOP PARALLEL)**
    - [ ] Implement device detection and adaptive UI (test on both platforms in parallel)
    - [ ] Ensure feature parity (features must work identically on mobile and desktop, developed/tested side-by-side)
    - [ ] Integrate with centralized authentication/API (validate on both platforms)
    - [ ] Automated accessibility tests (WCAG 2.1 AA, run on mobile and desktop UIs)
    - [ ] Manual QA: device/browser matrix (cover all major mobile and desktop devices)
    - [ ] Reference: UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md, QA_TEMPLATES/PUBLISHING.md
    - [ ] **NOTE:** Engineers and QA must coordinate so all features and tests are implemented for mobile and desktop in parallel, not sequentially. Cross-device bugs or parity gaps must be flagged and resolved immediately.
- **Acceptance:** All core flows pass on mobile & desktop.

### MASTER-018: Viral Loops & Growth Features
- **Goal:** Drive engagement and sharing from the start.
- **Sub-Tasks:**
    - [ ] Track and display remix counts, trending badges
    - [ ] Implement invite/reward system (backend, UI, referral tracking)
    - [ ] Push/in-app notifications for remix/like/share
    - [ ] Launch first remix challenge and leaderboard
    - [ ] Visualize remix trees (interactive UI)
    - [ ] One-tap sharing and download for remixes
    - [ ] QA: viral flows, metrics, abuse prevention
    - [ ] Reference: UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md (sec. 11)
- **Acceptance:** MVP checklist in UI blueprint sec. 11; viral flows tested for frictionless use, social proof, and growth.

---

## 🟦 JustCreate: CRA Loop Integration (MASTER-012)
- **Goal:** Enable seamless publishing and backend connectivity from the editor.
- **Sub-Tasks:**
    - [ ] Implement VSCode extension UI for CRA loop
    - [ ] Integrate with JustWorks backend API (compose, resolve, answer)
    - [ ] Handle API errors and edge cases
    - [ ] Automated integration tests (editor <-> backend)
    - [ ] Manual QA: demo all flows
    - [ ] Reference: QA_TEMPLATES/CRA_INTEGRATION.md
- **Acceptance:** All major flows demoed and tested per QA_TEMPLATES/CRA_INTEGRATION.md.

---

## Parallelization & Coordination
- All mobile and desktop development/testing for JustStuff must proceed in parallel, not sequentially.
- QA and engineering must coordinate to ensure no feature/test is left behind on either platform.
- Cross-team blockers or gaps should be flagged in daily standups and resolved immediately.

---

## Reference
- For full context, see: `master_docs/TASK_BOARD.md` and each repo’s `.task/tasks/MASTER_SYNC.md`.
- Blueprint and QA templates: `UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md`, `QA_TEMPLATES/PUBLISHING.md`, `QA_TEMPLATES/AUTHENTICATION.md`, `QA_TEMPLATES/CRA_INTEGRATION.md`

---

**Sprint 1 starts now—let’s build a cross-platform, viral MVP!**
