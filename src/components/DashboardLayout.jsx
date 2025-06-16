// --- Archivo: src/components/DashboardLayout.jsx ---
// Asegúrate de que este archivo esté exactamente así.

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PosPage from "./PosPage"; // Importación clave

export default function DashboardLayout({ currentUser, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentUser={currentUser}
        onLogout={onLogout}
        setActivePage={setActivePage}
      />
      <main
        className={`transition-all duration-300 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Renderizado condicional del contenido */}
        {activePage === "home" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              ¡Bienvenido de nuevo, {currentUser.name}!
            </p>
          </div>
        )}
        {activePage === "manageUser" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Administrar Usuario
            </h1>
            <p className="mt-2 text-gray-600">Aquí podrás editar tu perfil.</p>
          </div>
        )}
        {activePage === "pos" && <PosPage currentUser={currentUser} />}
      </main>
    </div>
  );
}
