import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { ThemeProvider } from "./context/ThemeContext";

import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MyAccountPage from "./pages/MyAccountPage";
import CalendarPage from "./pages/CalendarPage";
import NexusIAPage from "./pages/NexusIAPage";
import { NexusChatProvider } from "./context/NexusChatProvider";

import "./App.css";

function AppLayout() {
  const [isCollapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <NexusChatProvider>
      <div className="app-layout">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onLogout={logout}
        />
        <main>
          <Outlet />
        </main>
      </div>
    </NexusChatProvider>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, checkingSession } = useAuth();

  if (checkingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/nexus-ia" element={<NexusIAPage />} />
              <Route path="/my-account" element={<MyAccountPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}