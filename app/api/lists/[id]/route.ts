import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params as { id: string };
  try {
    const { rows } = await sql`SELECT * FROM task_lists WHERE id = ${id}`;
    return NextResponse.json({ success: true, list: rows[0] });
  } catch {
    return NextResponse.json({ success: false, error: "Error fetching list" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { id } = context.params as { id: string };
  try {
    await sql`DELETE FROM task_lists WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Error deleting list" }, { status: 500 });
  }
}
