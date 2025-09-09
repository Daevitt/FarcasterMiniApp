// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAppClient } from "@farcaster/auth-client"; // server-side verifySignInMessage
// createAppClient factory (si la versión exige appClient)
const appClient = createAppClient();

// Nota: según la versión del paquete puede variar el import. Ajusta si tu versión expone createAppClient o verifySignInMessage directamente.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // body debería contener { message, signature, nonce? }
    const { message, signature, nonce } = body;

    if (!message || !signature) {
      return NextResponse.json({ ok: false, error: "Missing message/signature" }, { status: 400 });
    }

    // Verificamos la firma con la auth-client
    const domain = req.headers.get("host") || process.env.NEXT_PUBLIC_APP_URL || "localhost";
    // Llama verifySignInMessage
    const resp = await appClient.verifySignInMessage({
      domain,
      nonce: nonce || "",
      message,
      signature,
    });

    if (!resp || !resp.success) {
      console.warn("verifySignInMessage failed:", resp);
      return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 401 });
    }

    // resp contains fid and parsed data
    const fid = resp.fid;
    const parsed = resp.data;

    // Aquí generas tu sesión (JWT) o guardas/creas usuario en DB.
    // Para demo, devolvemos user básico:
    const user = {
      fid,
      username: parsed?.address || parsed?.username || `fid_${fid}`,
      displayName: parsed?.displayName || "",
      // pfpUrl: -- si lo obtienes aparte
    };

    // Si usas DB: upsert user -> issue session cookie/jwt.
    // >>> En este ejemplo simple devolvemos JSON para frontend.
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("auth/verify error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
