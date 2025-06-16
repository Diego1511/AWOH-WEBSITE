import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import LogoutModal from "./components/LogoutModal";

export default function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const loggedUser = localStorage.getItem("awoh_user");
    if (loggedUser) {
      setCurrentUser(JSON.parse(loggedUser));
      setPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("awoh_user", JSON.stringify(userData));
    setPage("dashboard");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("awoh_user");
    setShowLogoutConfirm(false);
    setPage("home");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {showLogoutConfirm && (
        <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}

      {page === "dashboard" && currentUser ? (
        <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />
      ) : page === "auth" ? (
        <AuthPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <LandingPage setPage={setPage} />
      )}
    </>
  );
}
