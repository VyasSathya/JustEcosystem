# JustStuff Mobile UI & Integration Blueprint (Updated for 2025 MVP)

---

## 1. Overview

JustStuff is a youth-focused, process-centric social platform within the JustCreate ecosystem, emphasizing every stage of creative work. The platform empowers creators, fosters remixing, and builds a dynamic, collaborative community.

---

## 2. Vision and Mission

- **Vision:** Spark a creative revolution by making every journey visible and collaborative.
- **Mission:** Empower creativity, foster collaboration, celebrate process, and unify the ecosystem with seamless integration and single sign-on.

---

## 3. Ecosystem Integration

- **Direct Publishing:** "Share to JustStuff" from JustCreate/JustEnglish pushes content to the social feed.
- **Unified Auth:** All platforms use the centralized JustWorks JWT/OAuth2 system for login and profile sync.
- **Remix Flow:** Embedded metadata and version history enable remix trees and merging workflows.
- **API Connectivity:** Robust, versioned APIs (see `/api/v1/*`) ensure real-time updates and data consistency.

---

## 4. Differentiators

- **Process Transparency:** Display creative evolution—remix trees, version history, process markers.
- **Collaborative Remixing:** Git-style versioning, Figma-style co-editing, easy forking/remixing.
- **Multi-AI Messenger:** Starter personas ("Creative Buddy", "Code Helper"), usage limits for free users.
- **Tagging/Mentions:** Smart hashtag and @-mention support.
- **Ethical, Accessible Design:** WCAG 2.1 AA, multilingual, mindful prompts.

---

## 5. UI/UX (Mobile Focus)

- **Device Frame:** Standard smartphone, simulated bezel, top notch.
- **Status Bar:** Time, network, Wi-Fi, battery (dark bg, white icons).
- **Main Content:** Scrollable, neutral gray, infinite scroll, skeleton loaders.
- **Bottom Nav:** Fixed, white bg, 5 icons, center FAB for create.
- **Feed Cards:**
  - Avatar, username, ESN badge, role, timestamp, options menu.
  - Caption with @-mentions, hashtags, [more] link.
  - Media: 1:1 image, code block, or audio/visual with overlays.
  - Process/source bar with "View Process" link.
  - Action bar: like, comment, remix, share, bookmark.
- **Micro-interactions:** Animated hearts, haptic feedback, transitions.
- **Accessibility:** Color-coded ESN badges, tooltips, privacy controls.

---

## 6. Technical Architecture & Connectivity

- **Real-Time:** WebSockets for live comments/notifications.
- **Offline-First:** Service Workers, IndexedDB for caching.
- **API Design:** Path versioning, header negotiation, shared TS definitions, OpenAPI docs.
- **Caching:** CDN, Redis, browser storage.

---

## 7. Integration Points

- **Unified Identity:** Single sign-on across all platforms.
- **Direct Sharing:** "Share to JustStuff" in JustCreate.
- **Collaboration:** Remix trees, diff visualization, multi-AI messenger.

---

## 8. MVP Roadmap (6 Months)

- **Feed & Profile:** Mobile feed, user profiles, core API integration.
- **Publishing:** Direct publishing from JustCreate with metadata.
- **Moderation/Accessibility:** Flag/report, WCAG compliance, multilingual.
- **Real-Time:** WebSockets for feeds/notifications.
- **ESN & Tagging:** Early Support Number badges, hashtag/mention support.

---

## 9. Appendices

- **Wireframes:** See Figma files for mobile home feed.
- **API Docs:** Swagger/OpenAPI for all endpoints.
- **Shared Types:** Monorepo package for interfaces.
- **Real-Time Sync:** WebSocket/event docs.
- **Risk Matrix:** See master risk assessment for up-to-date risks.
- **Monetization:** Tipping, subscriptions, marketplace.

---

## 10. Alignment with Master & QA

- All mobile UI and integration features are tracked in the MVP deliverables and task board.
- QA for cross-platform, accessibility, and integration is covered in QA_TEMPLATES/PUBLISHING.md and QA_TEMPLATES/ARCHITECTURE.md.
- All authentication and API integration must use the centralized JustWorks system and documented contracts.

---

## 11. Virality & Growth Features (MVP & Beyond)

### **MVP Viral Feature Checklist**

**A. Remix Chains & Trending**
- [ ] Track and display number of remixes per post (backend & UI)
- [ ] Visualize remix chains (e.g., “Remixed by X in the last hour”)
- [ ] Trending/hot badges for rapidly remixed/shared posts
- [ ] QA: Trending/remix logic, UI visibility, and metrics accuracy

**B. Invite & Reward System**
- [ ] In-app “Invite Friends” flow (share link, contacts, socials)
- [ ] Reward badges/unlocks for inviters and invitees (first remix, first share, etc.)
- [ ] QA: Referral tracking, badge assignment, abuse prevention

**C. Instant Feedback & Notifications**
- [ ] Push/in-app notifications for remix, like, share events
- [ ] “Your remix is trending!” or “You started a remix chain!” banners
- [ ] QA: Notification reliability, opt-in/out, celebratory UX

**D. Remix Challenges**
- [ ] Launch weekly/monthly remix challenges (themed prompts, banners)
- [ ] Leaderboards for challenge participation/remix count
- [ ] QA: Challenge logic, leaderboard fairness, anti-spam

**E. Remix Tree Visualization**
- [ ] Interactive, tappable remix trees (show lineage, remix depth)
- [ ] Shareable remix tree links
- [ ] QA: Tree accuracy, UI responsiveness, privacy controls

**F. Shareability & Emotional Triggers**
- [ ] One-tap sharing (socials, copy-link, download)
- [ ] Micro-interactions: animated hearts, confetti, haptic feedback
- [ ] QA: Sharing flow, animation smoothness, device compatibility

---

### **Sub-Tasks for Engineering & QA**
- API endpoints for remix/share/invite tracking
- Frontend UI for badges, banners, remix trees, and notifications
- Integration with notification and analytics services
- Automated and manual QA for viral features
- Accessibility and internationalization for all viral UI

---

### **Launch & Marketing Checklist**
- Pre-launch: Seed remix challenges, recruit early remixers, prepare social media assets
- Launch: Announce remix chains, trending boards, and rewards
- Post-launch: Monitor viral metrics, adjust challenges, highlight top remixers weekly

---

> Reference this section in onboarding docs and dev handoff materials. All viral features must be tested and demoed before public launch.

---

*This doc is updated for 2025 and should be referenced by all JustStuff/mobile contributors. See master_docs/MASTER/CURRENT_MASTER.md for canonical requirements.*
