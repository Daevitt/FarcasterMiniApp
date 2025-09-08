'use client'

import { sdk } from "@farcaster/miniapp-sdk"

export interface SignInResult {
  isAuthenticated: boolean
  user?: {
    fid: number
    username: string
    displayName: string
    pfpUrl: string
  }
}

export async function signInWithFarcaster(): Promise<SignInResult> {
  try {
    // 1. Revisar si ya hay contexto (usuario logeado)
    const context = await sdk.context
    if (context?.user) {
      return {
        isAuthenticated: true,
        user: {
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl,
        },
      }
    }

    // 2. Si no hay usuario → forzar signIn con nonce obligatorio
    const nonce = crypto.randomUUID()
    const result = await sdk.actions.signIn({ nonce })

    if (result?.fid) {
      return {
        isAuthenticated: true,
        user: {
          fid: result.fid,
          username: result.username,
          displayName: result.displayName,
          pfpUrl: result.pfpUrl,
        },
      }
    }

    return { isAuthenticated: false }
  } catch (error) {
    console.error("Error signing in with Farcaster:", error)
    return { isAuthenticated: false }
  }
}

export async function markAppAsReady() {
  try {
    await sdk.actions.ready()
  } catch (err) {
    console.error("Error marking app as ready:", err)
  }
}
