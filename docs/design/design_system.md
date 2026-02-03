# 🎨 Design System: Glassmorphism Pro

## 1. Palette
The app uses a dark-themed, translucent design system.

- **Background:** Deep dark gradients.
- **Card Background:** Semi-transparent white/black with `backdrop-filter: blur()`.
- **Primary Color:** Vibrant accents for working hours.

## 2. Core Components
- **The Grid:** CSS Grid provides the foundation for the monthly calendar view.
- **Interactivity:** Hover effects and transitions for day slots.
- **Responsiveness:** Auto-adjusts layout for mobile devices.

## 3. CSS Variables
Styles are managed through variables in `src/style.css`:
- `--glass-bg`: The background color of calendar cards.
- `--text-primary`: Main text color.
- `--accent-color`: Color for highlighted working ranges.
