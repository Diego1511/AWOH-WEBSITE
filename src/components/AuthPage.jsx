import React, { useState } from "react";

export default function AuthPage({ setPage, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("login");
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const response = await fetch("https://awohconsulting.com/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.email !== data.confirm_email) {
      alert("Los correos electrónicos no coinciden.");
      return;
    }
    if (data.password !== data.confirm_password) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    const { confirm_email, confirm_password, ...userData } = data;
    try {
      const response = await fetch(
        "https://awohconsulting.com/api/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        setAuthMode("login");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            onClick={() => setPage("home")}
            className="text-4xl font-bold cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
          >
            AWOH
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          {authMode === "login" ? (
            <div>
              <h2
                className="text-2xl font-bold text-center mb-6"
                style={{ color: "#2C3E50" }}
              >
                Iniciar Sesión
              </h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="font-semibold mb-2 block" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label
                    className="font-semibold mb-2 block"
                    htmlFor="password"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all"
                  style={{ backgroundColor: "#8E44AD" }}
                >
                  Ingresar
                </button>
              </form>
              <p className="text-center mt-6">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => setAuthMode("register")}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          ) : (
            <div>
              <h2
                className="text-2xl font-bold text-center mb-6"
                style={{ color: "#2C3E50" }}
              >
                Crear Cuenta
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  name="nombre_usuario"
                  required
                  placeholder="Nombre de Usuario"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  name="cc"
                  required
                  placeholder="CC (Cédula de Ciudadanía)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  name="telefono"
                  required
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Correo Electrónico"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="email"
                  name="confirm_email"
                  required
                  placeholder="Confirmar Correo Electrónico"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="Confirmar Contraseña"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700"
                  style={{ backgroundColor: "#8E44AD" }}
                >
                  Registrarme
                </button>
              </form>
              <p className="text-center mt-6">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
