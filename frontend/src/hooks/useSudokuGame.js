import { useState, useCallback } from 'react';
import { validateMove } from '../services/api';
import { generatePuzzle } from '../utils/boardGenerator';

const useSudokuGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('play');
  const [difficulty, setDifficulty] = useState('easy');
  const [validating, setValidating] = useState(false);

  const handleCellClick = useCallback((row, col) => {
    if (mode === 'solve' || initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  }, [mode, initialBoard]);

  const handleNumberInput = useCallback(async (num) => {
    if (!selectedCell || mode === 'solve') return;
    
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    
    // Validate with backend
    if (num !== 0) {
      setValidating(true);
      const isValid = await validateMove(newBoard, row, col, num);
      setValidating(false);

      if (!isValid) {
        setError(`Invalid move! ${num} conflicts with Sudoku rules.`);
        setTimeout(() => setError(''), 3000);
        return;
      }
    }
    
    setBoard(newBoard);
    setError('');
  }, [selectedCell, mode, board, initialBoard]);

  const handleKeyPress = useCallback(async (num) => {
    await handleNumberInput(num);
  }, [handleNumberInput]);

  const resetBoard = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setError('');
    setSelectedCell(null);
  }, [initialBoard]);

  const clearBoard = useCallback(() => {
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    setBoard(emptyBoard);
    setInitialBoard(emptyBoard);
    setError('');
    setSelectedCell(null);
  }, []);

  const loadPuzzle = useCallback((diff) => {
    const newBoard = generatePuzzle(diff);
    setBoard(JSON.parse(JSON.stringify(newBoard)));
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));
    setError('');
    setSelectedCell(null);
  }, []);

  return {
    board,
    setBoard,
    initialBoard,
    selectedCell,
    error,
    setError,
    mode,
    setMode,
    difficulty,
    setDifficulty,
    validating,
    handleCellClick,
    handleNumberInput,
    handleKeyPress,
    resetBoard,
    clearBoard,
    loadPuzzle
  };
};

export default useSudokuGame;