// app/api/tasks/[id]/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_BASE = process.env.NEYNAR_BASE_URL ?? 'https://api.neynar.com/v2/farcaster';
const NEYNAR_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_KEY) {
  console.warn('NEYNAR_API_KEY no definido — la verificación fallará si se requiere Neynar');
}

type VerifyBody = {
  actorFid: number;
  taskType: 'follow' | 'recast' | 'reply' | 'keyword';
  target: string;
};

export async function POST(req: NextRequest) {
  try {
    // Extraer el ID del pathname: /api/tasks/[id]/verify
    const segments = req.nextUrl.pathname.split('/');
    const id = segments.at(-2); // penúltimo segmento es el [id]

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing task id in URL' }, { status: 400 });
    }

    const body: VerifyBody = await req.json();

    if (!body || !body.actorFid || !body.taskType || !body.target) {
      return NextResponse.json({ ok: false, error: 'Missing actorFid / taskType / target' }, { status: 400 });
    }

    // Fetch Task de DB
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ ok: false, error: 'Task not found' }, { status: 404 });
    }

    let verified = false;
    let reason = '';

    if (!NEYNAR_KEY) {
      reason = 'Neynar API key not configured - verification cannot run';
      return NextResponse.json({ ok: true, verified: false, reason });
    }

    const headers = {
      'x-api-key': NEYNAR_KEY,
      'Content-Type': 'application/json'
    };

    // --- follow ---
    if (body.taskType === 'follow') {
      const targetFid = Number(body.target);
      if (Number.isNaN(targetFid)) {
        return NextResponse.json({ ok: false, error: 'Invalid target fid for follow' }, { status: 400 });
      }

      const url = `${NEYNAR_BASE}/user?fid=${targetFid}&viewer_fid=${body.actorFid}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        verified = !!(data?.user?.viewer_context?.following);
        reason = verified ? 'actor follows target' : 'actor does not follow target';
      }
    }

    // --- recast ---
    else if (body.taskType === 'recast') {
      const url = `${NEYNAR_BASE}/reactions?fid=${body.actorFid}&cast_hash=${encodeURIComponent(body.target)}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const reactions = data?.reactions ?? data?.items ?? [];
        verified = Array.isArray(reactions) && reactions.some((r: any) => r?.type === 'recast' || r?.reaction === 'recast');
        reason = verified ? 'recast found' : 'no recast found';
      }
    }

    // --- keyword ---
    else if (body.taskType === 'keyword') {
      const keyword = body.target.toLowerCase();
      const url = `${NEYNAR_BASE}/feed?fid=${body.actorFid}&limit=50`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const casts = data?.casts ?? data?.items ?? data?.feed ?? [];
        verified = Array.isArray(casts) && casts.some((c: any) => {
          const text = (c?.text ?? c?.body ?? '').toString().toLowerCase();
          return text.includes(keyword);
        });
        reason = verified ? 'keyword present in recent cast' : 'keyword not found';
      }
    }

    // --- reply ---
    else if (body.taskType === 'reply') {
      const url = `${NEYNAR_BASE}/feed?fid=${body.actorFid}&limit=50`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const casts = data?.casts ?? data?.items ?? [];
        verified = Array.isArray(casts) && casts.some((c: any) => {
          return (c?.parent_hash === body.target) || (c?.parent?.hash === body.target);
        });
        reason = verified ? 'reply found' : 'reply not found';
      }
    }

    // --- si verified, actualizar DB ---
    if (verified) {
      const list = await prisma.list.findUnique({ where: { id: task.listId } });
      if (list) {
        let participant = await prisma.participation.findFirst({
          where: { user: { fid: body.actorFid }, listId: list.id },
          include: { user: true }
        });

        let user = await prisma.user.findUnique({ where: { fid: body.actorFid } as any });
        if (!user) {
          user = await prisma.user.create({
            data: { fid: body.actorFid, username: `fid-${body.actorFid}` }
          });
        }

        if (!participant) {
          participant = await prisma.participation.create({
            data: { userId: user.id, listId: list.id, score: task.points ?? 0 }
          });
        } else {
          participant = await prisma.participation.update({
            where: { id: participant.id },
            data: { score: participant.score + (task.points ?? 0) }
          });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { points: { increment: task.points ?? 0 } }
        });
      }
    }

    return NextResponse.json({ ok: true, verified, reason });
  } catch (error) {
    console.error('Error in verify route', error);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
