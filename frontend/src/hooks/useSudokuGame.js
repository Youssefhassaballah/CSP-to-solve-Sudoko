// src/hooks/useSudokuGame.js (updated version)
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { isValidMove } from '../utils/validation';
import useSudokuValidation from './useSudokuValidation';

const useSudokuGame = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('play');
  const [difficulty, setDifficulty] = useState('easy');
  const [validating, setValidating] = useState(false);
  const [hintMode, setHintMode] = useState(false);
  const [score, setScore] = useState(1000);
  const [moves, setMoves] = useState([]);

  const {
    validationState,
    checkMoveConsistency,
    validateBoard,
    resetValidation
  } = useSudokuValidation();

  const handleCellClick = useCallback((row, col) => {
    setSelectedCell({ row, col });
    setError('');
  }, []);

  const handleNumberInput = useCallback(async (number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Don't allow modification of initial values
    if (initialBoard[row][col] !== 0) {
      setError('Cannot modify initial puzzle values');
      return;
    }
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = number;
    
    // Basic validation
    if (number !== 0 && !isValidMove(newBoard, row, col, number)) {
      setError('❌ Invalid move! Number already exists in row, column, or subgrid');
      setScore(prev => Math.max(0, prev - 50));
      return;
    }
    
    setValidating(true);
    
    // Advanced consistency check
    const consistency = await checkMoveConsistency(newBoard, row, col, number);
    
    if (!consistency.isConsistent) {
      setError(`❌ ${consistency.message}`);
      setScore(prev => Math.max(0, prev - 100));
      setValidating(false);
      return;
    }
    
    // Move is valid and consistent
    setBoard(newBoard);
    setError('');
    setScore(prev => prev + 10);
    
    // Add to move history
    setMoves(prev => [...prev, {
      row,
      col,
      value: number,
      timestamp: new Date().toISOString(),
      scoreChange: number === 0 ? -5 : 10
    }]);
    
    // Check if puzzle is complete
    if (isBoardComplete(newBoard)) {
      setError('🎉 Congratulations! Puzzle solved correctly!');
      setScore(prev => prev + 500); // Bonus for completion
    }
    
    setValidating(false);
  }, [selectedCell, board, initialBoard, checkMoveConsistency]);

  // New function to provide hints
  const provideHint = useCallback(async () => {
    if (!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== 0) {
      setError('Select an empty cell to get a hint');
      return;
    }
    
    setValidating(true);
    setHintMode(true);
    
    try {
      const result = await apiService.solvePuzzle(board);
      const solution = result.solved_board;
      const { row, col } = selectedCell;
      const correctValue = solution[row][col];
      
      setError(`💡 Hint: Try ${correctValue} in this cell`);
      setScore(prev => Math.max(0, prev - 30)); // Cost for hint
    } catch (err) {
      setError('Could not generate hint');
    } finally {
      setValidating(false);
      setTimeout(() => setHintMode(false), 3000);
    }
  }, [selectedCell, board, initialBoard]);

  // New function to undo last move
  const undoMove = useCallback(() => {
    if (moves.length === 0) return;
    
    const lastMove = moves[moves.length - 1];
    const newBoard = board.map(r => [...r]);
    newBoard[lastMove.row][lastMove.col] = 0;
    
    setBoard(newBoard);
    setMoves(prev => prev.slice(0, -1));
    setScore(prev => prev - lastMove.scoreChange);
    setError('↩️ Last move undone');
  }, [moves, board]);

  const handleKeyPress = useCallback((key) => {
    handleNumberInput(key);
  }, [handleNumberInput]);

  const resetBoard = useCallback(() => {
    setBoard([...initialBoard]);
    setSelectedCell(null);
    setError('');
    resetValidation();
    setScore(1000);
    setMoves([]);
  }, [initialBoard, resetValidation]);

  const clearBoard = useCallback(() => {
    const emptyBoard = Array(9).fill().map(() => Array(9).fill(0));
    setBoard(emptyBoard);
    setInitialBoard(emptyBoard);
    setSelectedCell(null);
    setError('');
    resetValidation();
    setScore(1000);
    setMoves([]);
  }, [resetValidation]);

  const loadPuzzle = useCallback(async (difficultyLevel) => {
    try {
      const result = await apiService.generatePuzzle(difficultyLevel);
      setBoard(result.puzzle);
      setInitialBoard(result.puzzle.map(row => [...row]));
      setSelectedCell(null);
      setError('');
      resetValidation();
      setScore(1000);
      setMoves([]);
    } catch (err) {
      setError(`Failed to load puzzle: ${err.message}`);
      
      // Fallback to a default puzzle
      const defaultPuzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ];
      setBoard(defaultPuzzle);
      setInitialBoard(defaultPuzzle.map(row => [...row]));
      resetValidation();
      setScore(1000);
      setMoves([]);
    }
  }, [resetValidation]);

  return {
    board,
    setBoard,
    initialBoard,
    selectedCell,
    error,
    mode,
    setMode,
    difficulty,
    setDifficulty,
    validating,
    validationState,
    score,
    moves,
    hintMode,
    handleCellClick,
    handleNumberInput,
    handleKeyPress,
    provideHint,
    undoMove,
    resetBoard,
    clearBoard,
    loadPuzzle
  };
};

export default useSudokuGame;

// Helper function
const isBoardComplete = (board) => {
  return board.every(row => row.every(cell => cell !== 0));
};