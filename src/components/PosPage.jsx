import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Minus,
  ShoppingCart,
  User as UserIcon,
  Mail,
  File as FileIcon,
} from "lucide-react";

// --- Componentes Pequeños de la UI ---
const SearchInput = ({ onSearch }) => (
  <div className="relative w-full mb-6">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      size={22}
    />
    <motion.input
      whileFocus={{ scale: 1.02 }}
      type="text"
      placeholder="Buscar por nombre o ID del producto..." // <-- Texto del placeholder actualizado
      onChange={(e) => onSearch(e.target.value)}
      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
    />
  </div>
);

const ProductCard = ({ product, onAddToCart }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between"
  >
    <div>
      <h3 className="font-bold text-gray-800">{product.Nombre_Inv}</h3>
      <p className="text-sm text-gray-500">
        {product.Descripcion || "Sin descripción"}
      </p>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700 text-sm">
          Sin IVA: {formatCurrency(product.ValorSinIVA)}
        </span>
        <span className="font-bold text-lg text-purple-700">
          {formatCurrency(product.Valor)}
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onAddToCart(product)}
        className="bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-700"
      >
        <Plus size={20} />
      </motion.button>
    </div>
  </motion.div>
);

const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "$0";
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

// --- Componente Principal de la Página POS ---
export default function PosPage({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [isNamedInvoice, setIsNamedInvoice] = useState(false);
  const [customerData, setCustomerData] = useState({
    nombre: "",
    documento: "",
    correo: "",
  });

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
        String(item.ID_Inv).includes(searchTerm)
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.ID_Inv === product.ID_Inv
      );
      if (existing) {
        return currentCart.map((item) =>
          item.ID_Inv === product.ID_Inv
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((currentCart) => {
      const newCart = currentCart.map((item) => {
        if (item.ID_Inv === productId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
      return newCart;
    });
  };

  const removeFromCart = (productId) =>
    setCart((currentCart) =>
      currentCart.filter((item) => item.ID_Inv !== productId)
    );

  const cartTotal = cart.reduce(
    (total, item) => total + item.Valor * item.quantity,
    0
  );

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    let saleData = {
      Medio_Pago: paymentMethod,
      Forma_Pago: "Contado",
      Total: cartTotal,
      NIT: currentUser.nit,
      Items: cart.map((p) => ({
        id: p.ID_Inv,
        nombre: p.Nombre_Inv,
        cantidad: p.quantity,
        valor_unitario: p.Valor,
      })),
      Tipo: "Venta",
      Cliente: { nombre: "", documento: "", correo: "" },
    };
    if (isNamedInvoice) {
      if (!customerData.documento || !customerData.nombre) {
        alert(
          "El nombre y documento del cliente son obligatorios para facturas con nombre."
        );
        return;
      }
      saleData.Cliente = customerData;
    }
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/create_invoice.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        }
      );
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        setCart([]);
        setPaymentMethod("Efectivo");
        setCustomerData({ nombre: "", documento: "", correo: "" });
        setIsNamedInvoice(false);
        fetchInventory();
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Panel de Productos */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Punto de Venta
          </h1>
          <p className="text-gray-500 mb-6">
            Busca y añade productos al carrito para completar una venta.
          </p>
          <SearchInput onSearch={setSearchTerm} />
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredInventory.map((item) => (
                <ProductCard
                  key={item.ID_Inv}
                  product={item}
                  onAddToCart={addToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Panel del Carrito */}
        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Resumen de Venta
            </h2>
          </div>
          <div className="max-h-[35vh] overflow-y-auto pr-2 space-y-4">
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-center py-8"
                >
                  El carrito está vacío.
                </motion.p>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.ID_Inv}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.Nombre_Inv}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.Valor)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.ID_Inv, -1)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.ID_Inv, 1)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.ID_Inv)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 border-t pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <motion.input
                type="checkbox"
                id="namedInvoice"
                checked={isNamedInvoice}
                onChange={(e) => setIsNamedInvoice(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label
                htmlFor="namedInvoice"
                className="font-semibold select-none cursor-pointer"
              >
                Factura a nombre de cliente
              </label>
            </div>
            <AnimatePresence>
              {isNamedInvoice && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="relative">
                    <FileIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="documento"
                      placeholder="Documento"
                      value={customerData.documento}
                      onChange={handleCustomerChange}
                      className="w-full pl-10 p-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre Completo"
                      value={customerData.nombre}
                      onChange={handleCustomerChange}
                      className="w-full pl-10 p-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="correo"
                      placeholder="Correo (Opcional)"
                      value={customerData.correo}
                      onChange={handleCustomerChange}
                      className="w-full pl-10 p-2 border rounded-md"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between font-bold text-2xl text-gray-800 mb-4">
              <span>Total:</span>
              <motion.span
                key={cartTotal}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatCurrency(cartTotal)}
              </motion.span>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">
                Medio de Pago:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option>Efectivo</option>
                <option>Transferencia</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinalizeSale}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              disabled={cart.length === 0}
            >
              Finalizar Venta
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
