import React from "react";
import {
  UserCog,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Package,
  FileText,
  Menu, // Se importa el icono de Menú
  Building,
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
    { label: "Gestionar Proveedores", icon: Building, page: "providers" },
  ];

  return (
    // Se usan transiciones CSS para la fluidez y se restaura el color original.
    <aside
      className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 ease-in-out z-40 shadow-2xl ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sección del Logo y Botón para colapsar */}
        {/* CORRECCIÓN: Se ajusta la estructura y clases para una alineación perfecta */}
        <div
          className={`flex items-center h-16 border-b border-white/10 px-4 ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          <span
            className={`text-xl font-bold tracking-wider text-white transition-opacity duration-200 ease-in-out ${
              !isOpen && "opacity-0 hidden"
            }`}
          >
            AWOH
          </span>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Menu size={24} />
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
              className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 group relative ${
                activePage === item.page
                  ? "bg-purple-700 text-white font-semibold"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              } ${!isOpen && "justify-center"}`} // Centra el icono cuando está cerrado
              title={!isOpen ? item.label : ""} // Muestra tooltip solo cuando está cerrado
            >
              <item.icon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  !isOpen && "opacity-0 hidden"
                }`}
              >
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Sección del Perfil de Usuario */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0)}
            </div>
            <div
              className={`ml-3 transition-opacity duration-200 ${
                !isOpen && "opacity-0 hidden"
              }`}
            >
              <p className="font-semibold text-sm whitespace-nowrap">
                {currentUser?.name}
              </p>
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <LogOut size={14} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
