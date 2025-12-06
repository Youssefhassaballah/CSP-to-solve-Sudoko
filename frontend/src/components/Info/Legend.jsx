import React from 'react';

const Legend = () => {
  const legendItems = [
    { color: 'bg-indigo-100 border-indigo-300', label: 'Initial values (from puzzle)', textColor: 'text-indigo-900' },
    { color: 'bg-emerald-100 border-emerald-300', label: 'AI solved values', textColor: 'text-emerald-800' },
    { color: 'bg-white border-red-400', label: 'Invalid moves', textColor: 'text-red-600' },
    { color: 'bg-yellow-200 border-yellow-300', label: 'Selected cell', textColor: 'text-gray-800' },
    { color: 'bg-white border-gray-300', label: 'Empty/User cells', textColor: 'text-gray-600' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Legend</h3>
      <div className="space-y-2 text-sm">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-8 h-8 ${item.color} border-2 rounded flex items-center justify-center ${item.textColor} font-bold text-sm`}>
              {index + 1}
            </div>
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;