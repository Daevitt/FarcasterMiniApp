import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Validar una completion
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`
      UPDATE completions
      SET validated = true
      WHERE id = ${params.id}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, completion: rows[0] });
  } catch (err) {
    console.error("Error validating completion:", err);
    return NextResponse.json({ error: "Error validating completion" }, { status: 500 });
  }
}
