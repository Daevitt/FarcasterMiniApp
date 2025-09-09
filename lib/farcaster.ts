// lib/farcaster.ts
import { sdk } from "@farcaster/miniapp-sdk";

export type SignInResult = {
  message: string;
  signature: string;
  // cualquier otro campo que el sdk retorne
};

// Intenta obtener context.user si el frame ya lo provee.
// Si no, solicita signIn al frame (Sign-in with Farcaster) y devuelve el objeto con message+signature
export async function requestSignIn(): Promise<SignInResult | null> {
  try {
    // Si el Frame ya entrega contexto de usuario:
    const context = (sdk as any)?.context;
    if (context?.user) {
      // Frameworks/Frames pueden exponer el contexto; devolvemos un objeto reducido para el backend si es necesario.
      return {
        message: JSON.stringify({ fid: context.user.fid, username: context.user.username }),
        signature: "", // no hay signature porque es contexto ya firmado por Frame
      };
    }

    // Si no hay contexto, solicitamos sign-in via sdk.actions.signIn
    // Generamos nonce (servidor validará la nonce más tarde)
    const nonce = crypto?.randomUUID?.() ?? String(Date.now());
    // Llamada al SDK para pedir credencial SIWF
    const res = await (sdk as any).actions.signIn({ nonce });
    // res normalmente contiene message + signature (depende de la versión del SDK)
    return {
      message: res.message || res.siwe || "",
      signature: res.signature || res.sig || "",
    };
  } catch (err) {
    console.error("requestSignIn error:", err);
    return null;
  }
}
