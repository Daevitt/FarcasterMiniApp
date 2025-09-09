import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todos los usuarios
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM users;`;
    return NextResponse.json({ users: rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// Crear un usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { farcasterId, username, displayName } = body;

    const { rows } = await sql`
      INSERT INTO users (farcaster_id, username, display_name, created_at)
      VALUES (${farcasterId}, ${username}, ${displayName}, NOW())
      ON CONFLICT (farcaster_id) DO UPDATE SET username = ${username}, display_name = ${displayName}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
