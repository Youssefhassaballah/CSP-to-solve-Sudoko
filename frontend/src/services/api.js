// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

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
