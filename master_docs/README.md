# JustCreate Ecosystem – Master Documentation

Welcome to the JustCreate Ecosystem! This is the central hub for all documentation, architecture, and onboarding resources. The ecosystem consists of three interconnected VS Code extensions—**JustImagine**, **JustCreate**, **JustDraft**—the optional social sharing service (**JustStuff**), and the robust backend infrastructure (**JustWorks**).

---

## 📚 Table of Contents

- [Current Master Doc](MASTER/CURRENT_MASTER.md) [Depends on: ALL sections]
- [Dependencies & Implementation Tasks](PROCESS/) [Depends on: MASTER, COMPONENTS, ARCHITECTURE]
  - [API Registry](PROCESS/API_REGISTRY.md) [Depends on: SYSTEM_OVERVIEW, TASK_BOARD]
  - [System Overview](PROCESS/SYSTEM_OVERVIEW.md) [Depends on: API_REGISTRY, TASK_BOARD, COMPONENTS]
  - [Task Board](PROCESS/TASK_BOARD.md) [Depends on: API_REGISTRY, COMPONENTS, DOCS_AND_TASKS]
  - [Task & Documentation Flow](PROCESS/TASK_DOC_FLOW.md) [Depends on: TASK_BOARD, API_REGISTRY, DOCS_AND_TASKS]
- [Core Components](COMPONENTS/) [Depends on: SYSTEM_OVERVIEW, TASK_BOARD]
  - [JustImagine](COMPONENTS/JustImagine.md) [Depends on: TASK_BOARD, API_REGISTRY]
  - [JustCreate](COMPONENTS/JustCreate.md) [Depends on: TASK_BOARD, API_REGISTRY]
  - [JustDraft](COMPONENTS/JustDraft.md) [Depends on: TASK_BOARD, API_REGISTRY]
  - [JustStuff](COMPONENTS/JustStuff.md) [Depends on: TASK_BOARD, API_REGISTRY]
