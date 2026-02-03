# 🔌 Database & Data Storage

**Status:** Active (Static Configuration)
**Type:** Local Static JavaScript Object

## 1. Data Source
This project does **not** use a traditional database engine like PostgreSQL or MongoDB. Instead, all scheduling data is managed via:

**File:** `src/schedule.js`

## 2. Why Static?
1. **Performance:** Instant data access without network latency.
2. **Simplicity:** No need for backend servers, authentication, or complex APIs.
3. **Portability:** The entire schedule travels with the code.

## 3. How to Update Data
To change working hours or add holidays, simply modify the `scheduleConfig` object in `src/schedule.js` and rebuild/redeploy the application.