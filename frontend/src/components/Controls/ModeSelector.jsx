import React from 'react';

const ModeSelector = ({ mode, onModeChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Mode</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onModeChange('play')}
          className={`py-3 rounded-xl font-medium transition-all ${
            mode === 'play'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Mode 1: Play
        </button>
        <button
          onClick={() => onModeChange('solve')}
          className={`py-3 rounded-xl font-medium transition-all ${
            mode === 'solve'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Mode 2: Solve
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;