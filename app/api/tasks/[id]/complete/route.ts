import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Marcar una tarea como completada por un usuario
export async function POST(req: Request, context: any) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { userId } = body;

    const { rows } = await sql`
      INSERT INTO completions (task_id, user_id, completed_at, validated)
      VALUES (${id}, ${userId}, NOW(), false)
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error completing task:", err);
    return NextResponse.json({ error: "Error completing task" }, { status: 500 });
  }
}
