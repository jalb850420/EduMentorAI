'use client';
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export default function GradoManager() {
  const [grados, setGrados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  const gradosRef = collection(db, "grados");

  useEffect(() => {
    const unsubscribe = onSnapshot(gradosRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGrados(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAddGrado = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      await addDoc(gradosRef, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      });
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al agregar grado:", error);
    }
    setLoading(false);
  };

  const handleDeleteGrado = async (id) => {
    try {
      await deleteDoc(doc(db, "grados", id));
    } catch (error) {
      console.error("Error al eliminar grado:", error);
    }
  };

  const handleEdit = (grado) => {
    setEditId(grado.id);
    setEditNombre(grado.nombre);
    setEditDescripcion(grado.descripcion || "");
  };

  const handleUpdateGrado = async (id) => {
    if (!editNombre.trim()) return;

    try {
      const gradoRef = doc(db, "grados", id);
      await updateDoc(gradoRef, {
        nombre: editNombre.trim(),
        descripcion: editDescripcion.trim(),
      });
      setEditId(null);
    } catch (error) {
      console.error("Error al actualizar grado:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddGrado} className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Nombre del grado"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Agregando..." : "Agregar grado"}
        </button>
      </form>

      <ul className="space-y-2">
        {grados.map((grado) => (
          <li
            key={grado.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded"
          >
            {editId === grado.id ? (
              <div className="w-full md:flex md:items-center md:gap-4">
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="px-2 py-1 rounded border w-full md:w-40 dark:bg-gray-800 dark:text-white"
                />
                <input
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="px-2 py-1 rounded border w-full md:w-60 dark:bg-gray-800 dark:text-white"
                />
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleUpdateGrado(grado.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-gray-500 hover:text-gray-700 px-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <strong>{grado.nombre}</strong> — {grado.descripcion}
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(grado)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteGrado(grado.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
