# API.md

## Backend Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET`  | `/api/health` | Health check – returns `{ status: "ok" }` | Public |
| `POST` | `/api/reset` | Clears all data stored in `localStorage` (used by developer reset button). | Developer only |
| `GET`  | `/api/banners` | Returns the list of uploaded banner URLs from `localStorage` (`homepage_banners`). | Public |
| `POST` | `/api/banners` | Save banner URLs (array of strings) to `localStorage`. Used by the developer panel after uploading images. | Developer |
| `GET`  | `/api/slides` | Returns custom campaign slide data (`campaign_slides`). | Public |
| `POST` | `/api/slides` | Save custom slide objects to `localStorage`. | Developer |
| `GET`  | `/api/ticker` | Retrieve the notice ticker text (`notice_ticker_text`). | Public |
| `POST` | `/api/ticker` | Update ticker text. | Developer |

All endpoints are thin wrappers that read/write to the browser's `localStorage` via the front‑end; there is no persistent server‑side database yet.
