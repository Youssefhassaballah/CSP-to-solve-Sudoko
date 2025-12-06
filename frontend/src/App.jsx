import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import GamePage from './pages/GamePage';

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

  return currentPage === 'welcome' ? (
    <WelcomePage onStart={handleStart} />
  ) : (
    <GamePage 
      mode={gameConfig.mode} 
      difficulty={gameConfig.difficulty}
      onBack={handleBack}
    />
  );
};

export default App;