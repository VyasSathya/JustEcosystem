# JustEcosystem: Master Task Board

> **Single source of truth for all tasks and priorities across JustCreate, JustStuff, and JustWorks.**
> 
> **Instructions:**
> - Edit this file directly to add, update, or assign tasks.
> - Each row is a canonical task for one repo/AI engineer.
> - Per-repo `.task/tasks/MASTER_SYNC.md` files are auto-generated from this board.
> - Assign each task to one of the three AI engineers (one per repo).

---

| Task ID      | Repo        | Title / Description                                      | Status      | Priority | Due Date    | Assignee (AI Engineer) | Linked Docs / Spec         | Comments / Notes                  |
|--------------|-------------|----------------------------------------------------------|-------------|----------|-------------|------------------------|-----------------------------|------------------------------------|
| MASTER-001   | JustCreate  | VSCode Architecture Study                               | Not Started | High     | 2025-05-15  | AI Engineer 1          | MIG-001.md                  |                                    |
| MASTER-002   | JustCreate  | JustEnglish Language Implementation                     | Not Started | High     | 2025-05-15  | AI Engineer 1          | MIG-002.md                  |                                    |
| MASTER-003   | JustCreate  | Uncertainty Markers Implementation                      | Not Started | Medium   | 2025-05-25  | AI Engineer 1          | MIG-003.md                  |                                    |
| MASTER-016   | JustStuff   | Implement Simultaneous Mobile and Desktop Support for MVP | Not Started | Highest  | 2025-05-10  | AI Engineer 2          | TASK-010.md, UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md | **Deliverables:** Responsive UI for mobile/desktop, device detection, feature parity, accessibility (WCAG 2.1 AA), manual/automated QA, integration with unified auth/API. **Acceptance:** All core flows pass on mobile & desktop. **References:** UI blueprint, QA_TEMPLATES/PUBLISHING.md.
    - [ ] Build responsive layout for all core screens (feed, profile, publish)
    - [ ] Implement device detection and adaptive UI
    - [ ] Ensure feature parity (mobile vs desktop)
    - [ ] Integrate with centralized authentication/API
    - [ ] Automated accessibility tests (WCAG 2.1 AA)
    - [ ] Manual QA: device/browser matrix
    - [ ] Reference: UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md, QA_TEMPLATES/PUBLISHING.md
|
| MASTER-018   | JustStuff   | Implement Viral Loops: Remix Chains, Trending, Invite/Reward, Instant Feedback | Not Started | Highest  | 2025-05-12  | AI Engineer 2          | UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md, QA_TEMPLATES/PUBLISHING.md | **Deliverables:** Backend & UI for remix chains, trending, invite/reward, notifications. **Acceptance:** MVP checklist in UI blueprint sec. 11. **QA:** Viral flows tested for frictionless use, social proof, and growth.
    - [ ] Track and display remix counts, trending badges
    - [ ] Implement invite/reward system (backend, UI, referral tracking)
    - [ ] Push/in-app notifications for remix/like/share
    - [ ] Launch first remix challenge and leaderboard
    - [ ] Visualize remix trees (interactive UI)
    - [ ] One-tap sharing and download for remixes
    - [ ] QA: viral flows, metrics, abuse prevention
    - [ ] Reference: UI_AND_AGENT/JUSTSTUFF_MOBILE_UI.md (sec. 11)
|
| MASTER-004   | JustStuff   | JustStuff Architecture Research                         | In Progress | High     | 2025-04-30  | AI Engineer 2          | TASK-001.md                 |                                    |
| MASTER-005   | JustStuff   | Complete Initial Project Setup                          | Completed   | High     | 2023-06-10  | AI Engineer 2          | TASK-002.md                 |                                    |
| MASTER-006   | JustStuff   | Set Up Documentation System                             | Completed   | High     | 2023-06-15  | AI Engineer 2          | TASK-003.md                 |                                    |
| MASTER-007   | JustStuff   | Configure Task Management System                        | Completed   | High     | 2023-06-15  | AI Engineer 2          | TASK-004.md                 |                                    |
| MASTER-008   | JustWorks   | Initial JustWorks Setup (project, backend, infra)       | Not Started | Highest  | 2025-04-18  | AI Engineer 3          | (to be created)             | **Start here: foundational setup** |
| MASTER-010   | JustWorks   | Authentication System (JWT, OAuth, SSO)                 | Not Started | Highest  | 2025-04-20  | AI Engineer 3          | (to be created), QA_TEMPLATES/AUTHENTICATION.md | **Deliverables:** Central JWT/OAuth2 backend, SSO, token refresh, role management, API docs. **Acceptance:** All clients pass auth integration tests, QA_TEMPLATES/AUTHENTICATION.md.
    - [ ] Set up backend project structure and repo (JustWorks)
    - [ ] Implement JWT/OAuth2 endpoints (login, register, refresh, logout)
    - [ ] Add SSO and role management logic
    - [ ] Write OpenAPI/Swagger docs for all endpoints
    - [ ] Create integration tests for all clients (JustCreate, JustStuff)
    - [ ] Manual QA: auth flows, error handling, edge cases
    - [ ] Reference: QA_TEMPLATES/AUTHENTICATION.md
|
| MASTER-012   | JustCreate  | CRA Loop: VSCode Extension <-> Backend Integration      | Not Started | High     | 2025-04-25  | AI Engineer 1          | (to be created), QA_TEMPLATES/CRA_INTEGRATION.md | **Deliverables:** End-to-end flow from VSCode UI to backend, API error handling, integration tests. **Acceptance:** All major flows demoed and tested per QA_TEMPLATES/CRA_INTEGRATION.md.
    - [ ] Implement VSCode extension UI for CRA loop
    - [ ] Integrate with JustWorks backend API (compose, resolve, answer)
    - [ ] Handle API errors and edge cases
    - [ ] Automated integration tests (editor <-> backend)
    - [ ] Manual QA: demo all flows
    - [ ] Reference: QA_TEMPLATES/CRA_INTEGRATION.md
|
| MASTER-013   | JustWorks   | Agent Orchestration & API Integration                   | Not Started | High     | 2025-04-28  | AI Engineer 3          | (to be created)             | All agents must be involved        |
| MASTER-011   | JustCreate  | Add JustEnglish Parser Implementation Details           | Not Started | High     | 2025-04-28  | AI Engineer 1          | diff_2025-04-16T07-46-03.md |                                    |
| MASTER-009   | JustStuff   | System Connectivity & Diagrams                          | In Progress | High     | 2025-04-30  | AI Engineer 2          | SYSTEM_OVERVIEW.md          |                                    |
| MASTER-014   | JustWorks   | Add Cloud Strategy & Vendor Lock-in Mitigation          | Not Started | Medium   | 2025-05-05  | AI Engineer 3          | diff_2025-04-16T07-46-03.md |                                    |
| MASTER-015   | JustWorks   | Specify AI Model Choices & Licensing                    | Not Started | Medium   | 2025-05-05  | AI Engineer 3          | diff_2025-04-16T07-46-03.md |                                    |

---

> **Legend:**
> - **AI Engineer 1:** JustCreate lead
> - **AI Engineer 2:** JustStuff lead
> - **AI Engineer 3:** JustWorks lead

> **See also:** Each repo's `.task/tasks/MASTER_SYNC.md` is generated from this board.
> Add new tasks here to assign to any repo/engineer.
