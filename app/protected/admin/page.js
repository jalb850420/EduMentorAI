// import LogoutButton from "@/components/LogoutButton";

// export default function AdminPage() {
//   return (
//     <div className="text-center mt-10">
//       <h1>👩‍🎓 Bienvenido, Administrador</h1>
//       <LogoutButton />
//     </div>
//   );
// }


// 'use client';
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import LogoutButton from "@/components/LogoutButton";

// export default function AdminPage() {
//   const { authUser, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && authUser?.role !== "admin") {
//       router.replace("/not-authorized");
//     }
//   }, [authUser, loading]);

//   if (loading || authUser?.role !== "admin") {
//     return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
//   }

//   return (
//     <div className="text-center mt-10">
//       <h1>👩‍🎓 Bienvenido, Administrador</h1>
//       <LogoutButton />
//     </div>
//   );
// }


'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import GradoManager from "@/components/admin/GradoManager";
import MateriaManager from "@/components/MateriaManager";
import AsignacionesManager from "@/components/AsignacionesManager";

export default function AdminPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser?.role !== "admin") {
      router.replace("/not-authorized");
    }
  }, [authUser, loading]);

  if (loading || authUser?.role !== "admin") {
    return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          🛠️ Panel del Administrador
        </h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gestión de Grados */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">🎓 Grados</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Crea y administra los grados escolares.
          </p>
          <GradoManager />
        </section>

        {/* Gestión de Materias */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">📚 Materias</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Agrega y edita las materias que se imparten.
          </p>
          {/* Aquí vendrá el formulario y lista de materias */}

            {/* <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">📘 Gestión de Materias</h1> */}
            <MateriaManager />

        </section>

        {/* Asignación de Materias a Docentes */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">👨‍🏫 Asignaciones</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Asigna materias a profesores por grado.
          </p>
          {/* Aquí vendrá la lógica de asignación */}
          <AsignacionesManager />
        </section>
      </div>
    </div>
  );
}
