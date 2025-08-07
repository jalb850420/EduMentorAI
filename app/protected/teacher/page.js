// 'use client';
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import LogoutButton from "@/components/LogoutButton";

// export default function ProfesorPage() {
//   const { authUser, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && authUser?.role !== "docente") {
//       router.replace("/not-authorized");
//     }
//   }, [authUser, loading]);

//   if (loading || authUser?.role !== "docente") {
//     return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
//   }
  
//   return (
//     <div className="text-center mt-10">
//       <h1>👩‍🎓 Bienvenido, Profesor</h1>
//       <LogoutButton />
//     </div>
//   );
// }

'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import LogoutButton from "@/components/LogoutButton";

export default function ProfesorPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);

  useEffect(() => {
    if (!loading && authUser?.role !== "docente") {
      router.replace("/not-authorized");
    }
  }, [authUser, loading]);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!authUser) return;

      try {
        const q = query(
          collection(db, "asignaciones"),
          where("profesorId", "==", authUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setAsignaciones(data);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      } finally {
        setLoadingAsignaciones(false);
      }
    };

    fetchAsignaciones();
  }, [authUser]);

  if (loading || authUser?.role !== "docente") {
    return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
  }

  // Extraer materias únicas
  const materias = [...new Set(asignaciones.map((a) => a.materiaNombre))];
  const grados = [...new Set(asignaciones.map((a) => a.grado))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={authUser?.photoURL}
          alt={`Foto de ${authUser?.name}`}
          className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          👨‍🏫 Bienvenido, {authUser?.name || "Profesor"}
        </h1>
      </div>

      {/* Información personal */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">📄 Información personal</h2>
        <ul className="text-gray-700 dark:text-gray-200 space-y-2">
          <li><strong>Nombre:</strong> {authUser?.name}</li>
          <li><strong>Email:</strong> {authUser?.email}</li>
          <li><strong>Rol:</strong> {authUser?.role}</li>
        </ul>
      </section>

      {/* Materias asignadas */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">📚 Materias asignadas</h2>
        {loadingAsignaciones ? (
          <p className="text-gray-500 dark:text-gray-400">Cargando materias...</p>
        ) : materias.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 italic">No tienes materias asignadas.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
            {materias.map((materia, idx) => (
              <li key={idx}>{materia}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Grados y grupos */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">🏫 Grados y grupos</h2>
        {loadingAsignaciones ? (
          <p className="text-gray-500 dark:text-gray-400">Cargando grados...</p>
        ) : grados.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 italic">No tienes grados asignados.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
            {grados.map((grado, idx) => (
              <li key={idx}>Grado {grado}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Logros por materia y grado */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">🏆 Logros académicos</h2>
        <p className="text-gray-500 dark:text-gray-400 italic mb-2">
          Los logros serán visibles una vez se asocien materias y grados.
        </p>
      </section>

      {/* Registro de notas */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">✍️ Registro de notas</h2>
        {[1, 2, 3, 4].map((periodo) => (
          <div key={periodo} className="mb-4 border-t pt-4">
            <h3 className="text-md font-bold text-blue-600 dark:text-blue-400 mb-2">📆 Periodo {periodo}</h3>
            <p className="text-gray-500 dark:text-gray-400 italic">
              Aquí podrás cargar o consultar las notas de tus estudiantes.
            </p>
          </div>
        ))}
      </section>

      <div className="text-center">
        <LogoutButton />
      </div>
    </div>
  );
}
