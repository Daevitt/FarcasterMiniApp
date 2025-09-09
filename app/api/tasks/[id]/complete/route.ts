import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Marcar tarea como completada
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { userId } = body;

    const { rows } = await sql`
      INSERT INTO completions (task_id, user_id, validated, created_at)
      VALUES (${params.id}, ${userId}, false, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error completing task:", err);
    return NextResponse.json({ error: "Error completing task" }, { status: 500 });
  }
}
