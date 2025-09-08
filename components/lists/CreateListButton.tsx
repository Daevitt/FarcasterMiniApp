'use client'

import React, { useState } from 'react';
import { useTaskStore } from '../lib/store';

export default function CreateListButton() {
  const { addTaskList } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTaskList({
        title: title.trim(),
        description: description.trim(),
        taskCount: 0
      });
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  if (isOpen) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="List title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            autoFocus
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2 h-20"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
    >
      <span className="text-gray-600">+ Create New List</span>
    </button>
  );
}

