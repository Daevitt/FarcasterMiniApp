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
    const context = await sdk.context;

if (context?.user) {
  return {
    isAuthenticated: true,
    user: {
      fid: context.user.fid,
      username: context.user.username,
      displayName: context.user.displayName,
      pfpUrl: context.user.pfpUrl,
    },
  };
}
    // Si no está autenticado, solicitar sign in
    const result = await sdk.actions.signIn({})

    if (result && result.fid) {
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

// Función para marcar la app como lista
export async function markAppAsReady() {
  try {
    await sdk.actions.ready()
  } catch (error) {
    console.error('Error marking app as ready:', error)
  }
}



