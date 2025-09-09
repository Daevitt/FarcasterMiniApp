import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  _req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    const { rows } = await sql`
      SELECT * FROM tasks WHERE list_id = ${id};
    `;

    return NextResponse.json({ success: true, tasks: rows });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { success: false, error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { description, points } = body;

    const { rows } = await sql`
      INSERT INTO tasks (list_id, description, points)
      VALUES (${id}, ${description}, ${points})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, task: rows[0] });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json(
      { success: false, error: "Error creating task" },
      { status: 500 }
    );
  }
}
