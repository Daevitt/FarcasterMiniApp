// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import OIDCProvider from "@auth/oidc-provider"

// Configuración
const authConfig: NextAuthConfig = {
  providers: [
    OIDCProvider({
      id: "farcaster",
      name: "Farcaster",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
      wellKnown: "https://identity.farcaster.xyz/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          image: profile.picture,
          fid: profile.fid,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        (session as any).fid = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
}

// Exportar los handlers GET y POST
export const { handlers: { GET, POST } } = NextAuth(authConfig)
