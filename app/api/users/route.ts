import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
  const { fid, username, displayName, pfpUrl } = await req.json();

  try {
    await sql`
      INSERT INTO users (fid, username, display_name, pfp_url)
      VALUES (${fid}, ${username}, ${displayName}, ${pfpUrl})
      ON CONFLICT (fid) DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        pfp_url = EXCLUDED.pfp_url;
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
