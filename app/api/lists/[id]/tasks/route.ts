import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener tareas de una lista
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`SELECT * FROM tasks WHERE list_id = ${params.id};`;
    return NextResponse.json({ tasks: rows });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

// Crear tarea en una lista
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { description, points } = body;

    const { rows } = await sql`
      INSERT INTO tasks (list_id, description, points, created_at)
      VALUES (${params.id}, ${description}, ${points}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, task: rows[0] });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
