import React from "react";
import { motion } from "framer-motion";
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
    <motion.aside
      animate={isOpen ? "open" : "closed"}
      initial={false}
      className={`fixed top-0 left-0 h-full bg-slate-900/80 backdrop-blur-lg text-white z-40 shadow-2xl`}
      variants={{
        open: { width: "16rem" },
        closed: { width: "5rem" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 h-20 border-b border-white/10">
          <motion.span
            className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
            variants={{
              open: { opacity: 1, x: 0 },
              closed: { opacity: 0, x: -20 },
            }}
          >
            AWOH
          </motion.span>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <motion.div
              variants={{ open: { rotate: 0 }, closed: { rotate: 180 } }}
            >
              <ChevronLeft />
            </motion.div>
          </button>
        </div>

        <motion.nav className="flex-1 px-4 py-4">
          {sidebarNavItems.map((item) => (
            <motion.a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.page);
              }}
              className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 group relative ${
                activePage === item.page
                  ? "text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              title={isOpen ? "" : item.label}
            >
              {activePage === item.page && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                ></motion.div>
              )}
              <div className="relative z-10 flex items-center">
                <item.icon className="h-6 w-6 flex-shrink-0" />
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -10 },
                  }}
                >
                  {item.label}
                </motion.span>
              </div>
            </motion.a>
          ))}
        </motion.nav>

        <div className="p-4 border-t border-white/10">
          <motion.div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0 flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0)}
            </div>
            <motion.div
              className="ml-3 overflow-hidden"
              variants={{
                open: { opacity: 1, width: "auto" },
                closed: { opacity: 0, width: 0 },
              }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
