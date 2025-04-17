# 📝 Product/Project Setup Checklist (Template)

> **Important:** Complete these steps in order before starting any new project. This checklist ensures your project meets the latest onboarding, integration, and compatibility standards.

---

## 🚦 PRIORITY: BLOCKING — Cross-Repo Integration Checklist
- [ ] User Authentication backend API is implemented and accessible by all clients
- [ ] OpenAPI/Swagger contract is finalized and shared with all teams
- [ ] All API endpoints required for MVP are documented and reviewed for compatibility
- [ ] Shared data models/interfaces are agreed upon and documented in `.docs/`
- [ ] Early integration tests are written for all cross-repo features
- [ ] Communication plan for API changes is in place and understood by all teams
- [ ] All blockers or unresolved dependencies are escalated before downstream work begins

---

## 1. Initial Setup
- [ ] Duplicate the `template` directory to your new project location
- [ ] Rename the copied directory to your project name (e.g., `my-new-product`)
- [ ] Navigate to your new project directory
- [ ] Run `npm install` (or `pip install -r requirements.txt` for Python) to set up dependencies
- [ ] Reference [`COMMANDS.md`](../../COMMANDS.md) for all setup, build, and API commands

## 2. Package Configuration
- [ ] Update `package.json`/`pyproject.toml`/other config files:
  - [ ] Change `name` to your project name
  - [ ] Update `description` and `author`
  - [ ] Check and update dependencies
  - [ ] Modify `version` if needed (default: 0.1.0)

## 3. Documentation System Setup
- [ ] Review the `.docs` directory structure
- [ ] Customize documentation templates in `.docs/templates/`
- [ ] Update component directories in `.docs/` and references in scripts
- [ ] Initialize master documentation (e.g., `DOC-ALL-ARCH-001.md`)
- [ ] Link docs to tasks and update table of contents

## 4. Task Management Setup
- [ ] Review the `.task` directory structure
- [ ] Customize task templates in `.task/templates/`
- [ ] Create initial project tasks (define MVP, phases, priorities, dependencies)
- [ ] Update `.task/tasks/MASTER_SYNC.md` to reflect the integration checklist and project-specific tasks
- [ ] Keep the master task board in sync with your tasks

## 5. Script & Command Configuration
- [ ] Review and customize scripts in the `scripts` directory
- [ ] Test run scripts with `npm run task`, `npm run doc`, etc.
- [ ] Add/modify scripts as needed for automation
- [ ] Reference [`COMMANDS.md`](../../COMMANDS.md) for all command-line usage

## 6. Source Code Setup
- [ ] Review the `src` directory
- [ ] Set up your initial code structure and update the CommandManager implementation as needed

## 7. Integration & Verification
- [ ] Verify bi-directional links between tasks and documentation
- [ ] Test document versioning and task status tracking
- [ ] Confirm all PRIORITY: BLOCKING integration tasks are complete before downstream work

## 8. Version Control
- [ ] Initialize git repository (`git init`)
- [ ] Create `.gitignore` (if not already present)
- [ ] Make initial commit

## 9. Documentation & Communication
- [ ] Update `README.md` with project-specific info and onboarding links
- [ ] Ensure all documentation is accessible and organized
- [ ] Reference the root `README.md` for onboarding, escalation, and process if Cascade is unavailable
- [ ] Update the API communication plan for any new endpoints/features

---

**For the latest onboarding, integration, and compatibility process, always refer to the root [`README.md`](../../README.md).**
- [ ] Link tasks and documentation appropriately

## 10. Final Checks
- [ ] Run all CLI tools to verify configuration
- [ ] Test document creation and task management
- [ ] Verify all paths and references are correct
- [ ] Remove this checklist file or mark it as completed

## References
- Main documentation: `README.md`
- Detailed system documentation: `README-Master.md`  
- Task management guide: `.task/README.md`
- Documentation system guide: `.docs/README.md`

---

**Note**: Once you've completed this checklist, you'll have a fully configured JustStuff project with integrated task and documentation management ready for development. 