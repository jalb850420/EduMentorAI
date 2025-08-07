'use client';
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export default function MateriaManager() {
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const materiasRef = collection(db, "materias");

  useEffect(() => {
    const unsubscribe = onSnapshot(materiasRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterias(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMateria = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      await addDoc(materiasRef, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      });
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al agregar materia:", error);
    }
    setLoading(false);
  };

  const handleDeleteMateria = async (id) => {
    try {
      await deleteDoc(doc(db, "materias", id));
    } catch (error) {
      console.error("Error al eliminar materia:", error);
    }
  };

  const handleEdit = (materia) => {
    setEditId(materia.id);
    setEditNombre(materia.nombre);
    setEditDescripcion(materia.descripcion || "");
  };

  const handleUpdateMateria = async (id) => {
    if (!editNombre.trim()) return;

    try {
      await updateDoc(doc(db, "materias", id), {
        nombre: editNombre.trim(),
        descripcion: editDescripcion.trim(),
      });
      setEditId(null);
    } catch (error) {
      console.error("Error al actualizar materia:", error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddMateria} className="space-y-3">
        <input
          type="text"
          placeholder="Nombre de la materia"
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
          {loading ? "Agregando..." : "Agregar materia"}
        </button>
      </form>

      <ul className="space-y-2">
        {materias.map((materia) => (
          <li
            key={materia.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded"
          >
            {editId === materia.id ? (
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
                    onClick={() => handleUpdateMateria(materia.id)}
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
                  <strong>{materia.nombre}</strong> — {materia.descripcion}
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(materia)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteMateria(materia.id)}
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
