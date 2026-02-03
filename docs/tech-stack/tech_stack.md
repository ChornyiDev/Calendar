# 🛠️ Technology Stack

**Project Name:** Work Calendar
**Architecture:** Single-Page Application (SPA)
**Build Tool:** Vite

## 1. Core Technologies
- **JavaScript (ES6+):** Vanilla JavaScript for logic, avoiding heavy frameworks for maximum performance and predictability.
- **HTML5:** Semantic structure for the calendar layout.
- **CSS3:** Modern CSS with Grid, Flexbox, and CSS Variables for the Glassmorphism design system.

## 2. Key APIs & Logic
- **Native Intl API:** Used for timezone conversions and date formatting.
    - `Intl.DateTimeFormat`
    - `Intl.Locale`
- **Timezone Management:** Logic based on `Europe/Kyiv` by default, with automatic conversion to user's local time.

## 3. Storage & Data
- **Static Configuration:** All scheduling data, including working hours and overrides, is stored in `src/schedule.js`.
- **No Backend:** The app functions entirely client-side, making it easy to deploy on any static hosting provider.
