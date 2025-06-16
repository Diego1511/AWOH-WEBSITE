// Archivo: src/components/PosPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Search, X, PlusCircle, MinusCircle, ShoppingCart } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Buscar productos por nombre..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
      />
    </div>
  );
};

export default function PosPage({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  // --- ESTADOS NUEVOS ---
  const [isNamedInvoice, setIsNamedInvoice] = useState(false); // Controla el checkbox
  const [customerData, setCustomerData] = useState({
    nombre: "",
    documento: "",
    correo: "",
  });

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

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.ID_Inv === product.ID_Inv
      );
      if (existingProduct) {
        return currentCart.map((item) =>
          item.ID_Inv === product.ID_Inv
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.ID_Inv !== productId)
    );
  };
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.ID_Inv === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

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
      Items: cart.map((item) => ({
        id: item.ID_Inv,
        nombre: item.Nombre_Inv,
        cantidad: item.quantity,
        valor_unitario: item.Valor,
      })),
      Tipo: "Venta",
      Cliente: { nombre: "", documento: "", correo: "" }, // Por defecto, se usa el cliente genérico
    };

    // Si la factura es con nombre, valida y añade los datos del cliente
    if (isNamedInvoice) {
      if (!customerData.documento || !customerData.nombre) {
        alert(
          "Si la factura es con nombre, el nombre y documento del cliente son obligatorios."
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
      alert("Error al conectar con el servidor para registrar la venta.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Punto de Venta (POS)</h1>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SearchBar onSearch={setSearchTerm} />
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Precio sin IVA</th>
                  <th className="p-3">Precio Venta</th>
                  <th className="p-3">Acción</th>
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
                    <td className="p-3">
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-purple-100 text-purple-700 p-2 rounded-full hover:bg-purple-200 transition-colors"
                        title="Añadir al carrito"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Carrito</h2>
          </div>
          <div className="flex-grow max-h-[40vh] overflow-y-auto pr-2">
            {cart.length === 0 ? (
              <p className="text-gray-500">No hay productos en el carrito.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.ID_Inv}
                  className="flex justify-between items-center mb-4 pb-2 border-b"
                >
                  <div>
                    <p className="font-semibold">{item.Nombre_Inv}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.Valor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.ID_Inv, item.quantity - 1)
                      }
                      className="p-1 rounded-full bg-gray-200"
                    >
                      <MinusCircle size={18} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.ID_Inv, item.quantity + 1)
                      }
                      className="p-1 rounded-full bg-gray-200"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.ID_Inv)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-auto pt-4 space-y-4">
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="namedInvoice"
                  checked={isNamedInvoice}
                  onChange={(e) => setIsNamedInvoice(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="namedInvoice"
                  className="font-semibold select-none"
                >
                  Factura con nombre
                </label>
              </div>
              {isNamedInvoice && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-md border">
                  <input
                    type="text"
                    name="documento"
                    placeholder="Documento del Cliente"
                    value={customerData.documento}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del Cliente"
                    value={customerData.nombre}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo del Cliente (Opcional)"
                    value={customerData.correo}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-xl mb-4">
                <span>Total:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Medio de Pago:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                </select>
              </div>
              <button
                onClick={handleFinalizeSale}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg"
                disabled={cart.length === 0}
              >
                Finalizar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
