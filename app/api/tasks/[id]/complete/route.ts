import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(
  req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { userId } = body;

    const { rows } = await sql`
      INSERT INTO task_completions (task_id, user_id, approved)
      VALUES (${id}, ${userId}, false)
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
