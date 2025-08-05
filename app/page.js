'use client'; 
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Home() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authUser) {
        const allowedRoles = ["admin", "docente", "estudiante", "acudiente"];

        if (!allowedRoles.includes(authUser.role)) {
          // signOut(auth).then(() => {
          //   // router.push("/login?error=rol_invalido");
          //   router.replace("/login?error=rol_invalido");
          // });
          signOut(auth).then(() => {
            setTimeout(() => {
              router.replace("/login?error=rol_invalido");
            }, 100); // 100ms de delay para asegurar que se cargue bien
          });
          return;
        }

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
      } else {
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
