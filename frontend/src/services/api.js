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
    // Use check-consistency endpoint which returns domains
    const consistencyResponse = await apiService.checkConsistency(board);

    if (!consistencyResponse.has_solution) {
      return {
        isValid: consistencyResponse.invalid_cells && consistencyResponse.invalid_cells.length === 0,
        isSolvable: false,
        message: consistencyResponse.message || 'Board has no solution',
        domains: consistencyResponse.domains || {},
        arcConsistencySteps: consistencyResponse.arc_consistency_steps || []
      };
    }

    return {
      isValid: true,
      isSolvable: true,
      message: '✓ Board is valid and solvable! You can now solve it with CSP.',
      domains: consistencyResponse.domains || {},
      arcConsistencySteps: consistencyResponse.arc_consistency_steps || []
    };
  } catch (error) {
    return {
      isValid: false,
      isSolvable: false,
      message: `Validation error: ${error.message}`,
      domains: {},
      arcConsistencySteps: []
    };
  }
};
