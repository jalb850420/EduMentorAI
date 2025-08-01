'use client';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser) {
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
          router.push("/login");
      }
    }
  }, [authUser, loading]);

  return (
    <div className="text-center mt-10">
      <p className="text-gray-600">Redireccionando...</p>
    </div>
  );
}
