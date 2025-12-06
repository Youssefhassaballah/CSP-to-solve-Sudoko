// src/components/Controls/ActionButtons.jsx (updated)
import React from 'react';
import { Zap, RotateCcw, Lightbulb, Undo2 } from 'lucide-react';

const ActionButtons = ({ 
  onSolve, 
  onReset, 
  onClear,
  onHint,
  onUndo,
  solving, 
  solved,
  hintMode,
  canUndo
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
      <div className="space-y-3">
        <button
          onClick={onSolve}
          disabled={solving || solved}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Zap size={20} />
          {solving ? 'Solving...' : 'Solve with CSP'}
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onHint}
            disabled={hintMode}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Lightbulb size={18} />
            Hint
          </button>
          
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Undo2 size={18} />
            Undo
          </button>
        </div>
        
        <button
          onClick={onReset}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <button
          onClick={onClear}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;