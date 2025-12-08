import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import GamePage from './pages/GamePage';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">{this.state.error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [gameConfig, setGameConfig] = useState({ mode: 'play', difficulty: 'easy' });

  const handleStart = (mode, difficulty) => {
    setGameConfig({ mode, difficulty });
    setCurrentPage('game');
  };

  const handleBack = () => {
    setCurrentPage('welcome');
  };

  return (
    <ErrorBoundary>
      {currentPage === 'welcome' ? (
        <WelcomePage onStart={handleStart} />
      ) : (
        <GamePage 
          mode={gameConfig.mode} 
          difficulty={gameConfig.difficulty}
          onBack={handleBack}
        />
      )}
    </ErrorBoundary>
  );
};

export default App;