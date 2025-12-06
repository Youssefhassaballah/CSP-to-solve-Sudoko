// src/hooks/useSudokuSolver.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

const useSudokuSolver = () => {
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const [arcConsistencySteps, setArcConsistencySteps] = useState([]);

  const solvePuzzle = useCallback(async (board, setBoard) => {
    setSolving(true);
    setSolved(false);
    setArcConsistencySteps([]);
    
    try {
      const result = await apiService.solvePuzzle(board);
      
      setBoard(result.solved_board);
      setSolveTime(result.total_time * 1000); // Convert to ms
      setSolved(true);
      
      // Format arc consistency steps for display
      if (result.arc_consistency_steps) {
        const steps = result.arc_consistency_steps.map(step => 
          `Arc (${step.arc[0]}) → (${step.arc[1]}): Removed ${step.removed_values.join(', ')} from cell (${step.cell[0]+1}, ${step.cell[1]+1})`
        );
        setArcConsistencySteps(steps);
      }
    } catch (err) {
      console.error('Solving error:', err);
      alert(`Failed to solve: ${err.message}`);
    } finally {
      setSolving(false);
    }
  }, []);

  const applyArcConsistency = useCallback(async (board) => {
    try {
      const result = await apiService.applyArcConsistency(board);
      
      // Format arc consistency steps for display and accumulate them
      if (result.arc_steps && result.arc_steps.length > 0) {
        const newSteps = result.arc_steps.map(step => 
          `Arc (${step.arc[0]}) → (${step.arc[1]}): Removed ${step.removed_values.join(', ')} from cell (${step.cell[0]+1}, ${step.cell[1]+1})`
        );
        // Accumulate steps instead of replacing them
        setArcConsistencySteps(prevSteps => [...prevSteps, ...newSteps]);
      }
      
      return result;
    } catch (err) {
      console.error('Arc consistency error:', err);
      return null;
    }
  }, []);

  const resetSolver = useCallback(() => {
    setSolving(false);
    setSolved(false);
    setSolveTime(0);
    setArcConsistencySteps([]);
  }, []);

  const clearArcSteps = useCallback(() => {
    setArcConsistencySteps([]);
  }, []);

  return {
    solving,
    solved,
    solveTime,
    arcConsistencySteps,
    timeBreakdown: undefined, // Not currently used, but expected by GamePage
    solvePuzzle,
    applyArcConsistency,
    resetSolver,
    clearArcSteps
  };
};

export default useSudokuSolver;