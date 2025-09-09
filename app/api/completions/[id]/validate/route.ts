import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Validar una completion de tarea
export async function POST(req: Request, context: any) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { userId, validated } = body;

    await sql`
      UPDATE completions
      SET validated = ${validated}, validated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId};
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error validating completion:", err);
    return NextResponse.json({ error: "Error validating completion" }, { status: 500 });
  }
}
