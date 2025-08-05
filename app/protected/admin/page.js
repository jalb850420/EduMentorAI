// import LogoutButton from "@/components/LogoutButton";

// export default function AdminPage() {
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
    <div className="text-center mt-10">
      <h1>👩‍🎓 Bienvenido, Administrador</h1>
      <LogoutButton />
    </div>
  );
}
