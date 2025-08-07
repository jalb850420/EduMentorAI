'use client';
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

export default function AsignacionesManager() {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grado, setGrado] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [asignaciones, setAsignaciones] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // 👈 nuevo estado

  const asignacionesRef = collection(db, "asignaciones");

  const fetchProfesores = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const docentes = snapshot.docs
      .filter(doc => doc.data().role === "docente")
      .map(doc => ({ id: doc.id, ...doc.data() }));
    setProfesores(docentes);
  };

  const fetchMaterias = async () => {
    const snapshot = await getDocs(collection(db, "materias"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterias(data);
  };

  const fetchGrados = async () => {
    const snapshot = await getDocs(collection(db, "grados"));
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => parseInt(a.nombre) - parseInt(b.nombre));
    setGrados(data);
  };

  const fetchAllData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([fetchProfesores(), fetchMaterias(), fetchGrados()]);
    } catch (error) {
      console.error("Error refrescando datos:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const unsubscribe = onSnapshot(asignacionesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAsignaciones(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAsignar = async (e) => {
    e.preventDefault();
    if (!profesorId || !materiaId || !grado) return;

    const profesor = profesores.find(p => p.id === profesorId);
    const materia = materias.find(m => m.id === materiaId);

    try {
      await addDoc(asignacionesRef, {
        profesorId,
        profesorNombre: profesor?.name || "Sin nombre",
        materiaId,
        materiaNombre: materia?.nombre || "Sin nombre",
        grado,
      });

      // Limpiar formulario
      setProfesorId("");
      setMateriaId("");
      setGrado("");
    } catch (error) {
      console.error("Error al asignar:", error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, "asignaciones", id));
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAsignar} className="space-y-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          {/* Profesores */}
          <select
            value={profesorId}
            onChange={(e) => setProfesorId(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white w-full"
          >
            <option value="">Seleccionar profesor</option>
            {profesores.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>

          {/* Materias */}
          <select
            value={materiaId}
            onChange={(e) => setMateriaId(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white w-full"
          >
            <option value="">Seleccionar materia</option>
            {materias.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.nombre}
              </option>
            ))}
          </select>

          {/* Grados */}
          <select
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white w-full"
          >
            <option value="">Seleccionar grado</option>
            {grados.map((g) => (
              <option key={g.id} value={g.nombre}>
                Grado {g.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-start gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Asignar
          </button>

          <button
            type="button"
            onClick={fetchAllData}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isRefreshing
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            }`}
          >
            🔄 {isRefreshing ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {asignaciones.map((asig) => (
          <li
            key={asig.id}
            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded flex justify-between items-center"
          >
            <span>
              <strong>{asig.profesorNombre}</strong> — {asig.materiaNombre} (Grado {asig.grado})
            </span>
            <button
              onClick={() => handleEliminar(asig.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
