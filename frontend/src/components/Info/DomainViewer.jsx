import React from 'react';

const DomainViewer = ({ selectedCell, domains, board }) => {
  if (!selectedCell) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Cell Domain</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          Select a cell to view its possible values (domain)
        </p>
      </div>
    );
  }

  const { row, col } = selectedCell;
  const cellValue = board[row][col];
  
  // Try multiple key formats to find the domain
  let cellDomain = [];
  if (domains && cellValue === 0) {
    // Only look for domain if cell is empty
    // Try format with space: "(row, col)"
    let cellKey = `(${row}, ${col})`;
    if (domains[cellKey]) {
      cellDomain = domains[cellKey];
    } else {
      // Try format without space: "(row,col)"
      cellKey = `(${row},${col})`;
      if (domains[cellKey]) {
        cellDomain = domains[cellKey];
      } else {
        // Try array format: [row, col]
        cellKey = `[${row}, ${col}]`;
        if (domains[cellKey]) {
          cellDomain = domains[cellKey];
        }
      }
    }
  }
  
  // Ensure it's an array
  if (!Array.isArray(cellDomain)) {
    cellDomain = Object.values(cellDomain || {});
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Cell Domain - ({row + 1}, {col + 1})
      </h3>

      <div className="space-y-4">
        {/* Current Value */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Current Value:</p>
          <div className="flex items-center justify-center h-16 w-16 mx-auto bg-indigo-100 rounded-lg border-2 border-indigo-300">
            <span className="text-2xl font-bold text-indigo-900">
              {cellValue !== 0 ? cellValue : '—'}
            </span>
          </div>
        </div>

        {/* Domain */}
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Possible Values {cellValue === 0 && cellDomain.length > 0 && `(${cellDomain.length})`}:
          </p>

          {cellValue !== 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              Cell is already filled
            </p>
          ) : cellDomain && cellDomain.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {cellDomain.sort((a, b) => a - b).map((value) => (
                <div
                  key={value}
                  className="flex items-center justify-center h-10 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-all"
                >
                  <span className="text-lg font-semibold text-purple-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-red-700">
                  No valid values available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Domain Info */}
        {cellValue === 0 && cellDomain.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              These values don't violate any constraints (row, column, or 3×3 box) for this cell.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainViewer;
