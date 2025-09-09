import NextAuth, { NextAuthConfig } from "next-auth"

const authConfig: NextAuthConfig = {
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
}

const handler = NextAuth(authConfig)

export async function GET(req: Request, ctx: any) {
  return handler(req, ctx)
}

export async function POST(req: Request, ctx: any) {
  return handler(req, ctx)
}
