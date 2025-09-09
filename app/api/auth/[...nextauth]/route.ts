import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "farcaster",
      name: "Farcaster",
      type: "oauth",
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
      wellKnown: "https://api.neynar.com/v2/oauth/.well-known/openid-configuration",
      authorization: { params: { scope: "openid offline_access" } },
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.username,
          image: profile.pfp_url,
          fid: profile.fid,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.fid = user.fid
      }
      return token
    },
    async session({ session, token }) {
      if (token?.fid) {
        session.user.fid = token.fid
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
