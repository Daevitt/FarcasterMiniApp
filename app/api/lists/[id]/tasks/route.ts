import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener tareas de una lista específica
export async function GET(req: Request, context: any) {
  const { id } = context.params;

  try {
    const { rows } = await sql`
      SELECT * FROM tasks WHERE list_id = ${id};
    `;
    return NextResponse.json({ tasks: rows });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

// Crear una tarea dentro de la lista
export async function POST(req: Request, context: any) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { title, description, points } = body;

    const { rows } = await sql`
      INSERT INTO tasks (list_id, title, description, points, created_at)
      VALUES (${id}, ${title}, ${description}, ${points}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, task: rows[0] });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
