import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';

const ActionButtons = ({ 
  onSolve, 
  onReset, 
  onClear, 
  solving, 
  solved 
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
        
        <button
          onClick={onReset}
          className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <button
          onClick={onClear}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;