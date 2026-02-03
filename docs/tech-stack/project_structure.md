# 📂 Project Structure

```text
.
├── docs/                 # Documentation (Updated from template)
├── public/               # Static assets (images, icons)
├── src/
│   ├── main.js           # Core application logic & UI rendering
│   ├── schedule.js       # configuration for working hours and overrides
│   └── style.css         # Design system & component styles
├── index.html            # Main entry point
├── package.json          # Dependencies (Vite)
└── README.md             # Project overview
```

## 📜 File Descriptions

- **`src/main.js`**: Handles the calendar generation, timezone math, and UI interactivity.
- **`src/schedule.js`**: The single source of truth for your working schedule.
- **`src/style.css`**: Contains all styles, including the "Glassmorphism" effect.
- **`dist/`** (after build): Contains the optimized production files for deployment.
