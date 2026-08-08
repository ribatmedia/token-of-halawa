# Changelog

All notable changes to the **Token of Halawa** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-31

### Added
- **Mahabba Campaign System**: Full support for monthly donor renewals with custom month selection, automatic split amount math, and payment tracking.
- **Class Handover Tracking**: Dedicated workflow and receipt generation for class leaders handing over collected cash funds to administrators (`HND-2026-XXXX`).
- **Digital Receipt Engine**: Instant modal receipt rendering with client-side PDF (`jspdf`) and high-resolution PNG image export (`html-to-image`).
- **RBAC Infrastructure**: Complete role-based access control with `SUPER_ADMIN`, `ORG_ADMIN`, `AREA_MANAGER`, `CLASS_LEADER`, `VOLUNTEER`, and `AUDITOR` permissions.
- **Physical Verification Queue**: Admin and Manager verification queue for inspecting and approving field cash collections.
- **Developer Diagnostics**: Developer portal tab for environment diagnostics, custom banner configuration, and factory reset utilities.
- **Comprehensive Documentation Suite**: Added `README.md`, `CHANGELOG.md`, `.env.example`, `docs/AI_CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/DEPLOYMENT.md`, and `docs/FOLDER_STRUCTURE.md`.

### Changed
- **Class Name Standardization**: Standardized class naming conventions to `D1`, `D2`, `D3`, `Final year`, etc., across all leaderboard views and statistics.
- **Campaigner Identifier**: Standardized campaigner roll number labeling from `HN` / `HN NO` to `Roll No` / `R.NO` across forms and listings.
- **UI Enhancements**: Cleaned up donor table actions, removed duplicate receipt triggers, updated modern gradient styling, and refined dark mode aesthetics.

### Fixed
- **Optimistic Deletion & Offline Persistence**: Resolved issue where deleted donations were not persisting across page reloads or panel switches. Added local storage synchronization and backend permission grants for `VOLUNTEER` deletion requests.
- **Character Encoding Integrity**: Fixed garbled Malayalam text strings across dashboard tips, auto-detect labels, confirmation dialogs, and receipt headers.
- **TypeError in Renew Flow**: Fixed runtime error during offline fallback donation logging by ensuring robust ID fallbacks and array state guards.
- **Receipt Styling**: Corrected duplicate `/month` text rendering on generated digital receipts.
