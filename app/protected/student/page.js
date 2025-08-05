// import LogoutButton from "@/components/LogoutButton";

// export default function EstudiantePage() {
//   return (
//     <div className="text-center mt-10">
//       <h1>👩‍🎓 Bienvenido, Estudiante</h1>
//       <LogoutButton />
//     </div>
//   );
// }

'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function EstudiantePage() {
  // const { authUser } = useAuth();
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser?.role !== "estudiante") {
      router.replace("/not-authorized");
    }
  }, [authUser, loading]);

  if (loading || authUser?.role !== "estudiante") {
    return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={authUser?.photoURL}
          alt={`Foto de ${authUser?.name}`}
          className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <h1 className="text-3xl font-bold">
          🎓 Bienvenido, {authUser?.name || "Estudiante"}
        </h1>
      </div>

      {/* Contenedor con dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Columna izquierda */}
        <div className="space-y-8">
          {/* Información personal */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">📄 Información personal</h2>
            <ul className="text-gray-700 dark:text-gray-200 space-y-2">
              <li><strong>Nombre:</strong> {authUser?.name}</li>
              <li><strong>Email:</strong> {authUser?.email}</li>
              <li><strong>Grado:</strong> {authUser?.grado || "No asignado"}</li>
            </ul>
          </section>

          {/* Acudiente */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">👨‍👩‍👧 Acudiente</h2>
            <p className="text-gray-600 dark:text-gray-300 italic">
              Aún no se ha asignado un acudiente. Este se mostrará aquí cuando esté disponible.
            </p>
          </section>

          {/* Profesores asignados */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">👩‍🏫 Profesores asignados</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>Profesor de Matemáticas: <span className="italic text-gray-500">por asignar</span></li>
              <li>Profesor de Lengua Castellana: <span className="italic text-gray-500">por asignar</span></li>
              <li>Profesor de Ciencias Naturales: <span className="italic text-gray-500">por asignar</span></li>
            </ul>
          </section>
        </div>

        {/* Columna derecha */}
        <div className="space-y-8">
          {/* Materias, logros y plan de mejora combinados por periodo */}
          {[1, 2, 3, 4].map((periodo) => (
            <section
              key={periodo}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                📆 Periodo {periodo}
              </h2>

              {/* Materias y logros */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                  📚 Materias y logros
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Aquí verás los logros que debes alcanzar en cada materia, por cada periodo del año.
                </p>
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Sin logros cargados aún.
                </p>
              </div>

              {/* Plan de mejora */}
              <div>
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
                  🛠️ Plan de mejora
                </h3>
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Aún no se ha generado un plan de mejora para este periodo.
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Botón logout */}
      <div className="mt-10 text-center">
        <LogoutButton />
      </div>
    </div>
  );
}
