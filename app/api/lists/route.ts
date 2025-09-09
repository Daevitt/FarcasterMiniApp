import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { creatorFid, title, description, durationDays, nftUrl, points } = body;

    const { rows } = await sql`
      INSERT INTO task_lists (creator_fid, title, description, duration_days, nft_url, points)
      VALUES (${creatorFid}, ${title}, ${description}, ${durationDays}, ${nftUrl}, ${points})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, list: rows[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Error creating list" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM task_lists ORDER BY created_at DESC`;
    return NextResponse.json({ success: true, lists: rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Error fetching lists" }, { status: 500 });
  }
}
