import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  try {
    // Next.js provee los params en context.params
    const { id } = context.params as { id: string };

    // Body de la request
    const body = await req.json();

    // TODO: lógica real de verificación con Neynar API
    return NextResponse.json({
      ok: true,
      taskId: id,
      receivedBody: body,
    });
  } catch (error) {
    console.error("Error en /api/tasks/[id]/verify:", error);
    return NextResponse.json(
      { error: "Error interno verificando tarea" },
      { status: 500 }
    );
  }
}
