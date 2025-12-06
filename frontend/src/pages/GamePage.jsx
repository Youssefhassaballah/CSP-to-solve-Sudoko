import React, { useEffect } from 'react';
import { SudokuBoard } from '../components/Board';
import { ActionButtons, NumberInput } from '../components/Controls';
import { 
  ErrorMessage, 
  Statistics, 
  ArcConsistencySteps, 
  Legend 
} from '../components/Info';
import useSudokuGame from '../hooks/useSudokuGame';
import useSudokuSolver from '../hooks/useSudokuSolver';
import { isValidMove } from '../utils/validation';

const GamePage = ({ mode: initialMode, difficulty: initialDifficulty, onBack }) => {
  const {
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
    handleCellClick,
    handleNumberInput,
    handleKeyPress,
    resetBoard,
    clearBoard,
    loadPuzzle
  } = useSudokuGame();

  const {
    solving,
    solved,
    solveTime,
    arcConsistencySteps,
    solvePuzzle,
    resetSolver
  } = useSudokuSolver();

  useEffect(() => {
    setMode(initialMode);
    setDifficulty(initialDifficulty);
    loadPuzzle(initialDifficulty);
  }, []);

  const handleSolve = () => {
    solvePuzzle(board, setBoard);
  };

  const handleReset = () => {
    resetBoard();
    resetSolver();
  };

  const handleClear = () => {
    clearBoard();
    resetSolver();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-indigo-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </button>
          
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-white rounded-xl shadow-md text-sm font-semibold text-gray-700">
              Mode: <span className="text-indigo-600 capitalize">{mode}</span>
            </span>
            <span className="px-4 py-2 bg-white rounded-xl shadow-md text-sm font-semibold text-gray-700">
              Level: <span className="text-purple-600 capitalize">{difficulty}</span>
            </span>
            {validating && (
              <span className="px-4 py-2 bg-yellow-100 rounded-xl shadow-md text-sm font-semibold text-yellow-700 animate-pulse">
                Validating...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4">
            <ActionButtons
              onSolve={handleSolve}
              onReset={handleReset}
              onClear={handleClear}
              solving={solving}
              solved={solved}
            />
            
            {mode === 'play' && (
              <NumberInput 
                selectedCell={selectedCell} 
                onNumberInput={handleNumberInput} 
              />
            )}

            {solveTime > 0 && <Statistics solveTime={solveTime} />}
            
            <Legend />
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-6">
            <SudokuBoard
              board={board}
              initialBoard={initialBoard}
              selectedCell={selectedCell}
              solved={solved}
              onCellClick={handleCellClick}
              onKeyPress={handleKeyPress}
              isValidMove={isValidMove}
            />
            <ErrorMessage message={error} />
          </div>

          {/* Right Sidebar - Info */}
          <div className="lg:col-span-3 space-y-4">
            <ArcConsistencySteps steps={arcConsistencySteps} />
            
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                CSP Algorithm
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Using Arc Consistency (AC-3) with backtracking for efficient constraint propagation and domain reduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;