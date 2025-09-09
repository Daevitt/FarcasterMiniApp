import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(
  req: Request,
  context: { params: Record<string, string> } // <-- 🔑 cambio aquí
) {
  const id = context.params.id;

  try {
    const body = await req.json();
    const { approved } = body;

    const { rows } = await sql`
      UPDATE task_completions
      SET approved = ${approved}, validated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Completion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error validating completion" },
      { status: 500 }
    );
  }
}
