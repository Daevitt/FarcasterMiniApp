import { sdk } from '@farcaster/miniapp-sdk'

export { sdk }

// Tipos útiles para el SDK
export interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

export interface SignInResult {
  isAuthenticated: boolean
  user?: FarcasterUser
  error?: string
}

// Función helper para hacer sign in
export async function signInWithFarcaster(): Promise<SignInResult> {
  try {
    const result = await sdk.actions.signIn({
      nonce: generateNonce(),
      acceptAuthAddress: true
    })

    if (result.success) {
      return {
        isAuthenticated: true,
        user: {
          fid: result.fid,
          username: result.username,
          displayName: result.displayName,
          pfpUrl: result.pfpUrl
        }
      }
    } else {
      return {
        isAuthenticated: false,
        error: 'Sign in failed'
      }
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Generar nonce único para sign in
function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Función para marcar la app como lista
export async function markAppAsReady() {
  try {
    await sdk.actions.ready()
  } catch (error) {
    console.error('Error marking app as ready:', error)
  }
}