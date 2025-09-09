import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "neynar",
      name: "Neynar",
      type: "oidc",
      wellKnown: "https://api.neynar.com/.well-known/openid-configuration",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name || profile.display_name,
          email: profile.email,
          image: profile.picture || profile.pfp_url,
          fid: profile.fid
        }
      }
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, profile }: any) {
      if (profile?.fid) {
        token.fid = profile.fid
      }
      return token
    },
    session({ session, token }: any) {
      if (token.fid) {
        session.user.fid = token.fid as number
      }
      return session
    }
  }
})
