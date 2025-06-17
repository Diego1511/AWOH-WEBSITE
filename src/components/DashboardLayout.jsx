import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";

// Se importan todos los componentes de página que se mostrarán en este layout
import PosPage from "./PosPage";
import InventoryPage from "./InventoryPage";
import InvoiceHistoryPage from "./InvoiceHistoryPage";
import DashboardPage from "./DashboardPage";
import ProvidersPage from "./ProvidersPage";

// Componente placeholder para la sección "Administrar Usuario"
const ManageUserPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Administrar Usuario</h1>
    <p className="mt-2 text-gray-600">
      Aquí podrás editar la información de tu perfil y empresa.
    </p>
  </div>
);

export default function DashboardLayout({ currentUser, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  // Función que decide qué componente de página renderizar
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <DashboardPage currentUser={currentUser} />;
      case "pos":
        return <PosPage currentUser={currentUser} />;
      case "inventory":
        return <InventoryPage />;
      case "invoiceHistory":
        return <InvoiceHistoryPage />;
      case "manageUser":
        return <ManageUserPage />;
      default:
        return <DashboardPage currentUser={currentUser} />;
      case "providers":
        return <ProvidersPage />;
    }
  };

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

      {/* Contenedor principal para el contenido de la página */}
      <motion.main
        className="p-6 md:p-8"
        animate={{ marginLeft: isSidebarOpen ? "16rem" : "5rem" }} // Anima el margen izquierdo
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* AnimatePresence maneja las animaciones de entrada y salida de los componentes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage} // La key es crucial para que AnimatePresence detecte el cambio de componente
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
