import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Aquí recoges el id de la URL dinámica
    const { id } = context.params;

    // Aquí recoges el body de la request
    const body = await req.json();

    // 🔹 TODO: lógica real de verificación con Neynar API
    // por ahora devolvemos respuesta de prueba
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
