'use client';
import { auth } from "@/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createUserIfNotExists } from "@/userService";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account', // 👈 fuerza mostrar la selección de cuenta
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUserIfNotExists(user); // Crea al usuario si no existe en Firestore
      router.push("/");
    } catch (err) {
      console.error("Error en login con Google:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
