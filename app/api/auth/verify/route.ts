// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // body debería contener { message, signature, nonce, fid }
    const { message, signature, nonce, fid } = body;

    if (!message || !signature || !fid) {
      return NextResponse.json({ ok: false, error: "Missing message/signature/fid" }, { status: 400 });
    }

    // En una implementación real, aquí verificarías la firma criptográfica
    // Por ahora, asumimos que la verificación pasó (para desarrollo)
    console.log("Verifying signature for FID:", fid);

    // Simular verificación exitosa
    const user = {
      fid: Number(fid),
      username: `fid_${fid}`,
      displayName: `User ${fid}`,
      pfpUrl: null,
    };

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("auth/verify error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