- [JustEnglish Language](LANGUAGE/JustEnglish.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [CRA Process](LANGUAGE/CRA_Process.md) [Depends on: JustEnglish, COMPONENTS]
- [Technical Architecture](ARCHITECTURE/) [Depends on: SYSTEM_OVERVIEW, TASK_BOARD]
  - [Agent and AI Integration](ARCHITECTURE/Agents_and_AI.md) [Depends on: API_REGISTRY, COMPONENTS]
  - [DSL, Parser, and Execution Engine](ARCHITECTURE/DSL_Parser_Execution.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Editor Integration](ARCHITECTURE/Editor_Integration.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Collaboration and State Management](ARCHITECTURE/Collaboration_and_State.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Blueprint and Versioning System](ARCHITECTURE/Blueprint_and_Versioning.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [APIs, Security, and Infrastructure](ARCHITECTURE/APIs_Security_Infra.md) [Depends on: API_REGISTRY, SYSTEM_OVERVIEW]
- [Security](SECURITY/) [Depends on: ARCHITECTURE, TASK_BOARD]
  - [Authentication](SECURITY/Authentication.md) [Depends on: API_REGISTRY, ARCHITECTURE]
  - [Security Considerations](SECURITY/Security_Considerations.md) [Depends on: API_REGISTRY, ARCHITECTURE]
  - [Scalability](SECURITY/Scalability.md) [Depends on: API_REGISTRY, ARCHITECTURE]
- [User Interface & Agent Interaction](UI_AND_AGENT/) [Depends on: COMPONENTS, TASK_BOARD]
  - [UI Specifications](UI_AND_AGENT/UI_Specs.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Version Control](UI_AND_AGENT/Version_Control.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Agent Communication](UI_AND_AGENT/Agent_Communication.md) [Depends on: COMPONENTS, TASK_BOARD]
- [Chatbot Integration](CHATBOT/) [Depends on: COMPONENTS, TASK_BOARD, ARCHITECTURE]
  - [Master Helper Chatbot](CHATBOT/Master_Helper_Chatbot.md) [Depends on: COMPONENTS, TASK_BOARD]
  - [Context Management](CHATBOT/Context_Management.md) [Depends on: COMPONENTS, TASK_BOARD]
- [Documentation & Task Management](DOCS_AND_TASKS/) [Depends on: TASK_BOARD, API_REGISTRY]
  - [Documentation Framework](DOCS_AND_TASKS/Documentation_Framework.md) [Depends on: TASK_BOARD]
  - [Automated Docs](DOCS_AND_TASKS/Automated_Docs.md) [Depends on: TASK_BOARD]
  - [Ecosystem Docs](DOCS_AND_TASKS/Ecosystem_Docs.md) [Depends on: TASK_BOARD]
  - [JustWorks Docs](DOCS_AND_TASKS/JustWorks_Docs.md) [Depends on: TASK_BOARD, API_REGISTRY]
- [Development Roadmap](ROADMAP/Development_Roadmap.md) [Depends on: TASK_BOARD, API_REGISTRY]
- [Tactical Improvements](TACTICAL/Tactical_Improvements.md) [Depends on: TASK_BOARD, API_REGISTRY]
- [Onboarding, Testing, Localization](ONBOARDING/) [Depends on: TASK_BOARD, API_REGISTRY]
  - [Developer Onboarding](ONBOARDING/Developer_Onboarding.md) [Depends on: TASK_BOARD]
  - [Testing Strategy](ONBOARDING/Testing_Strategy.md) [Depends on: TASK_BOARD]
  - [Localization](ONBOARDING/Localization.md) [Depends on: TASK_BOARD]

---

## 🚀 Getting Started

1. **Review the [System Overview](PROCESS/SYSTEM_OVERVIEW.md)** for a high-level understanding and dependencies.
2. **See [API Registry](PROCESS/API_REGISTRY.md)** for all backend and extension APIs and their implementation status.
3. **Track and manage work via the [Task Board](PROCESS/TASK_BOARD.md)**.
4. **Understand how documentation and implementation stay in sync in [Task & Documentation Flow](PROCESS/TASK_DOC_FLOW.md)**.
5. **Explore each [component](COMPONENTS/)** for detailed docs.
6. **See [JustEnglish](LANGUAGE/JustEnglish.md)** and the [CRA Process](LANGUAGE/CRA_Process.md) for the creative workflow.
7. **Understand the backend via [JustWorks Docs](DOCS_AND_TASKS/JustWorks_Docs.md)**.
8. **Follow the [Developer Onboarding Guide](ONBOARDING/Developer_Onboarding.md)** to get set up.

---

## 🛠️ Master Diffing, Dependency, and Task Delegation Process

- **Current Master Doc:** The latest mega document is always stored in [MASTER/CURRENT_MASTER.md](MASTER/CURRENT_MASTER.md). When a new master arrives, save it as `MASTER/NEW_MASTER.md` and run the diffing process.
- **Diffing & Propagation:** When a new master doc is introduced, automated scripts compare it to the current master, identify changes, and update all affected sections and dependencies in the documentation and task boards.
- **Dependency Awareness:** Each section in the Table of Contents lists its dependencies. When a change is made, all dependent sections and their tasks are automatically updated.
- **Task Delegation:** New or updated tasks in the master task board are automatically delegated to the relevant component/project `tasks.md` files. Each project/component board links back to the master and its dependencies.
- **Self-Healing Links:** If a folder or file moves, the system will self-correct all links in the README and other docs using relative paths and root-finding scripts.
- **Automation:** Use scripts (e.g., `generate_file_structure.py`) to keep the ToC, cross-references, and task delegation up-to-date. No manual link management is needed.

---

## 🛠️ Contribution Guidelines

- Keep documentation in sync with code and features.
- Use the provided scripts (e.g., `generate_file_structure.py`) for automated updates.
- Link all new docs from this README and the appropriate section index.
- For questions, consult the [Master Helper Chatbot](CHATBOT/Master_Helper_Chatbot.md).

---

## 📅 Roadmap & Feedback

- See the [Development Roadmap](ROADMAP/Development_Roadmap.md) for milestones.
- Feedback and improvement suggestions are welcome—open an issue or contact the core team.

---

*This documentation is versioned and updated automatically. For historical versions, see the `/archive` folder.*
