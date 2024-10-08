import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, setUsername, resetGame, drawCardFromDeck } from './store/gameSlice';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import { Button, TextInput } from 'flowbite-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const [usernameInput, setUsernameInput] = useState('');

  // Store game data in the backend
  const storeUserData = async (username, points) => {
    try {
      await axios.post('https://go-emitrr.onrender.com/api/startGame', { username, points });
      toast.success('Game progress saved!', { autoClose: 3000 });
    } catch (error) {
      // toast.error('Failed to save game progress!', { autoClose: 3000 });
    }
  };

  // Handle starting the game
  const handleStartGame = () => {
    if (usernameInput) {
      if (game.username === usernameInput) {
        toast.error('You cannot start the game with the same username!', { autoClose: 3000 });
        return;
      }
      dispatch(setUsername(usernameInput));
      dispatch(startGame());
      storeUserData(usernameInput, 0); // Initialize points to 0 and start the game
    } else {
      toast.error('Please enter your username to start the game!', { autoClose: 3000 });
    }
  };

  // Handle drawing a card
  const handleDrawCard = async () => {
    if (game.username) {
      if (game.deck.length === 0) {
        toast.error('The deck is empty!', { autoClose: 3000 });
        return;
      }
      try {
        const response = await dispatch(drawCardFromDeck({ username: game.username, deck: game.deck }));

        // Check if the response has points and store them in the backend
        if (response.payload && response.payload.points !== undefined) {
          await storeUserData(game.username, response.payload.points); // Store updated points
        }
      } catch (error) {
        toast.error('Failed to draw card: ' + error.message, { autoClose: 3000 });
      }
    } else {
      toast.error('Please start the game first!', { autoClose: 3000 });
    }
  };

  // Handle restarting the game
  const handleRestart = () => {
    dispatch(resetGame());
    handleStartGame();
  };

  useEffect(() => {
    if (game.gameOver) {
      storeUserData(game.username, game.points); // Save final game state
      toast.success('Game Over! Data saved successfully.', { autoClose: 3000 });
    }
  }, [game.gameOver, game.username, game.points]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4 bg-no-repeat"
      style={{ backgroundImage: `url('/bakc.png')` }}
    >
      <ToastContainer />
      <h1 className="text-4xl font-bold text-white mb-8 text-center sm:text-3xl md:text-4xl shadow-lg bg-gradient-to-r from-yellow-400 to-red-900 p-4 rounded-lg">
        Exploding Kitten Game
      </h1>

      {!game.username ? (
        <div className="mb-4 w-full max-w-md px-4">
  <TextInput
    placeholder="Enter your username"
    value={usernameInput}
    onChange={(e) => setUsernameInput(e.target.value)}
    className="rounded-lg border-2 border-yellow-500 bg-teal-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 shadow-lg transition duration-200"
  />
  <Button
    outline
    gradientDuoTone="pinkToOrange"
    className="mt-2 w-full text-white bg-yellow-400 hover:bg-yellow-600 shadow-md transition duration-200"
    onClick={handleStartGame}
  >
    Start Game
  </Button>
</div>


      ) : (
        <Game handleDrawCard={handleDrawCard} handleRestart={handleRestart} />
      )}

      <div className="w-full max-w-4xl mt-8 px-4">
        <Leaderboard />
      </div>
    </div>
  );
};

export default App;
