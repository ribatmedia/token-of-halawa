# DATABASE.md

The current version of **Token of Halawa** does not use a persistent server‑side database. All data (banners, slides, ticker text, donor information) is stored in the browser's `localStorage` for demo purposes.

Future versions may integrate a relational database (e.g., PostgreSQL) or a NoSQL store (e.g., MongoDB) for:
- Permanent donor records
- Campaign transaction logs
- Audit trails and analytics

When adding a database, update this document with the schema definitions, migration strategy, and connection details.
