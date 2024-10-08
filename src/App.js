import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, setUsername, resetGame, drawCardFromDeck } from './store/gameSlice';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import { Button, TextInput } from 'flowbite-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'; // Import axios for API requests
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const [usernameInput, setUsernameInput] = useState('');
  const storeUserData = async (username, points, gameProgress) => {
    try {
      await axios.post('https://go-emitrr.onrender.com/api/startGame', { username, points, gameProgress });
      toast.success('Game progress saved!', { autoClose: 3000 });
    } catch (error) {
    }
  };

  const handleStartGame = () => {
    if (usernameInput) {
      if (game.username === usernameInput) {
        toast.error('You cannot start the game with the same username!', {
          autoClose: 3000,
        });
        return;
      }
      dispatch(setUsername(usernameInput));
      dispatch(startGame(usernameInput));
      storeUserData(usernameInput, 0, {}); 
    } else {
      toast.error('Please enter your username to start the game!', {
        autoClose: 3000,
      });
    }
  };

  const handleDrawCard = () => {
    if (game.username) {
      dispatch(drawCardFromDeck(game.username));
    }
  };

  const handleRestart = () => {
    dispatch(resetGame());
    handleStartGame();
  };
  useEffect(() => {
    if (game.gameOver) {
      storeUserData(game.username, game.points, game.gameProgress);
      toast.success('Game Over! Data saved successfully.', { autoClose: 3000 });
    }
  }, [game.gameOver, game.username, game.points, game.gameProgress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-500 to-black p-4">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-white mb-8 sm:text-2xl">Exploding Kitten Game</h1>

      {!game.username ? (
        <div className="mb-4 w-full max-w-md">
          <TextInput
            placeholder="Enter your username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="rounded-lg border-2 border-white bg-teal-600 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          <Button
            color="dark"
            className="mt-2 w-full text-white hover:bg-gray-200 transition duration-200"
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </div>
      ) : (
        <Game handleDrawCard={handleDrawCard} handleRestart={handleRestart} />
      )}

      <div className="w-full max-w-4xl mt-8">
        <Leaderboard />
      </div>
    </div>
  );
};

export default App;
