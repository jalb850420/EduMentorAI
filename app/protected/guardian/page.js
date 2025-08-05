// import LogoutButton from "@/components/LogoutButton";

// export default function AcudientePage() {
//   return (
//     <div className="text-center mt-10">
//       <h1>👩‍🎓 Bienvenido, Acudiente</h1>
//       <LogoutButton />
//     </div>
//   );
// }

'use client';
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function AcudientePage() {
  const { authUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar estudiantes vinculados al acudiente
  useEffect(() => {
    if (!authUser) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Supongamos que en "users" los estudiantes tienen un campo "acudienteId" que es el uid del acudiente
        const q = query(collection(db, "users"), where("acudienteId", "==", authUser.uid), where("role", "==", "estudiante"));
        const querySnapshot = await getDocs(q);

        const studentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setStudents(studentsData);
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [authUser]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={authUser?.photoURL}
          alt={`Foto de ${authUser?.name}`}
          className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <h1 className="text-3xl font-bold">👨‍👩‍👧 Bienvenido, {authUser?.name || "Acudiente"}</h1>
      </div>

      {/* Información personal del acudiente */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">📄 Información personal</h2>
        <ul className="text-gray-700 dark:text-gray-200 space-y-2">
          <li><strong>Nombre:</strong> {authUser?.name}</li>
          <li><strong>Email:</strong> {authUser?.email}</li>
        </ul>
      </section>

      {/* Lista de estudiantes vinculados */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">📚 Estudiantes vinculados</h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Cargando estudiantes...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 italic">No hay estudiantes vinculados.</p>
        ) : (
          students.map(student => (
            <div key={student.id} className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{student.name}</h3>
              <p><strong>Grado:</strong> {student.grado || "No asignado"}</p>
              {/* Aquí podrías agregar más detalles, como resumen de materias y logros */}
              <p className="italic text-gray-600 dark:text-gray-400 mt-1">Materias y logros aún no cargados.</p>

              {/* Espacio para plan de mejora */}
              <div className="mt-3">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Plan de mejora</h4>
                <p className="italic text-gray-500 dark:text-gray-400">No disponible aún</p>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Logout */}
      <div className="mt-10 text-center">
        <LogoutButton />
      </div>
    </div>
  );
}
