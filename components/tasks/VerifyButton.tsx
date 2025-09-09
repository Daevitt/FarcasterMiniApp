// components/tasks/VerifyButton.tsx
'use client';

import React, { useState, useRef } from 'react';

type Props = {
  taskId: string;
  actorFid: number; // el fid del usuario que pulsó
  taskType: 'follow' | 'recast' | 'reply' | 'keyword';
  target: string;
  onVerified?: () => void;
};

export default function VerifyButton({ taskId, actorFid, taskType, target, onVerified }: Props) {
  const [status, setStatus] = useState<'idle'|'checking'|'verified'|'failed'>('idle');
  const attemptsRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const verifyOnce = async () => {
    setStatus('checking');
    try {
      const res = await fetch(`/api/tasks/${taskId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorFid, taskType, target })
      });
      const data = await res.json();
      if (data?.ok && data?.verified) {
        setStatus('verified');
        if (onVerified) onVerified();
        return true;
      } else {
        // not verified this attempt
        return false;
      }
    } catch (err) {
      console.error('verify error', err);
      return false;
    }
  };

  const startPolling = () => {
    attemptsRef.current = 0;
    setStatus('checking');
    const attempt = async () => {
      attemptsRef.current += 1;
      const ok = await verifyOnce();
      if (ok) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        return;
      }
      if (attemptsRef.current >= 6) {
        setStatus('failed');
        return;
      }
      // schedule next attempt after 5s
      timerRef.current = window.setTimeout(attempt, 5000);
    };
    attempt();
  };

  const handleClick = () => {
    if (status === 'checking') return;
    if (status === 'verified') return;
    startPolling();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {status === 'idle' && 'Ya lo completé'}
        {status === 'checking' && 'Verificando...'}
        {status === 'verified' && 'Verificado ✓'}
        {status === 'failed' && 'No verificado — reintentar'}
      </button>

      {status === 'failed' && (
        <div className="text-sm text-red-500 mt-2">
          No se detectó la acción en los intentos. Puedes intentar nuevamente.
        </div>
      )}
    </div>
  );
}
