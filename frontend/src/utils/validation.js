// src/utils/validation.js (updated with more functions)
export const isValidMove = (board, row, col, value) => {
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

export const isBoardComplete = (board) => {
  return board.every(row => row.every(cell => cell !== 0));
};

export const validateBoard = (board) => {
  const errors = [];

  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) {
          errors.push(`Row ${row + 1} has duplicate ${value}`);
        }
        seen.add(value);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) {
          errors.push(`Column ${col + 1} has duplicate ${value}`);
        }
        seen.add(value);
      }
    }
  }

  // Check subgrids
  for (let gridRow = 0; gridRow < 3; gridRow++) {
    for (let gridCol = 0; gridCol < 3; gridCol++) {
      const seen = new Set();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const row = gridRow * 3 + r;
          const col = gridCol * 3 + c;
          const value = board[row][col];
          if (value !== 0) {
            if (seen.has(value)) {
              errors.push(`Subgrid (${gridRow + 1}, ${gridCol + 1}) has duplicate ${value}`);
            }
            seen.add(value);
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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

// Calculate score based on move quality
export const calculateMoveScore = (board, row, col, value, difficulty) => {
  let baseScore = 10;
  
  // Bonus for correct move that doesn't create conflicts
  const conflicts = findConflictingCells(board, row, col, value);
  if (conflicts.length === 0) {
    baseScore += 20;
  }
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };
  
  return Math.round(baseScore * difficultyMultiplier[difficulty]);
};