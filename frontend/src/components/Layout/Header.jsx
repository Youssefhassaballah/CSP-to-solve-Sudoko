import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-gray-800 mb-2">
        Sudoku CSP Solver
      </h1>
      <p className="text-gray-600 text-lg">
        Constraint Satisfaction Problem with Arc Consistency
      </p>
    </div>
  );
};

export default Header;