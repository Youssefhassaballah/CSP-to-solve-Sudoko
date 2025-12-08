import React from 'react';

const SolverControls = ({
  onSolve,
  onSolveAnimated,
  isAnimating,
  isPaused,
  onPause,
  onResume,
  onStop,
  animationSpeed,
  onSpeedChange,
  solving,
  solved,
  currentStep,
  totalSteps
}) => {
  const speedOptions = [
    { label: 'Very Slow', value: 2000, icon: '🐌' },
    { label: 'Slow', value: 1000, icon: '🚶' },
    { label: 'Normal', value: 500, icon: '🏃' },
    { label: 'Fast', value: 250, icon: '🏎️' },
    { label: 'Very Fast', value: 100, icon: '⚡' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Solver
      </h3>

      {!isAnimating && !solved && (
        <div className="space-y-3">
          <button
            onClick={onSolve}
            disabled={solving}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Solve Instantly
          </button>

          <button
            onClick={onSolveAnimated}
            disabled={solving}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch AI Solve
          </button>
        </div>
      )}

      {isAnimating && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">Progress</span>
              <span className="text-sm font-bold text-blue-700">
                {currentStep} / {totalSteps} steps
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex gap-2">
            {!isPaused ? (
              <button
                onClick={onPause}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume
              </button>
            )}

            <button
              onClick={onStop}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
              Stop
            </button>
          </div>

          {/* Speed Control */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Animation Speed
            </label>
            <div className="grid grid-cols-5 gap-1">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSpeedChange(option.value)}
                  className={`p-2 rounded text-xs font-semibold transition-all ${
                    animationSpeed === option.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-indigo-100'
                  }`}
                  title={option.label}
                >
                  <div className="text-lg">{option.icon}</div>
                  <div className="text-[9px] mt-1">{option.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolverControls;
