'use client'
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function ProtectedLayout({ children }) {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [authUser, loading, router]);

  if (loading || !authUser) {
    return <p className="text-center mt-10 text-gray-500">Cargando...</p>;
  }

  return <>{children}</>;
}
