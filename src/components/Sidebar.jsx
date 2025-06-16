// Archivo: src/components/Sidebar.jsx
// VERSIÓN CORREGIDA: Los iconos ahora permanecen visibles cuando la barra se contrae.

import React from "react";
import {
  UserCog,
  ShoppingCart,
  LayoutDashboard,
  ChevronLeft,
  LogOut,
  Package,
  FileText,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggle,
  currentUser,
  onLogout,
  setActivePage,
  activePage,
}) {
  const sidebarNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, page: "home" },
    { label: "Acceder a POS", icon: ShoppingCart, page: "pos" },
    { label: "Gestionar Inventario", icon: Package, page: "inventory" },
    { label: "Historial de Facturas", icon: FileText, page: "invoiceHistory" },
    { label: "Administrar Usuario", icon: UserCog, page: "manageUser" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-900 via-blue-900 to-slate-900 text-white transition-all duration-300 z-40 shadow-2xl ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sección del Logo y Botón para colapsar */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
          <span
            className={`text-xl font-bold tracking-wider transition-opacity duration-200 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            AWOH
          </span>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft
              className={`transition-transform duration-300 ${
                !isOpen && "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-3 py-4">
          {sidebarNavItems.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.page);
              }}
              // CORRECCIÓN: Se añade justify-center cuando está cerrado para centrar el icono
              className={`flex items-center p-3 my-1 rounded-lg transition-all duration-200 group relative ${
                activePage === item.page
                  ? "bg-white/10 text-white font-semibold shadow-inner"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              } ${!isOpen && "justify-center"}`}
              title={isOpen ? "" : item.label} // Muestra un tooltip solo cuando está cerrado
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300 ${
                  activePage === item.page
                    ? "bg-gradient-to-r from-purple-500 to-blue-500"
                    : "bg-transparent"
                }`}
              ></div>
              <item.icon className="h-6 w-6 flex-shrink-0" />

              {/* CORRECCIÓN: El span ahora solo se renderiza si el sidebar está abierto */}
              {isOpen && (
                <span className="ml-4 whitespace-nowrap">{item.label}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Sección del Perfil de Usuario */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0 flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0)}
            </div>
            {/* CORRECCIÓN: El div con los datos solo se renderiza si está abierto */}
            {isOpen && (
              <div className="ml-3">
                <p className="font-semibold text-sm whitespace-nowrap">
                  {currentUser?.name}
                </p>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                >
                  <LogOut size={14} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
