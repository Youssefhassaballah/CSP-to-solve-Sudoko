import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
      <AlertCircle size={20} />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;