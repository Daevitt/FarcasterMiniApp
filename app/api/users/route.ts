import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fid, username, displayName, pfpUrl } = body;

    await sql`
      INSERT INTO users (fid, username, display_name, pfp_url)
      VALUES (${fid}, ${username}, ${displayName}, ${pfpUrl})
      ON CONFLICT (fid) DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        pfp_url = EXCLUDED.pfp_url;
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Error saving user" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM users`;
    return NextResponse.json({ success: true, users: rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Error fetching users" }, { status: 500 });
  }
}
