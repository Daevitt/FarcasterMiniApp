import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  _req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    const { rows } = await sql`
      SELECT * FROM task_lists WHERE id = ${id};
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, list: rows[0] });
  } catch (err) {
    console.error("Error fetching list:", err);
    return NextResponse.json(
      { success: false, error: "Error fetching list" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    await sql`DELETE FROM task_lists WHERE id = ${id};`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting list:", err);
    return NextResponse.json(
      { success: false, error: "Error deleting list" },
      { status: 500 }
    );
  }
}
