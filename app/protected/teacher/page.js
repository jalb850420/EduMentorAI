'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function ProfesorPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser?.role !== "docente") {
      router.replace("/not-authorized");
    }
  }, [authUser, loading]);

  if (loading || authUser?.role !== "docente") {
    return <p className="text-center mt-10 text-gray-600">Validando acceso...</p>;
  }
  
  return (
    <div className="text-center mt-10">
      <h1>👩‍🎓 Bienvenido, Profesor</h1>
      <LogoutButton />
    </div>
  );
}