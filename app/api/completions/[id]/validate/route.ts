import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
  // 👇 Extraemos los params manualmente
  const { id } = context.params as { id: string };

  try {
    const body = await req.json();

    // Ejemplo: validación de la completion
    return NextResponse.json({
      success: true,
      id,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
