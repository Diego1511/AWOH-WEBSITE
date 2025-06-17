import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Search,
} from "lucide-react";

const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "$0";
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

// --- Componente Modal para Añadir/Editar Productos (Rediseñado) ---
const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (product) setFormData(product);
    else
      setFormData({
        Nombre_Inv: "",
        Valor: "",
        Stock: "",
        Costo: "",
        Descripcion: "",
        Porcentaje_IVA: 19,
      });
  }, [product, isOpen]);

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
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {product ? "Editar Producto" : "Añadir Nuevo Producto"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="Nombre_Inv"
                  value={formData.Nombre_Inv || ""}
                  onChange={handleChange}
                  placeholder="Nombre del Producto"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="number"
                  step="0.01"
                  name="Valor"
                  value={formData.Valor || ""}
                  onChange={handleChange}
                  placeholder="Valor de Venta (con IVA)"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="number"
                  name="Stock"
                  value={formData.Stock || ""}
                  onChange={handleChange}
                  placeholder="Stock"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="number"
                  step="0.01"
                  name="Costo"
                  value={formData.Costo || ""}
                  onChange={handleChange}
                  placeholder="Costo"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="number"
                  step="0.01"
                  name="Porcentaje_IVA"
                  value={formData.Porcentaje_IVA || ""}
                  onChange={handleChange}
                  placeholder="Porcentaje IVA (%)"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <textarea
                  name="Descripcion"
                  value={formData.Descripcion || ""}
                  onChange={handleChange}
                  placeholder="Descripción"
                  className="p-3 border border-gray-300 rounded-lg md:col-span-2 h-24"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

// --- Componente Modal para Confirmar Eliminación (Rediseñado) ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
          >
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Realmente deseas eliminar el producto{" "}
              <span className="font-bold text-purple-700">"{productName}"</span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Componente Principal de la Página de Inventario ---
export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const fetchInventory = useCallback(async () => {
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/get_inventory.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        const inventoryWithPrice = data.inventory.map((p) => ({
          ...p,
          ValorSinIVA:
            parseFloat(p.Valor) / (1 + parseFloat(p.Porcentaje_IVA) / 100),
        }));
        setInventory(inventoryWithPrice);
      }
    } catch (error) {
      console.error("Error de conexión al cargar el inventario.");
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // --- LÓGICA DE BÚSQUEDA ACTUALIZADA ---
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = inventory.filter(
      (item) =>
        // Busca por nombre del producto
        item.Nombre_Inv.toLowerCase().includes(lowercasedFilter) ||
        // O busca por ID del producto
        String(item.ID_Inv).includes(lowercasedFilter)
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  const handleOpenDeleteConfirm = (product) => {
    setDeletingProduct(product);
  };
  const handleCloseDeleteConfirm = () => {
    setDeletingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    const isEditing = !!productData.ID_Inv;
    const url = isEditing
      ? "https://awohconsulting.com/api/update_product.php"
      : "https://awohconsulting.com/api/add_product.php";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        handleCloseModal();
        fetchInventory();
      }
    } catch (error) {
      alert("Error al conectar con el servidor para guardar el producto.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/delete_product.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ID_Inv: deletingProduct.ID_Inv }),
        }
      );
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        handleCloseDeleteConfirm();
        fetchInventory();
      }
    } catch (error) {
      alert("Error al conectar con el servidor para eliminar el producto.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteProduct}
        productName={deletingProduct?.Nombre_Inv}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Package size={36} />
            Gestión de Inventario
          </h1>
          <p className="text-gray-500 mt-1">
            Añade, edita y gestiona todos tus productos.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          Añadir Producto
        </motion.button>
      </div>

      <div className="relative w-full mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o ID del producto..." // <-- Texto actualizado
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredInventory.map((item) => (
            <motion.div
              key={item.ID_Inv}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-4 flex-grow">
                <h3 className="font-bold text-gray-800">{item.Nombre_Inv}</h3>
                <p className="text-xs text-gray-400 mt-1">ID: {item.ID_Inv}</p>
              </div>
              <div className="p-4 bg-slate-50 border-t space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Precio Venta:</span>{" "}
                  <span className="font-semibold">
                    {formatCurrency(item.Valor)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Costo:</span>{" "}
                  <span className="font-semibold">
                    {formatCurrency(item.Costo)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Stock:</span>{" "}
                  <span className="font-bold text-lg text-blue-600">
                    {item.Stock}
                  </span>
                </p>
              </div>
              <div className="p-2 bg-gray-100 flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenModal(item)}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                  title="Editar"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenDeleteConfirm(item)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                  title="Eliminar"
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
