import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Marcar una tarea como completada
export async function POST(req: Request, context: any) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { userId } = body;

    const { rows } = await sql`
      INSERT INTO task_completions (task_id, user_id, completed_at)
      VALUES (${id}, ${userId}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error completing task:", err);
    return NextResponse.json(
      { success: false, error: "Error completing task" },
      { status: 500 }
    );
  }
}
