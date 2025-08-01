'use client';
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";

export default function ProfilePage() {
  const { authUser, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-semibold mb-4">👤 Perfil del Usuario</h2>
      <p><strong>Nombre:</strong> {authUser.name}</p>
      <p><strong>Correo:</strong> {authUser.email}</p>
      <p><strong>Rol:</strong> {authUser.role}</p>
      <LogoutButton />
    </div>
  );
}
