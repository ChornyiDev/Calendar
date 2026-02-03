# 💻 Local Development & Testing

To run the project locally for development and testing, follow these steps:

## 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## 2. Installation
If you haven't already, install the project dependencies:
```bash
npm install
```

## 3. Start Development Server
Run the following command to start the local development server:
```bash
npm run dev
```
Once started, the terminal will provide a local URL (usually `http://localhost:5173`). Open this URL in your browser to view and test the application.

## 4. Key Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Builds the project for production. |
| `npm run preview` | Locally previews the production build. |

## 5. Testing Changes
- **Timezone Testing:** Use the timezone selector in the app header to verify how working hours shift for different users.
- **Schedule Testing:** Modify `src/schedule.js` to test different weekly schedules or date overrides.
- **UI Testing:** The app is responsive; test it by resizing your browser window or using mobile emulation in browser dev tools.
