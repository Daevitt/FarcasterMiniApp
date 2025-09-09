import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todas las completions
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM completions;`;
    return NextResponse.json({ completions: rows });
  } catch (err) {
    console.error("Error fetching completions:", err);
    return NextResponse.json({ error: "Error fetching completions" }, { status: 500 });
  }
}

// Crear una completion
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, userId } = body;

    const { rows } = await sql`
      INSERT INTO completions (task_id, user_id, completed_at, validated)
      VALUES (${taskId}, ${userId}, NOW(), false)
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error creating completion:", err);
    return NextResponse.json({ error: "Error creating completion" }, { status: 500 });
  }
}
