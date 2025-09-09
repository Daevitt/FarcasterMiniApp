'use client'

import React from 'react';
import { useAuthStore } from '../../lib/store';

export default function LoginButton() {
  const { login, setLoading, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      // Aquí iría tu lógica de autenticación con Farcaster
      // Por ahora, simulamos un login exitoso
      const mockUser = {
        fid: 12345,
        username: 'testdaevitt',
        displayName: 'Test Daevitt',
        pfpUrl: 'https://raw.githubusercontent.com/Daevitt/FarcasterMiniApp/refs/heads/main/logos/perfil%20100%208bits%20brander.png'
      };
      
      // Simular delay de API
      setTimeout(() => {
        login(mockUser);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      {isLoading ? 'Connecting...' : 'Connect with Farcaster'}
    </button>
  );
}



