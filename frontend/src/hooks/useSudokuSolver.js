import { useState, useCallback } from 'react';
import { solveSudoku } from '../services/api';

const useSudokuSolver = () => {
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const [arcConsistencySteps, setArcConsistencySteps] = useState([]);

  const solvePuzzle = useCallback(async (board, setBoard) => {
    setSolving(true);
    const startTime = Date.now();
    
    try {
      const result = await solveSudoku(board);
      setBoard(result.board);
      setArcConsistencySteps(result.steps);
      setSolved(true);
      setSolveTime(Date.now() - startTime);
    } catch (error) {
      console.error('Error solving puzzle:', error);
    } finally {
      setSolving(false);
    }
  }, []);

  const resetSolver = useCallback(() => {
    setSolved(false);
    setSolveTime(0);
    setArcConsistencySteps([]);
  }, []);

  return {
    solving,
    solved,
    solveTime,
    arcConsistencySteps,
    solvePuzzle,
    resetSolver
  };
};

export default useSudokuSolver;