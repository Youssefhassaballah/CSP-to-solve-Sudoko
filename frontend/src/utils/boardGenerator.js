import { SAMPLE_BOARDS } from './constants';

export const generatePuzzle = (difficulty) => {
  return SAMPLE_BOARDS[difficulty];
};

export const createEmptyBoard = () => {
  return Array(9).fill(null).map(() => Array(9).fill(0));
};