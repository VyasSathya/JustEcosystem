# 🌟 JustEcosystem: Central Onboarding & Management Hub

Welcome to JustEcosystem! This is your single entry point for onboarding, task management, integration, and documentation—whether you’re an AI engineer or a senior manager. Everything you need to build, lead, or scale is here and always up to date.

---

## 🚀 1. Project Vision & Ecosystem Map
- **Mission:** Empower creativity, collaboration, and seamless process across a modular, multi-repo ecosystem.
- **Core Repos:**
  - **JustWorks:** Secure backend, authentication, and all APIs (MVP focus: user auth, core infra)
  - **JustStuff:** Social sharing and viral cross-platform UI (mobile/desktop)
  - **JustCreate:** VSCode extension, JustEnglish language tools, creative integrations
  - **JustDraft:** Version control and draft management (planned for Phase 3)
  - **JustEnglish:** Plain English with uncertainty markers (`~uncertain text~`), for creative AI-assisted writing (`.je`/`.just` files)

---

## 🔗 Quick API Access & Live Docs
- **[OpenAPI Specification (auth-api.yaml)](.docs/api/auth-api.yaml):** Machine-readable contract for all authentication endpoints. Use with Swagger UI, Postman, or code generators.
- **[User-Friendly API Docs (auth-api.md)](.docs/api/auth-api.md):** Detailed explanations, examples, and error handling for every endpoint.
- **[API Communication Plan](.docs/api/communication-plan.md):** Stakeholders, notification templates, and release process.

