import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PosPage from "./PosPage";
import InventoryPage from "./InventoryPage";
import InvoiceHistoryPage from "./InvoiceHistoryPage";

export default function DashboardLayout({ currentUser, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="relative min-h-screen bg-slate-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentUser={currentUser}
        onLogout={onLogout}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <main
        className={`transition-all duration-300 p-6 md:p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
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
        {activePage === "inventory" && <InventoryPage />}
        {activePage === "invoiceHistory" && <InvoiceHistoryPage />}
      </main>
    </div>
  );
}
