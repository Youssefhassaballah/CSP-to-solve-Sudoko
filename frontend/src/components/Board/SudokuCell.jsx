import React from 'react';

const SudokuCell = ({ 
  value, 
  rowIndex, 
  colIndex, 
  isInitial, 
  isSelected, 
  isSolved, 
  isInvalid,
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
    } else {
      className += "bg-white hover:bg-gray-50 ";
    }
    
    if (isInvalid) {
      className += "text-red-600 ";
    }
    
    return className;
  };

  return (
    <div
      onClick={onClick}
      className={`
        aspect-square border border-gray-300
        ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : ''}
        ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : ''}
      `}
    >
      <div className={getCellClassName()}>
        {value !== 0 ? value : ''}
      </div>
    </div>
  );
};

export default SudokuCell;