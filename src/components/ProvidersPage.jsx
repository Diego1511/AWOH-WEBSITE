import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building,
  Phone,
  Mail,
  Tag,
  FileDigit,
} from "lucide-react";

// --- Componente Modal para Añadir/Editar Proveedores ---
const ProviderModal = ({ isOpen, onClose, onSave, provider }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(
      provider
        ? provider
        : {
            NIT: "",
            Nombre_Pro: "",
            Correo: "",
            Celular: "",
            Tipo_Producto: "",
          }
    );
  }, [provider, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {provider ? "Editar Proveedor" : "Añadir Nuevo Proveedor"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="Nombre_Pro"
                  value={formData.Nombre_Pro || ""}
                  onChange={handleChange}
                  placeholder="Nombre del Proveedor"
                  required
                  className="p-3 border rounded-lg"
                />
                <input
                  name="NIT"
                  value={formData.NIT || ""}
                  onChange={handleChange}
                  placeholder="NIT / Documento"
                  required
                  className="p-3 border rounded-lg"
                  disabled={!!provider}
                />
                <input
                  type="email"
                  name="Correo"
                  value={formData.Correo || ""}
                  onChange={handleChange}
                  placeholder="Correo Electrónico"
                  required
                  className="p-3 border rounded-lg"
                />
                <input
                  type="tel"
                  name="Celular"
                  value={formData.Celular || ""}
                  onChange={handleChange}
                  placeholder="Celular"
                  className="p-3 border rounded-lg"
                />
                <input
                  name="Tipo_Producto"
                  value={formData.Tipo_Producto || ""}
                  onChange={handleChange}
                  placeholder="Tipo de Producto"
                  required
                  className="p-3 border rounded-lg md:col-span-2"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 font-bold py-2 px-6 rounded-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Guardar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Componente Principal de la Página de Proveedores ---
export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [deletingProvider, setDeletingProvider] = useState(null);

  const fetchProviders = useCallback(async () => {
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/get_providers.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error("Error de conexión al cargar proveedores.");
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = providers.filter(
      (p) =>
        p.Nombre_Pro.toLowerCase().includes(lowercasedFilter) ||
        p.NIT.toLowerCase().includes(lowercasedFilter) ||
        p.Correo.toLowerCase().includes(lowercasedFilter) ||
        p.Tipo_Producto.toLowerCase().includes(lowercasedFilter) ||
        (p.Celular && p.Celular.toLowerCase().includes(lowercasedFilter))
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const handleOpenModal = (provider = null) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProvider(null);
  };
  const handleOpenDeleteConfirm = (provider) => {
    setDeletingProvider(provider);
  };
  const handleCloseDeleteConfirm = () => {
    setDeletingProvider(null);
  };

  const handleSave = async (providerData) => {
    const isEditing = !!providerData.NIT_original; // Se usa NIT original para la actualización
    const url = isEditing
      ? "https://awohconsulting.com/api/update_provider.php"
      : "https://awohconsulting.com/api/add_provider.php";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providerData),
      });
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        handleCloseModal();
        fetchProviders();
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  const handleDelete = async () => {
    if (!deletingProvider) return;
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/delete_provider.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ NIT: deletingProvider.NIT }),
        }
      );
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        handleCloseDeleteConfirm();
        fetchProviders();
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProviderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        provider={editingProvider}
      />
      {/* Modal de confirmación de borrado puede ser un componente reutilizable */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Building size={36} />
            Gestión de Proveedores
          </h1>
          <p className="text-gray-500 mt-1">
            Añade, edita y gestiona tus proveedores.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          Añadir Proveedor
        </motion.button>
      </div>

      <div className="relative w-full mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />
        <input
          type="text"
          placeholder="Buscar por nombre, NIT, correo, etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProviders.map((p) => (
            <motion.div
              key={p.NIT}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-5 flex-grow">
                <h3 className="font-bold text-lg text-gray-800">
                  {p.Nombre_Pro}
                </h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <FileDigit size={16} className="text-gray-400" />
                    <span>{p.NIT}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{p.Correo}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{p.Celular || "No registrado"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    <span>{p.Tipo_Producto}</span>
                  </p>
                </div>
              </div>
              <div className="p-2 bg-gray-100/70 flex justify-end gap-2 border-t">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenModal({ ...p, NIT_original: p.NIT })}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenDeleteConfirm(p)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
