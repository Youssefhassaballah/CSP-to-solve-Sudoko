// src/components/SudokuCell.jsx (updated)
import React from 'react';

const SudokuCell = ({ 
  value, 
  rowIndex, 
  colIndex, 
  isInitial, 
  isSelected, 
  isSolved,
  isInvalid,
  isContradiction,
  isHint,
  onClick 
}) => {
  const getCellClassName = () => {
    let className = "w-full h-full flex items-center justify-center text-xl font-semibold transition-all cursor-pointer ";

    // Priority order for styling
    if (isInitial) {
      // Initial cells (from API/puzzle) - Indigo/Blue background
      className += "bg-indigo-100 text-indigo-900 font-bold ";
    } else if (isSelected) {
      // Selected cell - Yellow highlight
      className += "bg-yellow-200 ";
      // If invalid and selected, show red text
      if (isInvalid) {
        className += "text-red-600 font-bold ";
      }
    } else if (isSolved && value !== 0) {
      // Solved cells (filled by AI solver) - Emerald/Green background
      className += "bg-emerald-100 text-emerald-800 ";
    } else if (isInvalid) {
      // Invalid moves - Red text only, keep white background
      className += "bg-white !text-red-600 !font-extrabold ";
    } else if (isContradiction) {
      // Contradicting cells - Darker red
      className += "bg-red-200 text-red-900 border-2 border-red-500 ";
    } else if (isHint) {
      // Hint cells - Purple
      className += "bg-purple-100 text-purple-700 border-2 border-purple-400 ";
    } else {
      // Empty or user-filled cells - White
      className += "bg-white hover:bg-gray-50 ";
    }

    return className;
  };

  return (
    <div
      onClick={onClick}
      className={`
        aspect-square relative
        ${isInvalid ? 'border-2 border-red-400' : 'border border-gray-300'}
        ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : ''}
        ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : ''}
      `}
    >
      <div className={getCellClassName()}>
        {value !== 0 ? value : ''}
      </div>
      {isContradiction && (
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      )}
      {isHint && (
        <div className="absolute top-0 left-0 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default SudokuCell;