'use client'

import React, { useState } from 'react';
import { useAuthStore } from '../../lib/store';

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.pfpUrl && (
          <img 
            src={user.pfpUrl} 
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div>
          <p className="font-semibold">{user.displayName || user.username}</p>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button 
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  // ... contenido del componente  
}
