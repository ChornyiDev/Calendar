# Work Calendar App

A modern, single-page work schedule calendar built with performance and timezone accuracy in mind.

## 🛠️ Tech Stack

This project uses a lightweight, modern stack with zero runtime dependencies for the app itself:

- **Build Tool**: [Vite](https://vitejs.dev/) (Extremely fast build and HMR)
- **Framework**: Vanilla JavaScript (ES6+) - No heavy frameworks like React or Vue, ensuring maximum performance.
- **Styling**: Native CSS Variables & Flexbox/Grid. Includes a custom Glassmorphism design system.
- **Date/Time Logic**: Native `Intl` API (`Intl.DateTimeFormat`, `Intl.Locale`) for accurate, browser-native timezone conversions without external libraries like Moment.js.

## 🚀 Deployment (How to Publish)

Since this is a **Static Website**, you don't need Node.js or a backend on your production server. You just need a web server (Nginx, Apache, etc.) to serve HTML/JS/CSS files.

### 1. Build the Project
Run the build command in your terminal:
```bash
npm run build
```

### 2. Locate the Output
This will create a `dist/` folder in your project directory containing:
- `index.html`
- `assets/` (bundled JS and CSS)

### 3. Upload to Server
Upload the **contents** of the `dist/` folder to your server's public web root (e.g., `/var/www/html` or `public_html`).

### 4. Configuration
The schedule logic works entirely in the user's browser, but it relies on your configuration.
- **Edit Hours**: Open `src/schedule.js` **before building** to set your weekly hours.
- **Server Location**: Does NOT matter. The app forces calculations based on the timezone set in `schedule.js` (`Europe/Kyiv` by default).

## 🌍 Features
- **Timezone Smart**: Automatically converts your Kyiv working hours to the client's local time.
- **Start of Week**: Auto-detects if the user prefers Monday or Sunday start (based on Region), with a manual toggle.
- **Dynamic Legend**: Shows what "Working Hours" means in the viewer's local time.
- **Glassmorphism UI**: Modern, responsive dark mode design.
