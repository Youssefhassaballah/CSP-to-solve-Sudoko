import React, { useState } from 'react';

const ArcConsistencyVisualization = ({ steps, isPlayerMode = false, board }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0 || !board) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Arc Consistency Visualization</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          {isPlayerMode
            ? "Arc consistency visualization will appear here when you make moves"
            : "Arc consistency visualization will appear here when solving"}
        </p>
      </div>
    );
  }

  const step = steps[currentStep];

  // Check if step has the required structure
  if (!step || !step.arc || !step.cell) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Arc Consistency Visualization</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          Loading visualization data...
        </p>
      </div>
    );
  }

  const domains = step.domains_snapshot || {};

  // Helper to get domain for a cell
  const getDomain = (row, col) => {
    const key = `(${row}, ${col})`;
    return domains[key] || [];
  };

  const goToPrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const goToNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goToFirst = () => setCurrentStep(0);
  const goToLast = () => setCurrentStep(steps.length - 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Arc Consistency Visualization
      </h3>

      {/* Step Info */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-indigo-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-indigo-600">
            Arc: ({step.arc[0][0] + 1}, {step.arc[0][1] + 1}) → ({step.arc[1][0] + 1}, {step.arc[1][1] + 1})
          </span>
        </div>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Removed:</span>{' '}
          <span className="text-red-600 font-semibold">{step.removed_values.join(', ')}</span>
          {' '}from cell ({step.cell[0] + 1}, {step.cell[1] + 1})
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Remaining: {step.remaining_domain.join(', ') || 'None'}
        </p>
      </div>

      {/* Domain Grid */}
      <div className="mb-4 overflow-auto max-h-96">
        <div className="grid grid-cols-9 gap-0.5 bg-gray-800 p-0.5 rounded-lg" style={{ minWidth: '600px' }}>
          {Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: 9 }, (_, col) => {
              const cellValue = board[row][col];
              const domain = getDomain(row, col);
              const isAffectedCell = step.cell[0] === row && step.cell[1] === col;
              const isArcSource = step.arc[0][0] === row && step.arc[0][1] === col;
              const isArcTarget = step.arc[1][0] === row && step.arc[1][1] === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`
                    aspect-square p-1 text-xs flex flex-col items-center justify-center
                    ${isAffectedCell ? 'bg-red-100 border-2 border-red-500' :
                      isArcSource ? 'bg-yellow-100 border-2 border-yellow-500' :
                      isArcTarget ? 'bg-blue-100 border-2 border-blue-500' :
                      cellValue !== 0 ? 'bg-indigo-50' : 'bg-white'}
                    ${(col % 3 === 2 && col !== 8) ? 'border-r-2 border-r-gray-800' : ''}
                    ${(row % 3 === 2 && row !== 8) ? 'border-b-2 border-b-gray-800' : ''}
                  `}
                >
                  {cellValue !== 0 ? (
                    <span className="text-lg font-bold text-indigo-900">{cellValue}</span>
                  ) : (
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <div
                          key={num}
                          className={`flex items-center justify-center text-[0.5rem] ${
                            domain.includes(num)
                              ? 'text-purple-700 font-semibold'
                              : 'text-gray-300'
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
          <span>Affected Cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
          <span>Arc Source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
          <span>Arc Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-50 rounded border border-gray-300"></div>
          <span>Fixed Value</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goToFirst}
          disabled={currentStep === 0}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
        >
          ⏮ First
        </button>
        <button
          onClick={goToPrevious}
          disabled={currentStep === 0}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
        >
          ◀ Prev
        </button>
        <div className="px-4 py-1.5 bg-indigo-50 rounded-lg text-sm font-semibold text-indigo-900">
          {currentStep + 1} / {steps.length}
        </div>
        <button
          onClick={goToNext}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
        >
          Next ▶
        </button>
        <button
          onClick={goToLast}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
        >
          Last ⏭
        </button>
      </div>
    </div>
  );
};

export default ArcConsistencyVisualization;
