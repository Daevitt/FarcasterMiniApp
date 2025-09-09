import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, context: { params: any }) {
  try {
    const id = context.params.id;

    const { rows } = await sql`
      UPDATE completions
      SET validated = true
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error validating completion:", err);
    return NextResponse.json({ error: "Error validating completion" }, { status: 500 });
  }
}
