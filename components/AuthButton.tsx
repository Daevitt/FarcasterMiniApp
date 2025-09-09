'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex items-center space-x-2">
        <img
          src={session.user.image || "/default-avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm">FID: {session.user.fid}</span>
        <button
          onClick={() => signOut()}
          className="ml-2 px-3 py-1 text-sm bg-gray-200 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("farcaster")}
      className="px-4 py-2 bg-purple-600 text-white rounded"
    >
      Iniciar sesión con Farcaster
    </button>
  )
}
