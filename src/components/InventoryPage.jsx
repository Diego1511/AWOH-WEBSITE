// Archivo: src/components/InventoryPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Search,
} from "lucide-react";

// --- Componente Modal para Añadir/Editar Productos ---
const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Si se pasa un producto, es para editar. Si no, es para añadir uno nuevo.
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        Nombre_Inv: "",
        Valor: "",
        Stock: "",
        Costo: "",
        Descripcion: "",
        Porcentaje_IVA: 19, // Valor por defecto para nuevos productos
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">
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
              className="p-2 border rounded"
            />
            <input
              type="number"
              step="0.01"
              name="Valor"
              value={formData.Valor || ""}
              onChange={handleChange}
              placeholder="Valor de Venta (con IVA)"
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="Stock"
              value={formData.Stock || ""}
              onChange={handleChange}
              placeholder="Stock"
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              step="0.01"
              name="Costo"
              value={formData.Costo || ""}
              onChange={handleChange}
              placeholder="Costo"
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              step="0.01"
              name="Porcentaje_IVA"
              value={formData.Porcentaje_IVA || ""}
              onChange={handleChange}
              placeholder="Porcentaje IVA (%)"
              className="p-2 border rounded"
            />
            <textarea
              name="Descripcion"
              value={formData.Descripcion || ""}
              onChange={handleChange}
              placeholder="Descripción"
              className="p-2 border rounded md:col-span-2"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Componente Modal para Confirmar Eliminación ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Confirmar Eliminación
        </h3>
        <p className="text-gray-600 mb-6">
          ¿Realmente deseas eliminar el producto{" "}
          <span className="font-bold">"{productName}"</span>? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
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

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "$0";
    return number.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

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
      } else {
        alert("Error al cargar el inventario: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión al cargar el inventario.");
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = inventory.filter((item) =>
      item.Nombre_Inv.toLowerCase().includes(lowercasedFilter)
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
    <div>
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

      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package size={32} />
          Gestión de Inventario
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus size={20} />
          Añadir Producto
        </button>
      </div>

      <div className="relative w-full mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar en inventario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Precio sin IVA</th>
                <th className="p-3">Precio Venta (con IVA)</th>
                <th className="p-3">Costo</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.ID_Inv} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{item.Nombre_Inv}</td>
                  <td className="p-3">{formatCurrency(item.ValorSinIVA)}</td>
                  <td className="p-3 font-bold">
                    {formatCurrency(item.Valor)}
                  </td>
                  <td className="p-3">{formatCurrency(item.Costo)}</td>
                  <td className="p-3 text-center">{item.Stock}</td>
                  <td className="p-3 flex items-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteConfirm(item)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
