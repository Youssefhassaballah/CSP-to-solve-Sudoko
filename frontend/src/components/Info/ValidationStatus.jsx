// src/components/Info/ValidationStatus.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ValidationStatus = ({ validationState, status, message }) => {
  // Support both old API (validationState object) and new API (status + message)
  if (validationState) {
    const { isValid, hasSolution, message: stateMessage, isChecking } = validationState;

    if (isChecking) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 text-gray-700">
            <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
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
              <p className="text-sm text-red-600 mt-1">{stateMessage || 'This move creates a contradiction'}</p>
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
  }

  // New API for custom board validation
  if (!status || !message) {
    return null;
  }

  if (status === 'valid') {
    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-700">✓ Valid Board</h4>
            <p className="text-sm text-green-600 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="mt-4 bg-red-50 border border-red-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-700">✗ Invalid Board</h4>
            <p className="text-sm text-red-600 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-700">⚠ Warning</h4>
            <p className="text-sm text-yellow-600 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ValidationStatus;