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
  const [moveArcConsistencySteps, setMoveArcConsistencySteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState({});

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

  const handleNumberInput = useCallback(async (number, skipValidation = false) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // In custom mode, allow all edits without validation
    if (mode === 'custom' || skipValidation) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = number;
      setBoard(newBoard);
      setError('');
      return;
    }

    // Don't allow modification of initial values in other modes
    if (initialBoard[row][col] !== 0) {
      setError('Cannot modify initial puzzle values');
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = number;

    // Always update the board, even if invalid
    setBoard(newBoard);

    // Basic validation - show error but don't prevent the move
    if (number !== 0 && !isValidMove(newBoard, row, col, number)) {
      setError('❌ Invalid move! Number already exists in row, column, or subgrid');
      setScore(prev => Math.max(0, prev - 50));

      // Add to move history with negative score
      setMoves(prev => [...prev, {
        row,
        col,
        value: number,
        timestamp: new Date().toISOString(),
        scoreChange: -50,
        isInvalid: true
      }]);
      return;
    }

    setValidating(true);

    // Advanced consistency check (with arc consistency analysis)
    const consistency = await checkMoveConsistency(newBoard, row, col, number);

    // Update arc consistency steps for this move
    if (consistency.arcConsistencySteps && consistency.arcConsistencySteps.length > 0) {
      const formattedSteps = consistency.arcConsistencySteps.map(step =>
        `Arc (${step.arc[0]}) → (${step.arc[1]}): Removed ${step.removed_values.join(', ')} from cell (${step.cell[0]+1}, ${step.cell[1]+1})`
      );
      setMoveArcConsistencySteps(formattedSteps);
    } else {
      setMoveArcConsistencySteps([]);
    }

    // Update domains from consistency check
    if (consistency.domains) {
      setDomains(consistency.domains);
    }

    if (!consistency.isConsistent) {
      setError(`🚫 Board Cannot Be Solved! ${consistency.message || 'This move creates a contradiction that makes the puzzle unsolvable. Please undo or reset.'}`);
      setScore(prev => Math.max(0, prev - 100));
      setValidating(false);

      // Add to move history with negative score
      setMoves(prev => [...prev, {
        row,
        col,
        value: number,
        timestamp: new Date().toISOString(),
        scoreChange: -100,
        isInvalid: true
      }]);
      return;
    }

    // Move is valid and consistent
    setError('');
    setScore(prev => prev + 10);

    // Add to move history
    setMoves(prev => [...prev, {
      row,
      col,
      value: number,
      timestamp: new Date().toISOString(),
      scoreChange: number === 0 ? -5 : 10,
      isInvalid: false
    }]);

    // Check if puzzle is complete
    if (isBoardComplete(newBoard)) {
      setError('🎉 Congratulations! Puzzle solved correctly!');
      setScore(prev => prev + 500); // Bonus for completion
    }

    setValidating(false);
  }, [selectedCell, board, initialBoard, checkMoveConsistency, mode]);

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

      // Fill in the correct value
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = correctValue;
      setBoard(newBoard);

      setError(`💡 Hint used! Filled ${correctValue} in cell (${row + 1}, ${col + 1})`);
      setScore(prev => Math.max(0, prev - 30)); // Cost for hint

      // Add to move history
      setMoves(prev => [...prev, {
        row,
        col,
        value: correctValue,
        timestamp: new Date().toISOString(),
        scoreChange: -30,
        isHint: true
      }]);
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
    setMoveArcConsistencySteps([]);
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
    setMoveArcConsistencySteps([]);
  }, [resetValidation]);

  const loadPuzzle = useCallback(async (difficultyLevel) => {
    setLoading(true);
    try {
      const result = await apiService.generatePuzzle(difficultyLevel);
      setBoard(result.puzzle);
      setInitialBoard(result.puzzle.map(row => [...row]));
      setSelectedCell(null);
      setError('');
      resetValidation();
      setScore(1000);
      setMoves([]);
      setMoveArcConsistencySteps([]);

      // Fetch initial domains for the board
      try {
        const consistencyResult = await checkMoveConsistency(result.puzzle, 0, 0, 0);
        if (consistencyResult.domains) {
          setDomains(consistencyResult.domains);
        }
      } catch (domainError) {
        console.log('Could not fetch initial domains:', domainError);
      }
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
      setMoveArcConsistencySteps([]);
    } finally {
      setLoading(false);
    }
  }, [resetValidation, checkMoveConsistency]);

  return {
    board,
    setBoard,
    initialBoard,
    setInitialBoard,
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
    moveArcConsistencySteps,
    loading,
    domains,
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