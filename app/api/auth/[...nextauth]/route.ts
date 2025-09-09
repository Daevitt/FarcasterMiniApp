import NextAuth from "next-auth"

const authHandler = NextAuth({
  providers: [
    {
      id: "neynar",
      name: "Neynar",
      type: "oidc",
      wellKnown: "https://api.neynar.com/.well-known/openid-configuration",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
})

export { authHandler as GET, authHandler as POST }
