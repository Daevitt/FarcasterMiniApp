import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todas las listas
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM lists;`;
    return NextResponse.json({ lists: rows });
  } catch (err) {
    console.error("Error fetching lists:", err);
    return NextResponse.json({ error: "Error fetching lists" }, { status: 500 });
  }
}

// Crear una nueva lista
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, userId } = body;

    const { rows } = await sql`
      INSERT INTO lists (name, description, user_id, created_at)
      VALUES (${name}, ${description}, ${userId}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, list: rows[0] });
  } catch (err) {
    console.error("Error creating list:", err);
    return NextResponse.json({ error: "Error creating list" }, { status: 500 });
  }
}
