// src/components/Info/ScoreBoard.jsx
import React from 'react';
import { Trophy, History } from 'lucide-react';

const ScoreBoard = ({ score, moves }) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow-md px-4 py-2">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-bold text-lg">{score}</span>
        <span className="text-sm text-gray-500">pts</span>
      </div>
      <div className="h-6 w-px bg-gray-300"></div>
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-blue-500" />
        <span className="text-sm text-gray-700">{moves} moves</span>
      </div>
    </div>
  );
};

export default ScoreBoard;