**How to View & Test the API:**
- **Swagger UI (Recommended):**
  1. Go to [https://editor.swagger.io/](https://editor.swagger.io/) (or use your local Swagger UI).
  2. Click "File" > "Import URL" and paste the raw file path to `.docs/api/auth-api.yaml` (or upload it directly).
  3. Explore and test endpoints interactively.
- **Quick Health Check (example):**
  ```sh
  curl -X GET https://api.justworks.com/v1/auth/health
  ```
  (Replace with actual health/status endpoint if available.)
- **Postman/Insomnia:**
  - Import `.docs/api/auth-api.yaml` for instant, ready-to-test collections.

---

## 🏆 MVP Focus & Project Status
- **Current Phase:** Early development, with a strict focus on MVP features and cross-repo integration.
- **Top Priorities:**
  - User authentication and backend API integration (must be completed before any dependent UI or extension work)
  - API contract finalization and documentation
  - Early integration tests for all cross-repo features (auth, profile, shared settings)
- **Planned Features:**
  - JustDraft (Phase 3)
  - Extended social features in JustStuff
  - Advanced creative tools in JustCreate/JustEnglish

---

## 🧑‍💻 Getting Started (All Engineers)
1. **Clone all relevant repos:**
   - `JustWorks`, `JustStuff`, `JustCreate` (and `JustDraft`/`JustEnglish` if applicable)
2. **Install dependencies:**
   - For Node/TypeScript: `npm install`
   - For Python: `pip install -r requirements.txt` (if present)
   - For other stacks, see each repo’s `README.md` or onboarding section
3. **Compile/build as needed:**
   - For TypeScript: `npm run compile` or `npm run watch`
   - For Python: follow repo instructions
4. **Run integration checklists:**
   - Complete all PRIORITY: BLOCKING tasks in `.task/tasks/MASTER_SYNC.md` before starting dependent features
   - Use the integration checklist to verify cross-repo compatibility
5. **Open your development environment:**
   - For VSCode extensions: open a new VSCode window and load the extension
   - For backend/UI: run local servers as per repo instructions
6. **Track your tasks and progress:**
   - Update `.task/tasks/MASTER_SYNC.md` and `master_docs/TASK_BOARD.md` as you work
   - Escalate blockers and sync with your team as needed

---

## 📚 Documentation & Task Management
- **All tasks are tracked with status, priority, and dependencies in `master_docs/TASK_BOARD.md` and per-repo `.task/tasks/MASTER_SYNC.md`**
- **Documentation is tightly integrated with task tracking—every feature, API, or integration has linked docs/specs**
- **Integration checklists and cross-repo priorities are always visible and enforced**
- **See the API docs and communication plan in `.docs/api/` for all API contracts and change management process**

---

## 📋 2. Task Management, Delegation & Cross-Repo Priorities
- **Find your actionable tasks:** `.task/tasks/MASTER_SYNC.md` in your repo.
- **Update progress:** Change `- [ ]` to `- [x]` for completed sub-tasks.
- **Claim/delegate tasks:** Assign your name/handle in the checklist or via PR description.
- **Reporting:** Only checked boxes in `.task/tasks/MASTER_SYNC.md` count toward MVP progress.
- **Escalate blockers:** Add a comment in the checklist or ping the team lead.
- **Critical Task Prioritization:**
  - Tasks that ensure interconnectivity and compatibility between repos must be completed early. For example:
    - **User authentication must connect to backend API before other dependent features are started.**
    - **API endpoints and contracts must be finalized before frontend/mobile integration.**
    - **Shared data models and interfaces must be agreed upon early and documented in `master_docs/` and `.docs/api/`.
  - Task boards and checklists should reflect these priorities. Dependencies must be resolved before starting downstream work.
- **Cross-Repo Compatibility:**
  - All new features or changes must be checked for compatibility across JustWorks, JustStuff, and JustCreate.
  - Use the API docs and communication plan to coordinate changes affecting multiple repos.
  - Early integration tests are required for any cross-repo feature (e.g., auth, profile, shared settings).

---

## 📊 3. Progress Tracking & Dashboards
- **Live MVP progress bar:**
  - Run `python scripts/mvp_progress_bar.py` from the project root.
- **Sprint, priorities, and dependencies:**
  - `master_docs/TASK_BOARD.md`
  - `master_docs/SPRINT_1_KICKOFF.md`
  - `master_docs/SPRINT_1_BURNDOWN.md`

---

## 🧪 4. Testing, QA, and Security
- **QA templates & blueprints:** Linked in your checklist and in `master_docs/QA_TEMPLATES/`
- **How to run tests:**
  - See repo-specific test instructions in each sub-README.
  - Mark QA/test tasks as complete in `.task/tasks/MASTER_SYNC.md`.
- **Security:**
  - All APIs must use JWT/OAuth2, RBAC, and input validation.
  - Log suspicious/failed attempts.
  - Follow security checklists in `master_docs/QA_TEMPLATES/`.

---

## 🛠️ 5. Dev Setup & CI/CD
- **Dev environment:**
  - Install Python 3.8+, Node.js (if needed), and repo dependencies (`requirements.txt`, `package.json`).
  - See `ONBOARDING_AI_ENGINEERS.md` for step-by-step setup.
- **CI/CD basics:**
  - PRs require code review and passing tests.
  - See repo-specific CI/CD in sub-README or `.github/workflows/`.

---

## 🤝 6. Contribution & Code Review
- **How to contribute:**
  - Fork, branch, and PR as per team standards.
  - Reference the checklist item in your PR.
- **Code review:**
  - At least one peer review required.
  - Use review checklist in `master_docs/QA_TEMPLATES/`.

---

## 🧭 7. Communication, Escalation & Help
- **If stuck:**
  - Check `.task/tasks/MASTER_SYNC.md` and linked docs.
  - Ask in team chat or escalate to the manager.
- **Automated reminders:**
  - Stale tasks or blockers will be flagged in the dashboard and by periodic script.
- **Team contacts:**
  - See `ONBOARDING_AI_ENGINEERS.md` for up-to-date contacts.

---

## 🏗️ 8. Architecture, API Docs & References
- **Blueprints, architecture, and advanced docs:**
  - `master_docs/` (see Table of Contents)
  - `ONBOARDING_AI_ENGINEERS.md` (deep onboarding)
- **API Documentation:**
  - [Authentication API (OpenAPI Spec)](.docs/api/auth-api.yaml)
  - [Authentication API (User Docs)](.docs/api/auth-api.md)
  - [API Communication Plan & Change Management](.docs/api/communication-plan.md)
- **Quick links:**
  - Task board, sprint docs, QA templates, security guides, architecture, and more—all linked above.

---

## 📢 9. API Change Management & Communication
- **How API changes are handled:**
  - All API changes must be reflected in the OpenAPI spec (`.docs/api/auth-api.yaml`) and user docs (`.docs/api/auth-api.md`).
  - Follow the [API Communication Plan](.docs/api/communication-plan.md) for stakeholder notifications, release process, and version control.
- **Change Notification Workflow:**
  1. Update the OpenAPI spec and user docs for any API change or addition.
  2. Announce changes in the #api-announcements Slack channel using the provided templates.
  3. Link updated docs in relevant JIRA tickets and notify all stakeholders.
  4. Track adoption and collect feedback as outlined in the communication plan.
- **Versioning:**
  - Increment the version in the OpenAPI spec for any breaking or significant change.
  - Maintain previous versions if needed for compatibility.
- **Review & Approval:**
  - API changes require code review and documentation review before release.
  - Use the communication plan for release and feedback cycles.

---

## 🔄 10. Feedback & Continuous Improvement
- **Suggest improvements:**
  - PR to this README, API docs, or `ONBOARDING_AI_ENGINEERS.md`.
  - Feedback form (coming soon).

---

## 🆘 What To Do If Cascade Is Unavailable
- **Use this README and the integration checklists in each repo’s `.task/tasks/MASTER_SYNC.md` to coordinate work.**
- **Critical integration tasks (PRIORITY: BLOCKING) must be completed before starting any dependent features.**
- **Update the master task board (`master_docs/TASK_BOARD.md`) directly to assign, update, or escalate tasks.**
- **Check the API docs and communication plan in `.docs/api/` for the latest contracts and process.**
- **If you encounter blockers or unresolved dependencies, escalate to the team lead or manager immediately.**
- **Keep all documentation and checklists up to date for visibility and handoff.**

---

## 🎯 Summary
- **Start here, stay here:** This README is your command center for onboarding, management, execution, and API integration.
- **Keep your checklist and API docs up to date. Use the communication plan for all API changes.**
- **All other onboarding/process info in sub-READMEs is deprecated—refer here!**

---

**For full onboarding details, see [`ONBOARDING_AI_ENGINEERS.md`](ONBOARDING_AI_ENGINEERS.md).**
