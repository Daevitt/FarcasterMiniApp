import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: Request, context: { params: any }) {
  try {
    const listId = context.params.id;

    const { rows } = await sql`
      SELECT * FROM tasks WHERE list_id = ${listId};
    `;

    return NextResponse.json({ tasks: rows });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: any }) {
  try {
    const listId = context.params.id;
    const body = await req.json();

    const { rows } = await sql`
      INSERT INTO tasks (list_id, title, points)
      VALUES (${listId}, ${body.title}, ${body.points})
      RETURNING *;
    `;

    return NextResponse.json({ task: rows[0] });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
