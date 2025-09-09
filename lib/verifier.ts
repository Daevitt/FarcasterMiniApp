// lib/verifier.ts
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

/**
 * Verifica si un usuario sigue a otro
 */
export async function checkFollow(fid: number, targetFid: number) {
  const resp = await fetch(
    `https://api.neynar.com/v2/farcaster/user/following?fid=${fid}&target_fid=${targetFid}`,
    {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
      },
    }
  );
  const data = await resp.json();
  return data?.is_following === true;
}

/**
 * Verifica si un usuario recasteó un cast específico
 */
export async function checkRecast(fid: number, castHash: string) {
  const resp = await fetch(
    `https://api.neynar.com/v2/farcaster/cast/recasts?cast_hash=${castHash}`,
    {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
      },
    }
  );
  const data = await resp.json();
  return data?.users?.some((u: any) => u.fid === fid) ?? false;
}

/**
 * Verifica si un usuario comentó en un cast específico
 */
export async function checkComment(fid: number, castHash: string) {
  const resp = await fetch(
    `https://api.neynar.com/v2/farcaster/cast/replies?cast_hash=${castHash}`,
    {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
      },
    }
  );
  const data = await resp.json();
  return data?.casts?.some((c: any) => c.author?.fid === fid) ?? false;
}

/**
 * Verifica si un usuario publicó un cast con cierta palabra/frase
 */
export async function checkCastPhrase(fid: number, phrase: string) {
  const resp = await fetch(
    `https://api.neynar.com/v2/farcaster/feed/user?fid=${fid}&limit=10`,
    {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
      },
    }
  );
  const data = await resp.json();
  return data?.casts?.some((c: any) =>
    c.text.toLowerCase().includes(phrase.toLowerCase())
  );
}
