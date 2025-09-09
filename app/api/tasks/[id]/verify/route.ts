// app/api/tasks/[id]/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_BASE = process.env.NEYNAR_BASE_URL ?? 'https://api.neynar.com/v2/farcaster';
const NEYNAR_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_KEY) {
  console.warn('NEYNAR_API_KEY no definido — la verificación fallará si se requiere Neynar');
}

type VerifyBody = {
  actorFid: number;     // quien afirma haber completado la acción (el visitante)
  taskType: 'follow' | 'recast' | 'reply' | 'keyword';
  target: string;       // dependiendo tipo: target fid (follow), castHash (recast), keyword text (keyword)
};

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body: VerifyBody = await req.json();

    if (!body || !body.actorFid || !body.taskType || !body.target) {
      return NextResponse.json({ ok: false, error: 'Missing actorFid / taskType / target' }, { status: 400 });
    }

    // Fetch the Task from DB (optional validation)
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ ok: false, error: 'Task not found' }, { status: 404 });
    }

    // Decide test by taskType
    let verified = false;
    let reason = '';

    if (!NEYNAR_KEY) {
      // Modo "simulado" si no hay API key: devuelve falso con mensaje.
      reason = 'Neynar API key not configured - verification cannot run';
      return NextResponse.json({ ok: true, verified: false, reason });
    }

    const headers = {
      'x-api-key': NEYNAR_KEY,
      'Content-Type': 'application/json'
    };

    // 1) follow: check if actorFid follows targetFid
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

    // 2) recast: check whether actor has recast the target cast
    else if (body.taskType === 'recast') {
      const castHash = body.target;
      const url = `${NEYNAR_BASE}/reactions?fid=${body.actorFid}&cast_hash=${encodeURIComponent(castHash)}`;
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

    // 3) keyword: check actor's recent casts for keyword
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

    // 4) reply: check reply to a specific cast (target = parent cast hash)
    else if (body.taskType === 'reply') {
      const parentHash = body.target;
      const url = `${NEYNAR_BASE}/feed?fid=${body.actorFid}&limit=50`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const casts = data?.casts ?? data?.items ?? [];
        verified = Array.isArray(casts) && casts.some((c: any) => {
          return (c?.parent_hash === parentHash) || (c?.parent?.hash === parentHash);
        });
        reason = verified ? 'reply found' : 'reply not found';
      }
    }

    // If verified, update DB: mark participation / increase score
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
            data: {
              fid: body.actorFid,
              username: `fid-${body.actorFid}`
            }
          });
        }

        if (!participant) {
          participant = await prisma.participation.create({
            data: {
              userId: user.id,
              listId: list.id,
              score: task.points ?? 0
            }
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

        try {
          const Pusher = require('pusher');
          if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
            const p = new Pusher({
              appId: process.env.PUSHER_APP_ID,
              key: process.env.PUSHER_KEY,
              secret: process.env.PUSHER_SECRET,
              cluster: process.env.PUSHER_CLUSTER,
              useTLS: true
            });
            p.trigger(`list-${list.id}`, 'ranking-updated', { listId: list.id });
            p.trigger(`global-ranking`, 'global-ranking-updated', { userId: user.id });
          }
        } catch (err) {
          console.warn('Pusher emit failed', err);
        }
      }
    }

    return NextResponse.json({ ok: true, verified, reason });
  } catch (error) {
    console.error('Error in verify route', error);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
