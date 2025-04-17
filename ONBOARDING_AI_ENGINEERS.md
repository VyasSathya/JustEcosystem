# Onboarding Guide for AI Engineers: JustEcosystem

Welcome to the JustEcosystem engineering team! This guide will ensure you always know **where to find your tasks, how to track your progress, and how to make your work count toward the MVP.**

---

## 🚦 Where to See Your Tasks

- **Your canonical, actionable task list is in your repo’s:**
  - `.task/tasks/MASTER_SYNC.md`
- **Each sub-task is a checklist item:**
  - `- [ ]` means not started
  - `- [x]` means completed
- **Do NOT rely on summary tables or chat for progress reporting.**

---

## ✅ How to Track Progress (and Make It Count)

1. **When you complete a sub-task, mark it as checked:**
   - Change `- [ ]` to `- [x]` for that line in `.task/tasks/MASTER_SYNC.md`.
2. **Only checked boxes in this file count toward MVP progress.**
   - If it’s not checked here, it is not counted in dashboards or reports.
3. **Parent tasks are only considered done when all their sub-tasks are checked.**
4. **Update this checklist as soon as you finish a sub-task.**

---

## 📋 What to Refer To for Each Task

- **Blueprints and QA templates:** Linked directly in your checklist for each sub-task.
- **master_docs/TASK_BOARD.md:** For priorities, dependencies, and cross-team context.
- **master_docs/SPRINT_1_KICKOFF.md:** For sprint goals and coordination.
- **master_docs/SPRINT_1_BURNDOWN.md:** For live progress and expectations.

---

## 🛡️ Security, Parity, and Coordination

- All API endpoints must follow security requirements (auth, RBAC, input validation).
- For JustStuff, mobile and desktop must always be developed and tested in parallel.
- Do not work out of order or without checking dependencies.

---

## 🏁 How Progress is Measured

- A script (`scripts/mvp_progress_bar.py`) automatically calculates MVP progress from your checklists.
- As soon as you check off a sub-task, the progress bar updates for everyone.
- **No meetings needed—just keep your checklist up to date!**

---

## ❓ If You’re Unsure

- Check the latest `.task/tasks/MASTER_SYNC.md` in your repo.
- Refer to the linked documentation for each sub-task.
- If still unclear, ask in the team chat or consult the manager.

---

**Welcome aboard—your work is visible, measurable, and critical to the MVP!**
