import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, context: { params: any }) {
  try {
    const taskId = context.params.id;
    const body = await req.json();
    const { userId } = body;

    // Guardar la completitud de la tarea en la DB
    const { rows } = await sql`
      INSERT INTO completions (task_id, user_id, completed_at)
      VALUES (${taskId}, ${userId}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ completion: rows[0] });
  } catch (err) {
    console.error("Error completing task:", err);
    return NextResponse.json({ error: "Error completing task" }, { status: 500 });
  }
}
