import React, { useState, useEffect, useRef } from 'react';

const ArcConsistencySteps = ({ steps = [], currentStep = -1, isAnimating = false }) => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [modalStepData, setModalStepData] = useState(null);
  const currentStepRef = useRef(null);

  // Auto-scroll to current step during animation
  useEffect(() => {
    if (isAnimating && currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentStep, isAnimating]);

  const openBoardModal = (step, cellCoords) => {
    setModalStepData({ step, cellCoords });
    setShowBoardModal(true);
  };

  const closeBoardModal = () => {
    setShowBoardModal(false);
    setModalStepData(null);
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Arc Consistency Steps</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          Arc consistency steps will appear here when solving
        </p>
      </div>
    );
  }

  // Handle both string and object step formats
  const isStringSteps = typeof steps[0] === 'string';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Arc Consistency Steps ({steps.length})</h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {steps.map((step, index) => {
          if (isStringSteps) {
            // Old format: simple strings
            return (
              <div
                key={index}
                className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-sm text-gray-700 border border-indigo-100"
              >
                <span className="font-semibold text-indigo-600">Step {index + 1}:</span> {step}
              </div>
            );
          }

          // New format: detailed step objects with domains
          const isExpanded = expandedStep === index;
          const isFailed = step.isFailed || false; // Check if this step is from a failed consistency
          const isCellAssignment = step.is_cell_assignment || false; // Check if this step assigns a value
          const isDomainReducedToOne = !isCellAssignment && step.domain_after && step.domain_after.length === 1; // Domain reduced to 1 value
          const isCurrentStep = isAnimating && index === currentStep; // Check if this is the current animation step
          const isPastStep = isAnimating && index < currentStep; // Steps that have already played

          // Handle both tuple and array formats for cell and arc
          const cellCoords = Array.isArray(step.cell) ? step.cell : [step.cell[0], step.cell[1]];
          const arcFrom = Array.isArray(step.arc[0]) ? step.arc[0] : [step.arc[0][0], step.arc[0][1]];
          const arcTo = Array.isArray(step.arc[1]) ? step.arc[1] : [step.arc[1][0], step.arc[1][1]];

          const cellPos = `(${cellCoords[0] + 1}, ${cellCoords[1] + 1})`;
          const arcFromStr = `(${arcFrom[0] + 1}, ${arcFrom[1] + 1})`;
          const arcToStr = `(${arcTo[0] + 1}, ${arcTo[1] + 1})`;

          // Determine border and background colors based on state
          let borderColor = 'border-indigo-200';
          let bgGradient = 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100';

          if (isFailed) {
            borderColor = 'border-red-400 bg-red-50';
            bgGradient = 'bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100';
          } else if (isCurrentStep) {
            borderColor = 'border-yellow-400 bg-yellow-50 shadow-lg';
            bgGradient = 'bg-gradient-to-r from-yellow-100 to-amber-100 animate-pulse';
          } else if (isCellAssignment) {
            borderColor = 'border-green-400 bg-green-50';
            bgGradient = 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100';
          } else if (isDomainReducedToOne) {
            borderColor = 'border-blue-400 bg-blue-50';
            bgGradient = 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100';
          } else if (isPastStep) {
            bgGradient = 'bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100';
          }

          return (
            <div
              key={index}
              ref={isCurrentStep ? currentStepRef : null}
              className={`border-2 rounded-lg overflow-hidden transition-all ${borderColor}`}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : index)}
                className={`w-full p-3 text-left transition-colors ${bgGradient}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${
                        isFailed ? 'text-red-600'
                        : isCurrentStep ? 'text-yellow-700'
                        : isCellAssignment ? 'text-green-700'
                        : isDomainReducedToOne ? 'text-blue-700'
                        : 'text-indigo-600'
                      }`}>
                        Step {index + 1}:
                      </span>
                      {isFailed && (
                        <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded animate-pulse">
                          FAILED
                        </span>
                      )}
                      {isCellAssignment && !isFailed && (
                        <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-bold rounded flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Cell Assigned: {step.assigned_value}
                        </span>
                      )}
                      {isDomainReducedToOne && !isCellAssignment && !isFailed && (
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs font-bold rounded flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Domain → 1 value: {step.domain_after[0]}
                        </span>
                      )}
                      {isCurrentStep && (
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-900 text-xs font-bold rounded animate-pulse">
                          ▶ CURRENT
                        </span>
                      )}
                    </div>
                    {isCellAssignment ? (
                      <span className="text-gray-700 ml-2">
                        Assigned value <span className="font-semibold text-green-600">{step.assigned_value}</span> to cell {cellPos}
                        {step.is_backtracking && <span className="text-blue-600 font-semibold"> (via backtracking)</span>}
                      </span>
                    ) : isDomainReducedToOne ? (
                      <span className="text-gray-700 ml-2">
                        Arc {arcFromStr} → {arcToStr}: Reduced domain to single value <span className="font-semibold text-blue-600">{step.domain_after[0]}</span> for cell {cellPos}
                      </span>
                    ) : (
                      <span className="text-gray-700 ml-2">
                        Arc {arcFromStr} → {arcToStr}: Removed <span className="font-semibold text-red-600">{step.removed_values.join(', ')}</span> from cell {cellPos}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className={`p-4 border-t ${
                  isFailed ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-indigo-200'
                }`}>
                  {/* Before and After Domain Comparison for the affected cell */}
                  {step.domain_before && step.domain_after && (
                    <div className={`mb-4 p-3 bg-white rounded-lg border-2 ${
                      isFailed ? 'border-red-400' : 'border-purple-200'
                    }`}>
                      <p className="text-xs font-semibold text-gray-700 mb-3">
                        Domain Changes for Cell {cellPos}:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Before */}
                        <div className="p-3 bg-blue-50 rounded border border-blue-300">
                          <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Before:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.domain_before.sort((a, b) => a - b).map((val) => {
                              const isRemoved = step.removed_values.includes(val);
                              return (
                                <div
                                  key={val}
                                  className={`relative px-3 py-2 rounded text-sm font-bold ${
                                    isRemoved
                                      ? 'bg-red-100 text-red-700 border-2 border-red-400'
                                      : 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                                  }`}
                                >
                                  {val}
                                  {isRemoved && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* After */}
                        <div className="p-3 bg-green-50 rounded border border-green-300">
                          <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            After:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.domain_after.length > 0 ? (
                              step.domain_after.sort((a, b) => a - b).map((val) => (
                                <span
                                  key={val}
                                  className="px-3 py-2 bg-green-200 text-green-800 rounded text-sm font-bold border-2 border-green-400"
                                >
                                  {val}
                                </span>
                              ))
                            ) : (
                              <span className="px-3 py-2 bg-red-200 text-red-800 rounded text-sm font-bold border-2 border-red-400">
                                ∅ (Empty)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold text-red-600">Removed:</span>{' '}
                          {step.removed_values.sort((a, b) => a - b).join(', ')}
                          {' '}
                          <span className="text-gray-400">•</span>
                          {' '}
                          <span className="font-semibold text-gray-700">Domain reduced from {step.domain_before.length} to {step.domain_after.length} values</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Arc Domains - Show the two cells involved in the arc */}
                  {step.arc_domains && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <p className="text-xs font-semibold text-gray-700 mb-3">
                        Arc Cells Domains:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(step.arc_domains).map(([cellKey, domain]) => {
                          // Parse cell coordinates
                          const match = cellKey.match(/\((\d+),\s*(\d+)\)/);
                          const displayKey = match ? `(${parseInt(match[1]) + 1}, ${parseInt(match[2]) + 1})` : cellKey;

                          return (
                            <div key={cellKey} className="p-3 bg-white rounded border-2 border-indigo-300">
                              <p className="text-xs font-semibold text-indigo-800 mb-2">
                                Cell {displayKey}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(domain) && domain.length > 0 ? (
                                  domain.sort((a, b) => a - b).map((val) => (
                                    <span
                                      key={val}
                                      className="px-2 py-1 bg-indigo-200 text-indigo-800 rounded text-xs font-bold"
                                    >
                                      {val}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold">
                                    ∅
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Domain Board Button - opens modal (only for backtracking steps with full snapshot) */}
                  {step.domains_snapshot && Object.keys(step.domains_snapshot).length > 10 && (
                    <div className="mt-4">
                      <button
                        onClick={() => openBoardModal(step, cellCoords)}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Full Domain Board State
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Domain Board */}
      {showBoardModal && modalStepData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeBoardModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Domain Board State
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Cell ({modalStepData.cellCoords[0] + 1}, {modalStepData.cellCoords[1] + 1}) - After Arc Consistency Step
                </p>
              </div>
              <button
                onClick={closeBoardModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-gray-900 p-4 rounded-lg inline-block">
                {/* 3x3 grid of subgrids */}
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }, (_, bigRow) =>
                    Array.from({ length: 3 }, (_, bigCol) => (
                      <div key={`subgrid-${bigRow}-${bigCol}`} className="bg-gray-600 p-1 rounded">
                        <div className="grid grid-cols-3 gap-1">
                          {Array.from({ length: 3 }, (_, smallRow) =>
                            Array.from({ length: 3 }, (_, smallCol) => {
                              const rowIdx = bigRow * 3 + smallRow;
                              const colIdx = bigCol * 3 + smallCol;

                              // Get domain for this cell
                              const cellKey = `(${rowIdx}, ${colIdx})`;
                              const domain = modalStepData.step.domains_snapshot[cellKey] || [];
                              const domainSize = Array.isArray(domain) ? domain.length : 0;

                              // Check if this is the cell that was just modified
                              const isModifiedCell = modalStepData.cellCoords[0] === rowIdx && modalStepData.cellCoords[1] === colIdx;

                              // Determine cell color based on domain size
                              let bgColor = 'bg-white';
                              let textColor = 'text-gray-700';
                              let borderColor = 'border-gray-300';

                              if (domainSize === 0) {
                                bgColor = 'bg-red-200';
                                textColor = 'text-red-900';
                                borderColor = 'border-red-500';
                              } else if (domainSize === 1) {
                                bgColor = 'bg-green-200';
                                textColor = 'text-green-900';
                                borderColor = 'border-green-500';
                              } else if (domainSize <= 3) {
                                bgColor = 'bg-yellow-100';
                                textColor = 'text-yellow-900';
                                borderColor = 'border-yellow-400';
                              } else if (domainSize <= 5) {
                                bgColor = 'bg-blue-100';
                                textColor = 'text-blue-900';
                                borderColor = 'border-blue-400';
                              }

                              if (isModifiedCell) {
                                borderColor = 'border-purple-600';
                              }

                              return (
                                <div
                                  key={`${rowIdx}-${colIdx}`}
                                  className={`${bgColor} ${borderColor} ${textColor} border-2 aspect-square flex items-center justify-center text-sm font-bold rounded ${
                                    isModifiedCell ? 'ring-4 ring-purple-400 ring-offset-1' : ''
                                  }`}
                                  title={`Cell (${rowIdx + 1}, ${colIdx + 1}): ${domainSize} value${domainSize !== 1 ? 's' : ''} - ${
                                    Array.isArray(domain) ? domain.sort((a, b) => a - b).join(', ') : '∅'
                                  }`}
                                >
                                  {domainSize === 1 ? domain[0] : domainSize === 0 ? '∅' : domainSize}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 bg-white p-4 rounded-lg border-2 border-gray-300">
                  <p className="text-sm font-bold text-gray-800 mb-3">Legend:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-200 border-2 border-green-500 rounded flex items-center justify-center font-bold text-green-900">1</div>
                      <span className="text-gray-700">1 value (solved)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded flex items-center justify-center font-bold text-yellow-900">3</div>
                      <span className="text-gray-700">2-3 values</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center font-bold text-blue-900">5</div>
                      <span className="text-gray-700">4-5 values</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded flex items-center justify-center font-bold text-gray-700">7</div>
                      <span className="text-gray-700">6+ values</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-200 border-2 border-red-500 rounded flex items-center justify-center font-bold text-red-900">∅</div>
                      <span className="text-gray-700">0 values (error)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white border-2 border-purple-600 rounded ring-4 ring-purple-400 ring-offset-1 flex items-center justify-center font-bold text-gray-700">X</div>
                      <span className="text-gray-700">Modified cell</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200 flex justify-end">
              <button
                onClick={closeBoardModal}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArcConsistencySteps;