// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  async solvePuzzle(board) {
    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to solve puzzle');
    }
    
    return response.json();
  },

  async generatePuzzle(difficulty) {
    const response = await fetch(`${API_BASE_URL}/generate?difficulty=${difficulty}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate puzzle');
    }
    
    return response.json();
  },

  async validatePuzzle(board) {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to validate puzzle');
    }
    
    return response.json();
  },

  async applyArcConsistency(board) {
    const response = await fetch(`${API_BASE_URL}/arc-consistency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to apply arc consistency');
    }
    
    return response.json();
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  async checkConsistency(board) {
    const response = await fetch(`${API_BASE_URL}/check-consistency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check consistency');
    }

    return response.json();
  }

};

// Helper function for validating custom boards
export const validateCustomBoard = async (board) => {
  try {
    const response = await apiService.validatePuzzle(board);

    // Backend returns snake_case, so check for both is_valid and isValid
    const isValidResponse = response.is_valid ?? response.isValid;
    const hasViolations = !isValidResponse;

    if (hasViolations) {
      return {
        isValid: false,
        isSolvable: false,
        message: response.message || 'Board contains Sudoku rule violations (duplicate numbers in row/column/box)'
      };
    }

    // Try to solve the board to check if it's solvable
    try {
      const solveResponse = await apiService.solvePuzzle(board);

      if (solveResponse.solved_board) {
        return {
          isValid: true,
          isSolvable: true,
          message: '✓ Board is valid and solvable! You can now solve it with CSP.'
        };
      } else {
        return {
          isValid: true,
          isSolvable: false,
          message: 'Board is valid but has no solution. Try modifying some cells.'
        };
      }
    } catch (solveError) {
      return {
        isValid: true,
        isSolvable: false,
        message: 'Board is valid but could not be solved. It may have no solution or multiple solutions.'
      };
    }
  } catch (error) {
    return {
      isValid: false,
      isSolvable: false,
      message: `Validation error: ${error.message}`
    };
  }
};
