import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

const Statistics = ({ solveTime }) => {
  if (solveTime === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Statistics</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={18} />
          <span>Solve Time: {solveTime}ms</span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 size={18} />
          <span>Puzzle Solved!</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;