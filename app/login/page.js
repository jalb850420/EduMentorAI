'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserIfNotExists } from "@/userService";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   const error = searchParams.get("error");
  //   if (error === "rol_invalido") {
  //     setErrorMessage("Acceso denegado: el rol no es válido.");
  //   }
  // }, [searchParams]);


  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "rol_invalido") {
      setErrorMessage("Acceso denegado: el rol no es válido.");
    }
    setIsReady(true); // ⚠️ solo renderiza cuando ya está lista la URL
  }, [searchParams]);


  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await createUserIfNotExists(result.user);
      router.push("/");
    } catch (err) {
      console.error("Error en login con Google:", err);
    }
  };

  const closeError = () => {
    setErrorMessage("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("error");
    router.replace(`/login?${newParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!isReady ? (
        <p className="text-gray-600">Cargando...</p> // 👈 evita parpadeo mostrando loader
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">¡Error!</strong>
              <span className="block ml-1">{errorMessage}</span>
              <button
                onClick={closeError}
                className="absolute top-2 right-2 text-red-700 hover:text-red-900 font-bold text-xl"
                aria-label="Cerrar mensaje"
              >
                ×
              </button>
            </div>
          )}
  
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Iniciar sesión con Google
          </button>
        </>
      )}
    </div>
  );
  
}
