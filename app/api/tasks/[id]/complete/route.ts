import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { userFid, proof } = body;

    // Guardar la completion de la tarea
    const { rows } = await sql`
      INSERT INTO task_completions (task_id, user_fid, proof)
      VALUES (${id}, ${userFid}, ${proof})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error completing task" }, { status: 500 });
  }
}
