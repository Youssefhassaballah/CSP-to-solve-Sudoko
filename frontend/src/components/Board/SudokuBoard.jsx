import React, { useEffect, useRef } from 'react';
import SudokuCell from './SudokuCell';

const SudokuBoard = ({ 
  board, 
  initialBoard, 
  selectedCell, 
  solved,
  onCellClick,
  onKeyPress,
  isValidMove 
}) => {
  const boardRef = useRef(null);

  // Focus board on mount and when selected cell changes
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.focus();
    }
  }, [selectedCell]);

  const handleKeyDown = (e) => {
    // Only accept number keys 1-9 and delete/backspace
    const key = e.key;
    
    if (key >= '1' && key <= '9') {
      onKeyPress(parseInt(key));
      e.preventDefault();
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      onKeyPress(0);
      e.preventDefault();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      handleArrowKey(key);
      e.preventDefault();
    }
  };

  const handleArrowKey = (key) => {
    if (!selectedCell) return;

    let newRow = selectedCell.row;
    let newCol = selectedCell.col;

    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, selectedCell.row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(8, selectedCell.row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, selectedCell.col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(8, selectedCell.col + 1);
        break;
    }

    onCellClick(newRow, newCol);
  };

  return (
    <div 
      ref={boardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-2xl shadow-2xl p-8 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
      <div className="aspect-square">
        <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                rowIndex={rowIndex}
                colIndex={colIndex}
                isInitial={initialBoard[rowIndex][colIndex] !== 0}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isSolved={solved}
                isInvalid={value !== 0 && !isValidMove(board, rowIndex, colIndex, value)}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>💡 Use keyboard: 1-9 to input, Arrow keys to navigate, Backspace/Delete to clear</p>
      </div>
    </div>
  );
};

export default SudokuBoard;