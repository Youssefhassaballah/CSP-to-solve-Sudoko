import React from 'react';

const ModeCard = ({ mode, selectedMode, onSelect, icon, title, description }) => {
  const isSelected = selectedMode === mode;
  
  return (
    <button
      onClick={() => onSelect(mode)}
      className={`p-6 rounded-2xl border-2 transition-all ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105'
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-600' : 'bg-gray-200'}`}>
          <svg 
            className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default ModeCard;