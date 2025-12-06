// src/hooks/useSudokuSolver.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

const useSudokuSolver = () => {
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const [arcConsistencySteps, setArcConsistencySteps] = useState([]);
  const [domains, setDomains] = useState({});

  const solvePuzzle = useCallback(async (board, setBoard, setGameDomains = null) => {
    setSolving(true);
    setSolved(false);
    setArcConsistencySteps([]);
    setDomains({});
    
    try {
      const result = await apiService.solvePuzzle(board);
      
      setBoard(result.solved_board);
      setSolveTime(result.total_time * 1000); // Convert to ms
      setSolved(true);
      
      // Store arc consistency steps with full data (domains snapshots included)
      if (result.arc_consistency_steps && result.arc_consistency_steps.length > 0) {
        setArcConsistencySteps(result.arc_consistency_steps);
      }
      
      // Store and share domains
      if (result.domains) {
        setDomains(result.domains);
        // If callback is provided, also update game domains
        if (setGameDomains) {
          setGameDomains(result.domains);
        }
      }
    } catch (err) {
      console.error('Solving error:', err);
      alert(`Failed to solve: ${err.message}`);
    } finally {
      setSolving(false);
    }
  }, []);

  const resetSolver = useCallback(() => {
    setSolving(false);
    setSolved(false);
    setSolveTime(0);
    setArcConsistencySteps([]);
  }, []);

  return {
    solving,
    solved,
    solveTime,
    arcConsistencySteps,
    domains,
    timeBreakdown: undefined, // Not currently used, but expected by GamePage
    solvePuzzle,
    resetSolver
  };
};

export default useSudokuSolver;