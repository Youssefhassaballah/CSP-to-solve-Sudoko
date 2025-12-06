import React from 'react';

const NumberInput = ({ selectedCell, onNumberInput }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Input Number</h3>
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberInput(num)}
            disabled={!selectedCell}
            className="py-3 bg-indigo-100 hover:bg-indigo-200 rounded-lg font-semibold text-indigo-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {num === 0 ? 'Clear' : num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberInput;