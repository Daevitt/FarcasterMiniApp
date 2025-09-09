import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todas las tareas
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM tasks;`;
    return NextResponse.json({ tasks: rows });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

// Crear una tarea
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listId, title, description, points } = body;

    const { rows } = await sql`
      INSERT INTO tasks (list_id, title, description, points, created_at)
      VALUES (${listId}, ${title}, ${description}, ${points}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, task: rows[0] });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
