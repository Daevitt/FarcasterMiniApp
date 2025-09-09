'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Cargando...</div>
  }

  if (session?.user) {
    return (
      <div className="flex items-center space-x-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{session.user.name}</span>
          {session.user.fid && (
            <span className="text-xs text-gray-500">FID: {session.user.fid}</span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("neynar")}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
    >
      Iniciar sesión con Farcaster
    </button>
  )
}
