import React, { useState } from 'react';
import { ModeCard, DifficultyCard } from '../components/Welcome';

const WelcomePage = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState('play');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const modes = [
    {
      mode: 'play',
      icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Mode 1: Interactive Play',
      description: 'Fill the board manually with instant validation and hints'
    },
    {
      mode: 'solve',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Mode 2: AI Solver',
      description: 'Watch the CSP algorithm solve your puzzle step-by-step'
    },
    {
      mode: 'custom',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      title: 'Mode 3: Create from Scratch',
      description: 'Build your own Sudoku puzzle and validate it before solving'
    }
  ];

  const difficulties = [
    { 
      level: 'easy', 
      color: 'green', 
      icon: '😊', 
      description: 'Perfect for beginners', 
      cells: '40-45 filled' 
    },
    { 
      level: 'medium', 
      color: 'yellow', 
      icon: '🤔', 
      description: 'Moderate challenge', 
      cells: '30-35 filled' 
    },
    { 
      level: 'hard', 
      color: 'red', 
      icon: '😤', 
      description: 'Expert level', 
      cells: '25-30 filled' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Sudoku CSP Solver
          </h1>
          <p className="text-xl text-gray-600">
            Constraint Satisfaction Problem with Arc Consistency
          </p>
          <div className="mt-4 inline-block px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            Alexandria University - AI Course
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Mode Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              Select Game Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map((modeData) => (
                <ModeCard
                  key={modeData.mode}
                  mode={modeData.mode}
                  selectedMode={selectedMode}
                  onSelect={setSelectedMode}
                  icon={modeData.icon}
                  title={modeData.title}
                  description={modeData.description}
                />
              ))}
            </div>
          </div>

          {/* Difficulty Selection - Hidden for custom mode */}
          {selectedMode !== 'custom' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Choose Difficulty Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((diff) => (
                  <DifficultyCard
                    key={diff.level}
                    level={diff.level}
                    selectedDifficulty={selectedDifficulty}
                    onSelect={setSelectedDifficulty}
                    icon={diff.icon}
                    description={diff.description}
                    cells={diff.cells}
                    color={diff.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About the Solver
            </h3>
            <p className="text-sm text-gray-700">
              This application uses <strong>Constraint Satisfaction Problem (CSP)</strong> techniques with 
              <strong> Arc Consistency (AC-3)</strong> and <strong>Backtracking</strong> to solve Sudoku puzzles efficiently. 
              Watch as the algorithm reduces domains and propagates constraints to find solutions.
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={() => onStart(selectedMode, selectedDifficulty)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;