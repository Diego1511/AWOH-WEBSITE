import React from "react";
import { AlertTriangle } from "lucide-react";

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">¿Estás seguro?</h3>
        <p className="text-gray-600 mb-6">
          Esta acción cerrará tu sesión actual.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
