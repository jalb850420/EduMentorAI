'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AsignacionesDelProfesor() {
  const { authUser } = useAuth();
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!authUser) return;

      try {
        const q = query(
          collection(db, "asignaciones"),
          where("profesorId", "==", authUser.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAsignaciones(data);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaciones();
  }, [authUser]);

  if (loading) return <p className="text-center">Cargando asignaciones...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📘 Mis asignaciones</h2>
      
      {asignaciones.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 italic">No tienes asignaciones aún.</p>
      ) : (
        <ul className="space-y-3">
          {asignaciones.map((asig) => (
            <li
              key={asig.id}
              className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded"
            >
              <strong>{asig.materiaNombre}</strong> — Grado {asig.grado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
