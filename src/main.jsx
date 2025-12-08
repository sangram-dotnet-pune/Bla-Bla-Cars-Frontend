
import { createRoot  } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./Context/AuthContext";
import { NotificationProvider } from "./Context/NotificationContext";
import ErrorBoundary from "./Components/ErrorBoundary";

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </ErrorBoundary>
)
