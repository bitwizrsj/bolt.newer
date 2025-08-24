import React from 'react';

export function Loader() {
  return (
    <div role="status" className="flex justify-center w-full py-4">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}