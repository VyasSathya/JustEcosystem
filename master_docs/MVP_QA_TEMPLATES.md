# MVP QA & Test Plan Templates

> **Purpose:**
> Standardized test plans and QA checklists for all MVP features, starting with Authentication and CRA Integration. Use these templates to ensure every critical path is verified and release quality is maintained.

---

## 1. Authentication System (JWT, OAuth, SSO)

### Test Plan
- [ ] **Unit Tests**
  - [ ] Token generation/validation (JWT)
  - [ ] OAuth 2.0 login flow (success, failure, edge cases)
  - [ ] SSO integration (if applicable)
- [ ] **API Tests**
  - [ ] /login endpoint: accepts valid credentials, rejects invalid
  - [ ] /refresh endpoint: issues new tokens, handles expired tokens
  - [ ] Error cases: invalid tokens, expired sessions, revoked access
- [ ] **Integration Tests**
  - [ ] Frontend extension can authenticate with backend
  - [ ] Auth state persists across reloads
  - [ ] Permissions and roles enforced (admin, user, guest)
- [ ] **Security Tests**
  - [ ] Token cannot be forged or tampered
  - [ ] Rate limiting/brute-force protection
  - [ ] Sensitive data not leaked in logs or errors
- [ ] **Manual QA**
  - [ ] Login/logout flows in all supported UIs
  - [ ] Third-party login (if supported)
  - [ ] Session expiration, forced logout

---

## 2. CRA Loop: VSCode Extension <-> Backend Integration

### Test Plan
- [ ] **Unit Tests**
  - [ ] Compose/Resolve/Answer logic correctness
  - [ ] Uncertainty markers trigger as expected
  - [ ] AI suggest returns valid/expected results
- [ ] **API Tests**
  - [ ] /api/v1/blueprints: create, read, update, delete
  - [ ] /api/v1/assets: asset generation, retrieval
  - [ ] /api/v1/drafts: versioning, branching, merging
  - [ ] /api/v1/ai/structure: AI structuring endpoint
- [ ] **Integration Tests**
  - [ ] Extension communicates with backend (happy path, failure)
  - [ ] Real-time updates reflected in editor and backend
  - [ ] Collaboration: multiple users editing, conflict resolution
- [ ] **Manual QA**
  - [ ] End-to-end flow: authoring, AI suggest, save, publish
  - [ ] Asset preview and publish dialog work as intended
  - [ ] UI error states and recovery

---

## 3. Additional MVP Features (Template)

### Test Plan
- [ ] **Unit Tests**
  - [ ] Core logic and edge cases
- [ ] **API Tests**
  - [ ] All endpoints: success, error, edge cases
- [ ] **Integration Tests**
  - [ ] End-to-end user flows
- [ ] **Manual QA**
  - [ ] UI/UX checks, accessibility, error handling

> **Instructions:**
> - Copy the relevant section for each new MVP feature.
> - Check off items as they are completed.
> - Add feature-specific cases as needed.
