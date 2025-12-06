// src/pages/GamePage.jsx
import React, { useEffect, useState } from 'react';
import { SudokuBoard } from '../components/Board';
import { ActionButtons, NumberInput, CustomBoardActions } from '../components/Controls';
import {
  ErrorMessage,
  Statistics,
  ArcConsistencySteps,
  Legend,
  ValidationStatus
} from '../components/Info';
import useSudokuGame from '../hooks/useSudokuGame';
import useSudokuSolver from '../hooks/useSudokuSolver';
import { isValidMove } from '../utils/validation';
import { validateCustomBoard } from '../services/api';

const GamePage = ({ mode: initialMode, difficulty: initialDifficulty, onBack }) => {
  const {
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
    timeBreakdown,
    solvePuzzle,
    resetSolver
  } = useSudokuSolver();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setDifficulty(initialDifficulty);
    setIsCustomMode(initialMode === 'custom');

    if (initialMode === 'custom') {
      clearBoard();
    } else {
      loadPuzzle(initialDifficulty);
    }
  }, []);

  const handleValidateBoard = async () => {
    setValidationStatus(null);
    setValidationMessage('Validating...');

    const result = await validateCustomBoard(board);

    if (result.isValid && result.isSolvable) {
      setValidationStatus('valid');
      setValidationMessage(result.message);
      setIsValidated(true);
      setInitialBoard(board.map(row => [...row]));
    } else if (result.isValid && !result.isSolvable) {
      setValidationStatus('warning');
      setValidationMessage(result.message);
      setIsValidated(false);
    } else {
      setValidationStatus('invalid');
      setValidationMessage(result.message);
      setIsValidated(false);
    }
  };

  const handleSolve = () => {
    if (isCustomMode && !isValidated) {
      setValidationStatus('warning');
      setValidationMessage('Please validate the board first');
      return;
    }

    // Disable edit mode when solving
    setIsEditMode(false);
    solvePuzzle(board, setBoard);
  };

  const handleReset = () => {
    resetBoard();
    resetSolver();
    setIsEditMode(false);
    if (isCustomMode) {
      setIsValidated(false);
      setValidationStatus(null);
    }
  };

  const handleClear = () => {
    clearBoard();
    resetSolver();
    setIsValidated(false);
    setValidationStatus(null);
    setValidationMessage('');
    setIsEditMode(false);
  };

  const handleEditBoard = () => {
    // Toggle edit mode
    setIsEditMode(!isEditMode);

    if (!isEditMode) {
      // Entering edit mode
      if (isCustomMode) {
        setIsValidated(false);
        setValidationStatus(null);
      }
      resetSolver();
    }
  };

  const handleSaveEdits = () => {
    // Save current board as new initial board
    setInitialBoard(board.map(row => [...row]));
    setIsEditMode(false);

    if (isCustomMode) {
      setIsValidated(false);
      setValidationStatus(null);
      setValidationMessage('Board updated. Please validate again.');
    }

    resetSolver();
  };

  const handleCancelEdits = () => {
    // Revert to initial board
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setIsEditMode(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (Array.isArray(data) && data.length === 9) {
              setBoard(data);
              setIsValidated(false);
              setValidationStatus(null);
            }
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sudoku-board.json';
    link.click();
  };

  // Determine if cells can be edited
  const canEditCells = isCustomMode || isEditMode;

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
              Mode: <span className="text-indigo-600 capitalize">{mode === 'custom' ? 'Custom Board' : mode}</span>
            </span>
            {!isCustomMode && (
              <span className="px-4 py-2 bg-white rounded-xl shadow-md text-sm font-semibold text-gray-700">
                Level: <span className="text-purple-600 capitalize">{difficulty}</span>
              </span>
            )}
            {isEditMode && (
              <span className="px-4 py-2 bg-orange-100 rounded-xl shadow-md text-sm font-semibold text-orange-700 animate-pulse">
                ✏️ Edit Mode
              </span>
            )}
            {validating && (
              <span className="px-4 py-2 bg-yellow-100 rounded-xl shadow-md text-sm font-semibold text-yellow-700 animate-pulse">
                Validating...
              </span>
            )}
            {solving && (
              <span className="px-4 py-2 bg-green-100 rounded-xl shadow-md text-sm font-semibold text-green-700 animate-pulse">
                Solving...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4">
            {isCustomMode ? (
              <CustomBoardActions
                onValidate={handleValidateBoard}
                onClear={handleClear}
                onSolve={handleSolve}
                onImport={handleImport}
                onExport={handleExport}
                isValidated={isValidated}
                validating={validating}
                canSolve={isValidated && !solving}
              />
            ) : (
              <>
                <ActionButtons
                  onSolve={handleSolve}
                  onReset={handleReset}
                  onClear={handleClear}
                  solving={solving}
                  solved={solved}
                />

                {/* Edit Board Button */}
                {!isEditMode && !solved && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Board</h3>
                    <button
                      onClick={handleEditBoard}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Current Board
                    </button>
                  </div>
                )}

                {/* Edit Mode Actions */}
                {isEditMode && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Mode Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleSaveEdits}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </button>

                      <button
                        onClick={handleCancelEdits}
                        className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {((mode === 'play' && !solved) || isCustomMode || isEditMode) && (
              <NumberInput
                selectedCell={selectedCell}
                onNumberInput={handleNumberInput}
              />
            )}

            {solveTime > 0 && !isEditMode && (
              <Statistics
                solveTime={solveTime}
                timeBreakdown={timeBreakdown}
              />
            )}

            <Legend />
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-6">
            <SudokuBoard
              board={board}
              initialBoard={canEditCells ? board : initialBoard}
              selectedCell={selectedCell}
              solved={solved && !isEditMode}
              onCellClick={handleCellClick}
              onKeyPress={handleKeyPress}
              isValidMove={isValidMove}
            />
            <ErrorMessage message={error} />

            {isEditMode && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-1">Edit Mode Active</h4>
                    <p className="text-sm text-orange-700">
                      You can now modify any cell on the board. Click cells to select and enter numbers 1-9.
                      Remember to save your changes when done!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isCustomMode && (
              <ValidationStatus
                status={validationStatus}
                message={validationMessage}
              />
            )}
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

            {isCustomMode && !isValidated && (
              <div className="bg-blue-50 rounded-2xl shadow-lg p-5 border border-blue-200">
                <h3 className="text-sm font-semibold mb-2 text-blue-900">Custom Mode Tips</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Fill in known numbers (1-9)</li>
                  <li>• Leave empty cells as 0</li>
                  <li>• Validate before solving</li>
                  <li>• Import/Export to save boards</li>
                </ul>
              </div>
            )}

            {isEditMode && (
              <div className="bg-orange-50 rounded-2xl shadow-lg p-5 border border-orange-200">
                <h3 className="text-sm font-semibold mb-2 text-orange-900">Edit Mode Tips</h3>
                <ul className="text-xs text-orange-800 space-y-1">
                  <li>• All cells are now editable</li>
                  <li>• Use keyboard (1-9) or number pad</li>
                  <li>• Press Backspace to clear cells</li>
                  <li>• Save changes to update board</li>
                  <li>• Cancel to revert changes</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
