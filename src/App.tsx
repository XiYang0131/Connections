import React, { useState, useEffect } from 'react';
import { Category, Word, GameState } from './types';
import { generateGame, checkSelection, shuffleArray } from './utils/gameLogic';
import { AlertTriangle, HelpCircle, Calendar } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { categories, words, date } = generateGame();
    return {
      categories,
      words,
      selectedWords: [],
      attempts: 4,
      maxAttempts: 4,
      gameOver: false,
      mistakes: 0,
      hintsRemaining: 3,
      date
    };
  });

  const handleWordClick = (word: Word) => {
    if (gameState.gameOver) return;

    setGameState(prev => {
      const newWords = prev.words.map(w =>
        w.text === word.text ? { ...w, selected: !w.selected } : w
      );

      const newSelectedWords = newWords.filter(w => w.selected);

      if (newSelectedWords.length === 4) {
        const isCorrect = checkSelection(newSelectedWords);
        
        if (isCorrect) {
          const category = newSelectedWords[0].category;
          const newCategories = prev.categories.map(c =>
            c.name === category ? { ...c, solved: true } : c
          );

          const remainingWords = newWords.filter(w => w.category !== category);
          const unsolvedCategories = newCategories.filter(c => !c.solved);

          return {
            ...prev,
            categories: newCategories,
            words: remainingWords,
            selectedWords: [],
            gameOver: unsolvedCategories.length === 0,
            currentHint: undefined
          };
        } else {
          const newAttempts = prev.attempts - 1;
          return {
            ...prev,
            words: newWords.map(w => ({ ...w, selected: false })),
            selectedWords: [],
            attempts: newAttempts,
            mistakes: prev.mistakes + 1,
            gameOver: newAttempts === 0,
            currentHint: undefined
          };
        }
      }

      return {
        ...prev,
        words: newWords,
        selectedWords: newSelectedWords
      };
    });
  };

  const showHint = () => {
    if (gameState.hintsRemaining > 0) {
      const unsolvedCategories = gameState.categories.filter(c => !c.solved);
      if (unsolvedCategories.length > 0) {
        const randomCategory = unsolvedCategories[Math.floor(Math.random() * unsolvedCategories.length)];
        setGameState(prev => ({
          ...prev,
          hintsRemaining: prev.hintsRemaining - 1,
          currentHint: randomCategory.hint
        }));
      }
    }
  };

  const resetGame = () => {
    const { categories, words, date } = generateGame();
    setGameState({
      categories,
      words,
      selectedWords: [],
      attempts: 4,
      maxAttempts: 4,
      gameOver: false,
      mistakes: 0,
      hintsRemaining: 3,
      date
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tech Connections</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span>Daily Puzzle for {gameState.date}</span>
            </div>
            <p className="text-gray-600">
              Find groups of 4 related words. {gameState.attempts} attempts remaining.
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                onClick={showHint}
                disabled={gameState.hintsRemaining === 0 || gameState.gameOver}
                className={`flex items-center gap-1 px-3 py-1 rounded ${
                  gameState.hintsRemaining > 0 && !gameState.gameOver
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Hint ({gameState.hintsRemaining})
              </button>
            </div>
            {gameState.currentHint && (
              <div className="mt-2 text-blue-600 text-sm">
                Hint: {gameState.currentHint}
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {gameState.words.map((word, index) => (
              <button
                key={`${word.text}-${index}`}
                className={`
                  p-4 rounded-lg text-center font-medium transition-all
                  ${word.selected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
                `}
                onClick={() => handleWordClick(word)}
                disabled={gameState.gameOver}
              >
                {word.text}
              </button>
            ))}
          </div>

          {/* Solved Categories */}
          <div className="space-y-2">
            {gameState.categories
              .filter(category => category.solved)
              .map(category => (
                <div
                  key={category.name}
                  className={`${category.color} p-4 rounded-lg`}
                >
                  <h3 className="font-bold">{category.name}</h3>
                </div>
              ))}
          </div>

          {/* Game Over State */}
          {gameState.gameOver && (
            <div className="mt-6 text-center">
              <div className={`p-4 rounded-lg ${
                gameState.attempts === 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                <h2 className="text-xl font-bold mb-2">
                  {gameState.attempts === 0 ? 'Game Over!' : 'Congratulations!'}
                </h2>
                <p>
                  {gameState.attempts === 0 
                    ? 'You ran out of attempts.' 
                    : 'You found all the connections!'}
                </p>
                <p className="mt-2">Mistakes made: {gameState.mistakes}</p>
                <p className="text-sm mt-1">Come back tomorrow for a new puzzle!</p>
              </div>
            </div>
          )}

          {/* Mistakes Warning */}
          {gameState.mistakes > 0 && !gameState.gameOver && (
            <div className="mt-4 flex items-center justify-center text-yellow-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>Wrong guesses: {gameState.mistakes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;