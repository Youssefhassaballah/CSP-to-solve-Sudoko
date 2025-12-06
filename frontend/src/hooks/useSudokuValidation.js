// src/hooks/useSudokuValidation.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

const useSudokuValidation = () => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    message: '',
    invalidCells: [],
    contradictingCells: [],
    hasSolution: true,
    isChecking: false
  });

  const checkMoveConsistency = useCallback(async (board, row, col, value) => {
    setValidationState(prev => ({ ...prev, isChecking: true }));
    
    try {
      const result = await apiService.checkConsistency(board);
      
      const invalidCells = result.invalid_cells || [];
      const isCellInvalid = invalidCells.some(([r, c]) => r === row && c === col);
      
      setValidationState({
        isValid: result.has_solution,
        message: result.message,
        invalidCells: invalidCells,
        contradictingCells: result.contradicting_cells || [],
        hasSolution: result.has_solution,
        isChecking: false
      });
      
      return {
        isConsistent: result.has_solution,
        isCellInvalid: isCellInvalid,
        message: result.message
      };
    } catch (err) {
      console.error('Consistency check error:', err);
      setValidationState(prev => ({ ...prev, isChecking: false }));
      return {
        isConsistent: true,
        isCellInvalid: false,
        message: 'Could not verify consistency'
      };
    }
  }, []);

  const validateBoard = useCallback(async (board) => {
    setValidationState(prev => ({ ...prev, isChecking: true }));
    
    try {
      const result = await apiService.validatePuzzle(board);
      
      if (!result.is_valid) {
        setValidationState({
          isValid: false,
          message: result.message,
          invalidCells: [],
          contradictingCells: [],
          hasSolution: false,
          isChecking: false
        });
      }
      
      return result.is_valid;
    } catch (err) {
      console.error('Validation error:', err);
      setValidationState(prev => ({ ...prev, isChecking: false }));
      return false;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: true,
      message: '',
      invalidCells: [],
      contradictingCells: [],
      hasSolution: true,
      isChecking: false
    });
  }, []);

  return {
    validationState,
    checkMoveConsistency,
    validateBoard,
    resetValidation
  };
};

export default useSudokuValidation;