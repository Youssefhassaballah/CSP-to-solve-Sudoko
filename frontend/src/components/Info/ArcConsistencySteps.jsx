import React, { useState } from 'react';

const ArcConsistencySteps = ({ steps = [] }) => {
  const [expandedStep, setExpandedStep] = useState(null);

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
          
          // Handle both tuple and array formats for cell and arc
          const cellCoords = Array.isArray(step.cell) ? step.cell : [step.cell[0], step.cell[1]];
          const arcFrom = Array.isArray(step.arc[0]) ? step.arc[0] : [step.arc[0][0], step.arc[0][1]];
          const arcTo = Array.isArray(step.arc[1]) ? step.arc[1] : [step.arc[1][0], step.arc[1][1]];
          
          const cellPos = `(${cellCoords[0] + 1}, ${cellCoords[1] + 1})`;
          const arcFromStr = `(${arcFrom[0] + 1}, ${arcFrom[1] + 1})`;
          const arcToStr = `(${arcTo[0] + 1}, ${arcTo[1] + 1})`;

          return (
            <div key={index} className="border border-indigo-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedStep(isExpanded ? null : index)}
                className="w-full p-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-left transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-semibold text-indigo-600">Step {index + 1}:</span>
                    <span className="text-gray-700 ml-2">
                      Arc {arcFromStr} → {arcToStr}: Removed <span className="font-semibold text-red-600">{step.removed_values.join(', ')}</span> from cell {cellPos}
                    </span>
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

              {isExpanded && step.domains_snapshot && (
                <div className="p-4 bg-gray-50 border-t border-indigo-200">
                  <p className="text-xs font-semibold text-gray-600 mb-3">Domain State After This Step:</p>
                  <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {Object.entries(step.domains_snapshot)
                      .sort((a, b) => {
                        // Extract row and col from string key like "(0, 1)"
                        const aMatch = a[0].match(/\((\d+),\s*(\d+)\)/);
                        const bMatch = b[0].match(/\((\d+),\s*(\d+)\)/);
                        if (!aMatch || !bMatch) return 0;
                        const aRow = parseInt(aMatch[1]);
                        const bRow = parseInt(bMatch[1]);
                        const aCol = parseInt(aMatch[2]);
                        const bCol = parseInt(bMatch[2]);
                        return aRow !== bRow ? aRow - bRow : aCol - bCol;
                      })
                      .map(([cellKey, domain]) => (
                        <div key={cellKey} className="p-2 bg-white rounded border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">{cellKey}</p>
                          <p className="text-xs text-gray-600">
                            {Array.isArray(domain) && domain.length > 0
                              ? domain.sort((a, b) => a - b).join(', ')
                              : '∅'}
                          </p>
                        </div>
                      ))}
                  </div>
                  {step.remaining_domain && (
                    <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      <span className="font-semibold">Remaining domain of {cellPos}:</span> {step.remaining_domain.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArcConsistencySteps;