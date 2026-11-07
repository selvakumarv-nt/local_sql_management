# SQL Practice Playground (Offline PWA)

A fully functional developer playground and SQL learning environment executing 100% locally inside the browser via **SQLite WebAssembly (WASM)** and **IndexedDB**.

## Features

- **No Remote Servers or APIs:** All queries execute natively on the local WebAssembly runtime.
- **Persistent Data:** Databases are serialized and stored inside the browser's IndexedDB engine across visits.
- **Interactive Learning Lab:** 17 SQL topics ranging from basic syntax up to nested transactions and view creations.
- **Exercise Assessment Engine:** Real-time query result comparison against expected relations with hints and explanations.
- **PWA & Offline First:** Works offline after the first visit via Service Worker caching.
- **ER Diagram Visualizer:** Automatic SVG rendering of tables, primary keys, and foreign key relations.
- **Import/Export:** Full CSV/SQL file import previewer, CSV result exporter, and raw `.sqlite` binary downloading.

---

## Local Setup & Development

Modern browsers require a local HTTP server to fetch WebAssembly files (`.wasm`) and register Service Workers (due to CORS limitations on `file:///` protocols).

### Prerequisites
Download the official [sql.js releases](https://github.com/sql-js/sql.js/) and ensure both files reside in `vendor/sqlite/`:
- `vendor/sqlite/sql-wasm.js`
- `vendor/sqlite/sql-wasm.wasm`

### Run with Python 3
```bash
python3 -m http.server 8080
