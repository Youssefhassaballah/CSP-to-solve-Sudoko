import React from 'react';

const Legend = () => {
  const legendItems = [
    { color: 'bg-blue-50 border-blue-200', label: 'Initial values' },
    { color: 'bg-yellow-200 border-yellow-300', label: 'Selected cell' },
    { color: 'bg-green-50 border-green-200', label: 'Solved values' },
    { color: 'bg-white border-gray-300', label: 'Empty cells' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Legend</h3>
      <div className="space-y-2 text-sm">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-6 h-6 ${item.color} border rounded`}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;