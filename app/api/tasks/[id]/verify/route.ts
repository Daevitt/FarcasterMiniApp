import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();

    // TODO: tu lógica de verificación (Neynar API, etc.)
    // Ejemplo de respuesta de prueba:
    return NextResponse.json({
      verified: false,
      taskId: id,
      received: body,
    });
  } catch (error) {
    console.error("Error en verify:", error);
    return NextResponse.json({ error: "Error verificando acción" }, { status: 500 });
  }
}
