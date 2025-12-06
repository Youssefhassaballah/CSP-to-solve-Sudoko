// src/utils/basicValidation.js
export const isValidMove = (board, row, col, value) => {
  if (value === 0) return true;
  
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === value) {
        return false;
      }
    }
  }

  return true;
};

export const findConflictingCells = (board, row, col, value) => {
  const conflicts = [];

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) {
      conflicts.push({ row, col: c, reason: 'row' });
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) {
      conflicts.push({ row: r, col, reason: 'column' });
    }
  }

  // Check subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === value) {
        conflicts.push({ row: r, col: c, reason: 'subgrid' });
      }
    }
  }

  return conflicts;
};