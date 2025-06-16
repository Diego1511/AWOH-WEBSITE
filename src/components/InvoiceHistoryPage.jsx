// Archivo: src/components/InvoiceHistoryPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { FileText, X, Printer, Search } from "lucide-react";

// --- Componente Modal para ver detalles de la factura ---
const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  // Parsear los items de la factura, que están en formato JSON
  const items = JSON.parse(invoice.Item || "[]");

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "$0";
    return number.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles de la Factura
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <strong>No. Factura:</strong> {invoice.No}
          </div>
          <div>
            <strong>Fecha:</strong>{" "}
            {new Date(invoice.Fecha).toLocaleDateString("es-CO")}
          </div>
          <div>
            <strong>Cliente:</strong> {invoice.Nombre_Cl}
          </div>
          <div>
            <strong>Medio de Pago:</strong> {invoice.Medio_Pago}
          </div>
          <div className="col-span-2">
            <strong>Total:</strong>{" "}
            <span className="font-bold text-lg">
              {formatCurrency(invoice.Total)}
            </span>
          </div>
        </div>

        <h3 className="font-bold mb-2">Productos:</h3>
        <div className="border rounded-lg max-h-60 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Producto</th>
                <th className="p-2 text-center">Cantidad</th>
                <th className="p-2 text-right">Valor Unit.</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.nombre}</td>
                  <td className="p-2 text-center">{item.cantidad}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.valor_unitario)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.cantidad * item.valor_unitario)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          {/* La funcionalidad de imprimir se puede desarrollar más a futuro */}
          <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // <-- Nuevo estado para facturas filtradas
  const [searchTerm, setSearchTerm] = useState(""); // <-- Nuevo estado para el término de búsqueda
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "$0";
    return number.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/get_invoices.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        setInvoices(data.invoices);
        setFilteredInvoices(data.invoices); // Inicialmente, las filtradas son todas las facturas
      } else {
        alert("Error al cargar las facturas: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión al cargar las facturas.");
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // --- NUEVO USEEFFECT PARA FILTRAR ---
  // Se ejecuta cada vez que el término de búsqueda o la lista de facturas cambia
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = invoices.filter(
      (invoice) =>
        invoice.No.toLowerCase().includes(lowercasedFilter) ||
        invoice.Nombre_Cl.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div>
      <InvoiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        invoice={selectedInvoice}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText size={32} />
          Historial de Facturas
        </h1>
      </div>

      {/* --- NUEVA BARRA DE BÚSQUEDA --- */}
      <div className="relative w-full mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por No. de Factura o Nombre de Cliente..."
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
                <th className="p-3">No. Factura</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Medio de Pago</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ahora se mapean las facturas filtradas */}
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.No} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono">{invoice.No}</td>
                  <td className="p-3">
                    {new Date(invoice.Fecha).toLocaleDateString("es-CO")}
                  </td>
                  <td className="p-3 font-semibold">{invoice.Nombre_Cl}</td>
                  <td className="p-3 font-bold">
                    {formatCurrency(invoice.Total)}
                  </td>
                  <td className="p-3">{invoice.Medio_Pago}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewDetails(invoice)}
                      className="bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full hover:bg-blue-200 text-sm"
                    >
                      Ver Detalles
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
