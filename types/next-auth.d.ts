import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      fid?: number
    }
  }

  interface Profile {
    fid?: number
    display_name?: string
    pfp_url?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    fid?: number
  }
}
