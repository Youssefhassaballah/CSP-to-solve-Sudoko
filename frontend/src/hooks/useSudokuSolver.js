// src/hooks/useSudokuSolver.js
import { useState, useCallback, useRef } from 'react';
import { apiService } from '../services/api';

const useSudokuSolver = () => {
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const [arcConsistencySteps, setArcConsistencySteps] = useState([]);
  const [domains, setDomains] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500); // ms per step
  const [isPaused, setIsPaused] = useState(false);

  const animationRef = useRef(null);
  const solveStepsRef = useRef([]);

  const solvePuzzle = useCallback(async (board, setBoard, setGameDomains = null, animated = false, setMoveArcSteps = null) => {
    setSolving(true);
    setSolved(false);
    setArcConsistencySteps([]);
    setDomains({});
    setIsAnimating(animated);
    setCurrentStep(0);
    setIsPaused(false);

    try {
      const result = await apiService.solvePuzzle(board);
      console.log('API Result:', result);
      console.log('Arc steps from API:', result.arc_consistency_steps ? result.arc_consistency_steps.length : 0);

      if (animated && result.arc_consistency_steps && result.arc_consistency_steps.length > 0) {
        // Store steps for animation
        solveStepsRef.current = result.arc_consistency_steps;
        setArcConsistencySteps(result.arc_consistency_steps);

        // Animate through the steps
        await animateSteps(board, result.arc_consistency_steps, setBoard, setGameDomains, setMoveArcSteps);

        // Set final state
        setBoard(result.solved_board);
      } else {
        // Instant solve (no animation)
        setBoard(result.solved_board);
        // Store arc consistency steps for display after instant solve
        if (result.arc_consistency_steps && result.arc_consistency_steps.length > 0) {
          setArcConsistencySteps(result.arc_consistency_steps);
        }
      }

      setSolveTime(result.total_time * 1000); // Convert to ms
      
      // Store and share domains
      if (result.domains) {
        setDomains(result.domains);
        // If callback is provided, also update game domains
        if (setGameDomains) {
          setGameDomains(result.domains);
        }
      }
      
      // Mark as solved AFTER all other state is set
      setSolved(true);
    } catch (err) {
      console.error('Solving error:', err);
      alert(`Failed to solve: ${err.message}`);
    } finally {
      setSolving(false);
      setIsAnimating(false);
    }
  }, [animationSpeed, isPaused]);

  const animateSteps = useCallback(async (initialBoard, steps, setBoard, setGameDomains, setMoveArcSteps) => {
    return new Promise((resolve) => {
      let stepIndex = 0;
      let currentBoard = JSON.parse(JSON.stringify(initialBoard));

      const playNextStep = () => {
        if (stepIndex >= steps.length) {
          resolve();
          return;
        }

        setCurrentStep(stepIndex);
        const step = steps[stepIndex];

        // Update domains
        if (step.domains_snapshot && setGameDomains) {
          setGameDomains(step.domains_snapshot);
        }

        // Show arc consistency steps up to current step (like user play mode)
        if (setMoveArcSteps) {
          const stepsUpToCurrent = steps.slice(0, stepIndex + 1);
          setMoveArcSteps(stepsUpToCurrent);
        }

        // If this is an unassignment step (backtracking), clear the cell
        if (step.is_unassignment) {
          const [row, col] = step.cell;
          currentBoard[row][col] = 0;
          setBoard(JSON.parse(JSON.stringify(currentBoard)));
        }
        // If this is a cell assignment step, fill the cell on the board
        else if (step.is_cell_assignment && step.assigned_value) {
          const [row, col] = step.cell;
          currentBoard[row][col] = step.assigned_value;
          setBoard(JSON.parse(JSON.stringify(currentBoard)));
        }
        // Otherwise, if this step resulted in a domain reducing to 1, also update the board
        else if (step.domain_after && step.domain_after.length === 1 && !step.is_cell_assignment) {
          const [row, col] = step.cell;
          // Only update if the cell wasn't already filled
          if (currentBoard[row][col] === 0) {
            currentBoard[row][col] = step.domain_after[0];
            setBoard(JSON.parse(JSON.stringify(currentBoard)));
          }
        }

        stepIndex++;

        animationRef.current = setTimeout(playNextStep, animationSpeed);
      };

      playNextStep();
    });
  }, [animationSpeed]);

  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
    // Resume from current step
    if (currentStep < solveStepsRef.current.length) {
      // Will need to implement resume logic
    }
  }, [currentStep]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    setIsPaused(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
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
    isAnimating,
    currentStep,
    animationSpeed,
    isPaused,
    timeBreakdown: undefined, // Not currently used, but expected by GamePage
    solvePuzzle,
    resetSolver,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    setAnimationSpeed
  };
};

export default useSudokuSolver;