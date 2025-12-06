import React from 'react';

const ArcConsistencySteps = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Arc Consistency Steps</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div
              key={index}
              className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-sm text-gray-700 border border-indigo-100"
            >
              <span className="font-semibold text-indigo-600">Step {index + 1}:</span> {step}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Arc consistency steps will appear here when solving
          </p>
        )}
      </div>
    </div>
  );
};

export default ArcConsistencySteps;