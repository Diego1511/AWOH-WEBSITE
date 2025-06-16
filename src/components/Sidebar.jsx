import React from "react";
import {
  UserCog,
  ShoppingCart,
  LayoutDashboard,
  ChevronLeft,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggle,
  currentUser,
  onLogout,
  setActivePage,
}) {
  const sidebarNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, page: "home" },
    { label: "Administrar Usuario", icon: UserCog, page: "manageUser" },
    { label: "Acceder a POS", icon: ShoppingCart, page: "pos" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          <span className={`${!isOpen && "hidden"} text-xl font-bold`}>
            AWOH
          </span>
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <ChevronLeft
              className={`transition-transform duration-300 ${
                !isOpen && "rotate-180"
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          {sidebarNavItems.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={() => setActivePage(item.page)}
              className="flex items-center p-3 my-1 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <item.icon className="h-6 w-6" />
              <span className={`ml-4 ${!isOpen && "hidden"}`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0)}
            </div>
            <div className={`ml-3 ${!isOpen && "hidden"}`}>
              <p className="font-semibold text-sm">{currentUser?.name}</p>
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:underline flex items-center gap-1"
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
