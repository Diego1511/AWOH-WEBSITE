import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  BarChart,
  PieChart,
  Filter,
  XCircle,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend as PieLegend,
} from "recharts";

const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "$0";
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

// --- Componentes Pequeños de la UI ---
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6"
  >
    <div className={`p-4 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
  </motion.div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg h-96 flex flex-col">
    <h3 className="font-bold text-xl text-gray-800 mb-4">{title}</h3>
    <div className="flex-grow">{children}</div>
  </div>
);

// --- Componente Principal del Dashboard ---
export default function DashboardPage({ currentUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // --- ESTADOS PARA LOS FILTROS ---
  const [filterType, setFilterType] = useState("all"); // 'all', 'day', 'month'
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchDashboardData = useCallback(async (filter = {}) => {
    try {
      setLoading(true);
      let url = "https://awohconsulting.com/api/get_dashboard_data.php";
      const params = new URLSearchParams();
      if (filter.type === "day" && filter.value) {
        params.append("date", filter.value);
      } else if (filter.type === "month" && filter.value) {
        params.append("month", filter.value);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "success") {
        setDashboardData(data.data);
      } else {
        alert("Error al cargar los datos del dashboard.");
      }
    } catch (error) {
      console.error("Error de conexión al cargar datos del dashboard.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData({ type: "all" });
  }, [fetchDashboardData]);

  const handleFilterChange = () => {
    if (filterType === "day" && selectedDate) {
      fetchDashboardData({ type: "day", value: selectedDate });
    } else if (filterType === "month" && selectedMonth) {
      fetchDashboardData({ type: "month", value: selectedMonth });
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setSelectedDate("");
    setSelectedMonth("");
    fetchDashboardData({ type: "all" });
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-1 text-gray-500 mb-6">
        Resumen de la actividad de tu negocio.
      </p>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="bg-white p-4 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <Filter size={18} />
          Filtrar por:
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">Todo el tiempo</option>
          <option value="day">Día específico</option>
          <option value="month">Mes específico</option>
        </select>
        {filterType === "day" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
        )}
        {filterType === "month" && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-lg"
          />
        )}
        <button
          onClick={handleFilterChange}
          className="w-32 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          Aplicar
        </button>
        <button
          onClick={clearFilters}
          className="text-gray-500 hover:text-red-500 flex items-center gap-1"
        >
          <XCircle size={16} /> Limpiar
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10">Cargando datos...</div>
      ) : !dashboardData ? (
        <div className="text-center p-10 text-red-500">
          No se pudieron cargar los datos.
        </div>
      ) : (
        <>
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ventas de Hoy"
              value={formatCurrency(dashboardData.stats.salesToday)}
              icon={<DollarSign className="text-white" />}
              color="bg-green-500"
            />
            <StatCard
              title="Facturas (en periodo)"
              value={dashboardData.stats.totalInvoices}
              icon={<ShoppingBag className="text-white" />}
              color="bg-blue-500"
            />
            <StatCard
              title="Ingresos (en periodo)"
              value={formatCurrency(dashboardData.stats.totalRevenue)}
              icon={<BarChart className="text-white" />}
              color="bg-purple-500"
            />
            <StatCard
              title="Ticket Promedio (en periodo)"
              value={formatCurrency(dashboardData.stats.averageTicket)}
              icon={<PieChart className="text-white" />}
              color="bg-orange-500"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3">
              <ChartContainer title="Ventas Diarias (en periodo)">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={dashboardData.dailySales}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="fecha" />
                    <YAxis tickFormatter={formatCurrency} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                      }}
                      itemStyle={{ color: "black" }}
                      labelStyle={{ fontWeight: "bold" }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar
                      dataKey="total"
                      fill="url(#colorUv)"
                      name="Ventas"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="xl:col-span-2">
              <ChartContainer title="Top 5 Productos Vendidos (en periodo)">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={dashboardData.topProducts}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {dashboardData.topProducts.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} unidades`, "Vendido"]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
