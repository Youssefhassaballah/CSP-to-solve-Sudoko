import React from 'react';

const DifficultySelector = ({ difficulty, onDifficultyChange }) => {
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Difficulty</h3>
      <div className="grid grid-cols-3 gap-2">
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={`py-2 rounded-lg font-medium text-sm transition-all ${
              difficulty === diff
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;