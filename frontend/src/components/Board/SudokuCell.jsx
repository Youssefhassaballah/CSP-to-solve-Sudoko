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
    
    if (isInitial) {
      className += "bg-blue-50 text-blue-900 font-bold ";
    } else if (isSelected) {
      className += "bg-yellow-200 ";
    } else if (isSolved) {
      className += "bg-green-50 text-green-700 ";
    } else if (isInvalid) {
      className += "bg-red-100 text-red-700 animate-pulse ";
    } else if (isContradiction) {
      className += "bg-red-200 text-red-900 border-2 border-red-500 ";
    } else if (isHint) {
      className += "bg-purple-100 text-purple-700 border-2 border-purple-400 ";
    } else {
      className += "bg-white hover:bg-gray-50 ";
    }
    
    return className;
  };

  return (
    <div
      onClick={onClick}
      className={`
        aspect-square border border-gray-300 relative
        ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : ''}
        ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : ''}
        ${isInvalid ? 'animate-pulse' : ''}
      `}
    >
      <div className={getCellClassName()}>
        {value !== 0 ? value : ''}
      </div>
      {isInvalid && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
      )}
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