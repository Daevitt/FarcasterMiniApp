'use client'
import React from "react";
import { useAuthStore } from "@/lib/store";
import { requestSignIn } from "@/lib/farcaster";

export default function LoginButton() {
  const login = useAuthStore((s) => s.login);
  const setLoading = useAuthStore((s) => s.setLoading);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const sign = await requestSignIn();
      if (!sign) {
        alert("No se pudo iniciar sign-in.");
        setLoading(false);
        return;
      }

      // Enviar al servidor para verificar y crear sesión
      const resp = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sign),
      });

      const json = await resp.json();
      if (json?.ok && json.user) {
        login(json.user);
      } else {
        console.error("Auth verify failed:", json);
        alert("No se pudo verificar el login.");
      }
    } catch (err) {
      console.error(err);
      alert("Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
    >
      Iniciar sesión con Farcaster
    </button>
  );
}
