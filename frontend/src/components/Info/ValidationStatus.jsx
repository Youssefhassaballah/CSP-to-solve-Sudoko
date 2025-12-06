// src/components/Info/ValidationStatus.jsx
import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ValidationStatus = ({ validationState }) => {
  const { isValid, hasSolution, message, isChecking } = validationState;

  if (isChecking) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm">Checking consistency...</span>
        </div>
      </div>
    );
  }

  if (!hasSolution) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-700">Inconsistent State</h4>
            <p className="text-sm text-red-600 mt-1">{message || 'This move creates a contradiction'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-700">Board is Consistent</h4>
            <p className="text-sm text-green-600 mt-1">All moves maintain a valid solution</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ValidationStatus;