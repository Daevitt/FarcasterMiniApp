'use client'

import { useSession } from "next-auth/react"
import AuthButton from "@/components/AuthButton"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="p-4">
      <AuthButton />

      {session?.user ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">
            Bienvenido {session.user.name}
          </h2>
          <p>FID: {session.user.fid}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No has iniciado sesión</p>
      )}
    </div>
  )
}
