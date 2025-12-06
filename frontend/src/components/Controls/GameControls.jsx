// src/components/Controls/GameControls.jsx
import React from 'react';
import { Lightbulb, Undo2 } from 'lucide-react';

const GameControls = ({ onHint, onUndo, canUndo }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Game Tools</h3>
      <div className="space-y-3">
        <button
          onClick={onHint}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
        >
          <Lightbulb size={20} />
          Get Hint (-30 pts)
        </button>
        
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Undo2 size={20} />
          Undo Move
        </button>
      </div>
    </div>
  );
};

export default GameControls;