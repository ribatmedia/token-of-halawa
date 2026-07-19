# DESIGN_SYSTEM.md

## Design Tokens
- **Colors**: Primary – `#0F766E` (emerald), Secondary – `#D97706` (amber), Accent – `#6366F1` (indigo).
- **Typography**: Google Font **Inter** (weights 400, 600, 800). Headings use `font-bold` with variable sizes, body text uses `font-medium`.
- **Spacing**: 4px base unit, multiplied for paddings/margins (e.g., `p-4`, `mt-6`).
- **Radius**: Rounded corners `rounded-xl` for cards, `rounded-3xl` for containers.
- **Shadows**: Subtle `shadow-md` for elevation, `shadow-xl` for banner carousel.

## Component Styles
- **Buttons**: `bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl transition`.
- **Inputs**: `bg-slate-200/50 dark:bg-black/20 border border-slate-350 rounded-xl p-2.5 text-xs`.
- **Cards**: `border rounded-2xl p-4 bg-white/10 backdrop-blur-xl`.
- **Carousel**: Images fill container with `object-cover` and cross‑fade via opacity transition.

All UI follows a dark‑mode friendly palette with glass‑morphism effects where appropriate.
