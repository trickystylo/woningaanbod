import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Terug</span>
    </button>
  );
}