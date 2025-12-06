# WEE-WAA Emergency Dispatching System - Frontend

A modern, real-time emergency dispatching system built with React, featuring role-based dashboards for admins, dispatchers, and responders.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation & Running

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at: `http://localhost:5173`
   - You'll see the Vite server address in the terminal

## 📦 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

## 🔑 Test Credentials

The app currently uses **mock data** (no backend required). You can login with any email/password:

**Admin Dashboard:**

```
Email: admin@weewaa.com
Password: any password
```

**Dispatcher Dashboard:**

```
Email: dispatcher@weewaa.com
Password: any password
```

**Responder Dashboard:**

```
Email: responder@weewaa.com
Password: any password
```

> **Note:** The role is automatically set to "admin" in mock mode. To test different roles, you can modify the mock response in `src/services/authService.js`.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (Alert, AuthHeader, etc.)
│   │   ├── homePage/        # Dashboard components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── dispatcher/  # Dispatcher-specific components
│   │   │   ├── responder/   # Responder-specific components
│   │   │   └── map/         # Map and marker components
│   │   ├── loginPage/       # Login page components
│   │   └── signupPage/      # Signup page components
│   ├── constants/           # App constants and configurations
│   │   ├── animations.js    # Framer Motion animations
│   │   ├── styles.js        # Tailwind CSS constants
│   │   └── responder.js     # Responder constants
│   ├── contexts/            # React Context providers
│   │   └── AppContext.jsx   # Global state management
│   ├── pages/               # Page components
│   │   ├── AdminHome.jsx
│   │   ├── DispatcherHome.jsx
│   │   ├── ResponderHome.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignUpPage.jsx
│   ├── services/            # API service layer
│   │   ├── api.js           # Base API configuration
│   │   ├── authService.js   # Authentication APIs
│   │   ├── adminService.js  # Admin APIs
│   │   ├── incidentService.js
│   │   ├── vehicleService.js
│   │   └── userService.js
│   ├── utils/               # Utility functions
│   │   └── dateUtils.js     # Date manipulation helpers
│   ├── App.jsx              # Main app component
│   └── main.jsx             # App entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Key Features

### Admin Dashboard

- 📊 **System Analytics** with circular progress indicators
- 📈 **Data Visualization** using Recharts (bar charts, histograms)
- 📅 **Date Range Filter** for analytics period
- 👥 **User Management** with delete functionality
- ⚡ **Skeleton Loaders** for optimal UX

### Dispatcher Dashboard

- 🗺️ **Interactive Map** with Leaflet
- 📋 **Incident Management** panel
- 🚑 **Vehicle Assignment** modal
- 🔄 **Real-time State Updates**
- 🎯 **Incident Filtering** by state

### Responder Dashboard

- 🚗 **Vehicle Information** display
- 📍 **Assigned Incident** details
- 🎚️ **State Controls** (Available, On Route, Busy)
- 📱 **Responsive Design**

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Icons** - Icon library

## 🔌 Backend Integration

Currently, the app uses **mock data**. To connect to a real backend:

1. Update `BASE_URL` in `src/services/api.js`
2. Uncomment the backend request sections in service files
3. Comment out the mock response sections

Example in `src/services/authService.js`:

```javascript
// Comment this out:
// return mockResponse;

// Uncomment this:
const response = await post("/auth/login", { email, password });
return response;
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete API endpoint documentation.

## 🎯 Development Tips

- **Hot Reload**: Changes are automatically reflected in the browser
- **Dark Mode**: The app uses a consistent dark theme throughout
- **Animations**: Powered by Framer Motion for smooth transitions
- **State Management**: Global state via React Context in `AppContext.jsx`
- **Protected Routes**: Authentication required for dashboard access

## 🐛 Troubleshooting

**Port already in use:**

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies issues:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 Environment Variables

No environment variables required for development (using mock data).

For production with backend:

- Create `.env` file in frontend directory
- Add: `VITE_API_URL=your_backend_url`

## 🚢 Production Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Build output will be in the `dist/` folder, ready to deploy to any static hosting service (Vercel, Netlify, etc.).

## 👥 Contributors

Built for the WEE-WAA Emergency Dispatching System project.

## 📄 License

[Add your license here]
