| MASTER-017 | Implement Google and Apple OAuth Authentication | In Progress | Highest | ... |
    - [x] Create OAuth provider integration documentation
    - [x] Develop QA test suite for cross-platform OAuth flows
    - [x] Implement Google Sign-In for all platforms
    - [x] Implement Apple Sign In for all platforms
    - [x] Secure token storage and validation
    - [x] Profile data synchronization from OAuth providers
    - [x] Error handling and fallback mechanisms
    - [x] Platform-specific UI implementations following provider guidelines

# 🖥️ Centralized Command Reference for JustEcosystem

Use this as your single source for all common development, API, and system commands across the ecosystem. Copy/paste or adapt as needed for your shell (PowerShell, bash, etc.).

---

## 🔒 Check Manual/Human Blocks (Per Repo)

To quickly see which setup or integration tasks require manual/human action (and may block automation or AI):

**From the project root:**

- For JustWorks:
  ```bash
  python scripts/show_manual_blocks.py
  ```
- For JustStuff:
  ```bash
  python JustStuff/scripts/show_manual_blocks.py
  ```
- For JustCreate:
  ```bash
  python JustCreate/scripts/show_manual_blocks.py
  ```

Each script will scan its repo's SETUP_CHECKLIST.md and MASTER_SYNC.md for any unchecked, human-only, or secret/manual tasks, and print a clear list of blockers.

## 📦 Project Setup & Build

### Clone All Repos
```bash
git clone <repo-url-for-JustWorks>
git clone <repo-url-for-JustStuff>
git clone <repo-url-for-JustCreate>
# (Add JustDraft/JustEnglish when available)
```

### Install Dependencies
- **Node/TypeScript:**
  ```bash
  npm install
  ```
- **Python:**
  ```bash
  pip install -r requirements.txt
  ```

### Build/Compile
- **TypeScript:**
  ```bash
  npm run compile
  npm run watch
  ```

---

## 🚦 API Testing & Health Checks

### Curl (API Health Check)
- **Bash/macOS/Linux:**
  ```bash
  curl -X GET https://api.justworks.com/v1/auth/health
  ```
- **PowerShell (Windows):**
  ```powershell
  curl.exe -X GET "https://api.justworks.com/v1/auth/health"
  ```
  > **Note:** In PowerShell, always use `curl.exe` or `Invoke-WebRequest` for remote URLs, not `curl` (which is an alias for `Invoke-WebRequest`).

### Swagger UI (API Docs)
1. Go to [https://editor.swagger.io/](https://editor.swagger.io/)
2. Click "File" > "Import URL" and paste the raw file path to `.docs/api/auth-api.yaml` (or upload it directly).
3. Explore and test endpoints interactively.

### Postman/Insomnia
- Import `.docs/api/auth-api.yaml` for instant, ready-to-test collections.

---

## 🛠️ Scripts & Utilities
- **Run MVP progress bar:**
  ```
  python scripts/mvp_progress_bar.py
  ```

---

## 🆘 Troubleshooting
- If a command fails, check your shell (PowerShell vs. bash), spelling, and path.
- For Windows, use `curl.exe` instead of `curl` for remote URLs.
- For further help, see the root `README.md` or escalate to your team lead.

---

**Keep this file up to date as new commands, scripts, or utilities are added to the ecosystem!**
