'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotAuthorizedPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [redirectLabel, setRedirectLabel] = useState("Redireccionar");

  useEffect(() => {
    if (!loading) {
      if (authUser) {
        switch (authUser.role) {
          case "admin":
            setRedirectLabel("Volver al panel de Administrador");
            break;
          case "docente":
            setRedirectLabel("Volver al panel de Docente");
            break;
          case "estudiante":
            setRedirectLabel("Volver al panel de Estudiante");
            break;
          case "acudiente":
            setRedirectLabel("Volver al panel de Acudiente");
            break;
          default:
            setRedirectLabel("Ir al inicio");
        }
      } else {
        setRedirectLabel("Ir al inicio de sesión");
      }
    }
  }, [authUser, loading]);

  const handleRedirect = () => {
    if (!authUser) {
      router.push("/login");
    } else {
      switch (authUser.role) {
        case "admin":
          router.push("/protected/admin");
          break;
        case "docente":
          router.push("/protected/teacher");
          break;
        case "estudiante":
          router.push("/protected/student");
          break;
        case "acudiente":
          router.push("/protected/guardian");
          break;
        default:
          router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-red-600 mb-4">⛔ Acceso denegado</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        No tienes permisos para acceder a esta página.
      </p>
      <button
        onClick={handleRedirect}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {redirectLabel}
      </button>
    </div>
  );
}
