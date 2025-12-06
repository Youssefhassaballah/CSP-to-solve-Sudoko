import React from 'react';

const DifficultyCard = ({ 
  level, 
  selectedDifficulty, 
  onSelect, 
  icon, 
  description, 
  cells,
  color 
}) => {
  const isSelected = selectedDifficulty === level;
  
  return (
    <button
      onClick={() => onSelect(level)}
      className={`p-6 rounded-2xl border-2 transition-all ${
        isSelected
          ? `border-${color}-600 bg-${color}-50 shadow-lg scale-105`
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 capitalize mb-1">{level}</h3>
      <p className="text-sm text-gray-600 mb-1">{description}</p>
      <p className="text-xs text-gray-500">{cells}</p>
    </button>
  );
};

export default DifficultyCard;