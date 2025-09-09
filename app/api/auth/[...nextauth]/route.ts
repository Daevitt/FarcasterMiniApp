import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "neynar",
      name: "Neynar",
      type: "oidc", // aquí indicamos que es OpenID Connect
      wellKnown: "https://api.neynar.com/.well-known/openid-configuration",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
