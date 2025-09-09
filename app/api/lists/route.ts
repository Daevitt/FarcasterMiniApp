import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { fid, title, description, tasks, maxWinners, nftDeliveryType, nftLink, nftLinks, endsAt } = await req.json();

  try {
    const result = await sql`
      INSERT INTO task_lists (owner_fid, title, description, max_winners, nft_delivery_type, nft_link, nft_links, ends_at)
      VALUES (${fid}, ${title}, ${description}, ${maxWinners || 1}, ${nftDeliveryType || 'single'}, ${nftLink}, ${nftLinks ? JSON.stringify(nftLinks) : null}, ${endsAt})
      RETURNING id;
    `;

    const listId = result.rows[0].id;

    if (tasks && tasks.length > 0) {
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        await sql`
          INSERT INTO tasks (list_id, title, description, points, position)
          VALUES (${listId}, ${t.title}, ${t.description}, ${t.points || 1}, ${i});
        `;
      }
    }

    return NextResponse.json({ ok: true, listId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT l.*, u.username, u.display_name, u.pfp_url
      FROM task_lists l
      JOIN users u ON u.fid = l.owner_fid
      WHERE l.is_public = true AND l.is_visible = true
        AND (l.ends_at IS NULL OR l.ends_at > now())
      ORDER BY l.created_at DESC
      LIMIT 20;
    `;
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
