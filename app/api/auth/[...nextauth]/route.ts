import NextAuth from "next-auth"
import OIDCProvider from "next-auth/providers/oidc"

export const { handlers: { GET, POST } } = NextAuth({
  providers: [
    OIDCProvider({
      id: "farcaster",
      name: "Farcaster",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
      wellKnown: "https://app.neynar.com/.well-known/openid-configuration",
      authorization: { params: { scope: "openid offline_access" } },
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
  secret: process.env.NEXTAUTH_SECRET,
})
