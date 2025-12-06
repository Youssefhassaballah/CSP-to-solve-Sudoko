// API service for backend communication
const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

/**
 * Validate a single move on the board
 */
export const validateMove = async (board, row, col, value) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate-move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        board, 
        row, 
        col, 
        value 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate move');
    }
    
    const data = await response.json();
    return data.isValid; // Expected: { isValid: true/false, message?: string }
  } catch (error) {
    console.error('Error validating move:', error);
    // Fallback to client-side validation if API fails
    return isValidMoveLocal(board, row, col, value);
  }
};

/**
 * Local fallback validation (used when API is unavailable)
 */
const isValidMoveLocal = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if (r !== row && c !== col && board[r][c] === num) return false;
    }
  }
  
  return true;
};

/**
 * Solve the Sudoku puzzle using CSP
 */
export const solveSudoku = async (board) => {
  // Mock implementation - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const solvedBoard = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ];
      
      const steps = [
        'Initial domains set for all empty cells',
        'Arc consistency applied to row constraints',
        'Arc consistency applied to column constraints',
        'Arc consistency applied to 3x3 box constraints',
        'Domain reduced for cell (0,2): [1,2,3,4,5,6,7,8,9] → [4]',
        'Singleton domain found, assigning value',
        'Propagating constraints...',
        'Solution found!'
      ];
      
      resolve({ board: solvedBoard, steps });
    }, 2000);
  });

  // Actual API call (uncomment when backend is ready):
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to solve puzzle');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error solving puzzle:', error);
    throw error;
  }
  */
};

/**
 * Generate a new puzzle
 */
export const generatePuzzle = async (difficulty) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate?difficulty=${difficulty}`);
    
    if (!response.ok) {
      throw new Error('Failed to generate puzzle');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating puzzle:', error);
    throw error;
  }
};

/**
 * Validate the entire board
 */
export const validateBoard = async (board) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate board');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating board:', error);
    throw error;
  }
};

