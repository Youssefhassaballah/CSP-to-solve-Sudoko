import React from 'react';

const AllBoardDomains = ({ domains, board }) => {
  // Helper function to get domain for a specific cell
  const getCellDomain = (row, col) => {
    if (!domains) return [];

    // If cell already has a value, it has no domain (or domain is just that value)
    if (board[row][col] !== 0) {
      return [board[row][col]];
    }

    // Try multiple key formats to find the domain
    let cellKey = `(${row}, ${col})`;
    if (domains[cellKey]) {
      return Array.isArray(domains[cellKey]) ? domains[cellKey] : Object.values(domains[cellKey]);
    }

    cellKey = `(${row},${col})`;
    if (domains[cellKey]) {
      return Array.isArray(domains[cellKey]) ? domains[cellKey] : Object.values(domains[cellKey]);
    }

    cellKey = `[${row}, ${col}]`;
    if (domains[cellKey]) {
      return Array.isArray(domains[cellKey]) ? domains[cellKey] : Object.values(domains[cellKey]);
    }

    return [];
  };

  // Check if there are any empty domains (unsolvable state)
  const emptyDomainCells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const domain = getCellDomain(row, col);
      if (board[row][col] === 0 && domain.length === 0) {
        emptyDomainCells.push({ row: row + 1, col: col + 1 });
      }
    }
  }
  const hasEmptyDomains = emptyDomainCells.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        All Cell Domains
      </h3>

      {/* Warning Banner for Empty Domains */}
      {hasEmptyDomains && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-400 rounded-xl animate-pulse">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 mb-1">⚠️ UNSOLVABLE STATE DETECTED!</h4>
              <p className="text-sm text-red-800 mb-2">
                The following cells have no valid domain values (shown in red below). The puzzle cannot be solved from this state.
              </p>
              <div className="flex flex-wrap gap-2">
                {emptyDomainCells.map((cell, idx) => (
                  <span key={idx} className="px-2 py-1 bg-red-200 text-red-900 rounded font-semibold text-xs">
                    Cell ({cell.row}, {cell.col})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Domain Grid */}
          <div className="grid grid-cols-9 gap-1">
            {board.map((row, rowIndex) => (
              row.map((cellValue, colIndex) => {
                const domain = getCellDomain(rowIndex, colIndex);
                const isFilled = cellValue !== 0;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      relative border-2 rounded-lg p-2 min-h-[80px] flex flex-col items-center justify-center
                      transition-all
                      ${isFilled
                        ? 'bg-indigo-50 border-indigo-300'
                        : domain.length === 0
                          ? 'bg-red-50 border-red-300'
                          : domain.length === 1
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-300'
                      }
                      ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-4 border-r-gray-800' : ''}
                      ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-4 border-b-gray-800' : ''}
                    `}
                  >
                    {/* Cell Position Label */}
                    <div className="absolute top-0 left-1 text-[8px] text-gray-400 font-mono">
                      {rowIndex + 1},{colIndex + 1}
                    </div>

                    {/* Cell Value or Domain */}
                    {isFilled ? (
                      <div className="text-xl font-bold text-indigo-900">
                        {cellValue}
                      </div>
                    ) : domain.length === 0 ? (
                      <div className="text-lg text-red-600 font-bold">
                        ∅
                      </div>
                    ) : domain.length === 1 ? (
                      <div className="text-2xl font-bold text-green-700">
                        {domain[0]}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-0.5 w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                          const isInDomain = domain.includes(num);
                          return (
                            <div
                              key={num}
                              className={`
                                text-[9px] font-bold text-center
                                ${isInDomain
                                  ? 'text-purple-700'
                                  : 'text-gray-300 line-through'
                                }
                              `}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Domain Count Badge */}
                    {!isFilled && domain.length > 1 && (
                      <div className="absolute bottom-0 right-1 text-[8px] bg-purple-200 text-purple-800 px-1 rounded">
                        {domain.length}
                      </div>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-50 border-2 border-indigo-300 rounded"></div>
            <span className="text-gray-600">Filled Cell</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded"></div>
            <span className="text-gray-600">Single Domain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">Multiple Domains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded"></div>
            <span className="text-gray-600">No Valid Domain</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Domain:</strong> The set of possible values for each empty cell based on current constraints.
          Numbers shown are values that don't violate row, column, or 3×3 box constraints.
        </p>
      </div>
    </div>
  );
};

export default AllBoardDomains;
