import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Card } from 'flowbite-react';
import { motion } from 'framer-motion';

// Card images
const cardImages = {
  bomb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzjOlx9S7-Knzk6m7Msj5hDfw7lYmD_zCcJrG398rsqdrgRKYW4JBw7YRVgLBZs1v23Q&usqp=CAU',
  defuse: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7rse5HXVBN2K3tJCIpcSZv4W8jLgaEzhH7-uB0-uaKSMvuKZXVCd9_BgyvSBRwUcoVdU&usqp=CAU',
  shuffle: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXirJ3bsSuf11UIpPCbW9maasRJ6KSOMI3yoa4OPedvqkjaMCSiezqHRCsoZxJCLaAVPg&usqp=CAU',
};

const Game = ({ handleDrawCard, handleRestart }) => {
  const game = useSelector((state) => state.game);

  return (
    <Card className="max-w-xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-teal-600 mb-4">Welcome, {game.username}!</h2>
      <p className="text-center">Points: {game.points}</p>

      {game.deck.length === 0 && game.gameOver ? (
        <p className="text-center text-green-500">Congratulations, you won! No cards left to draw.</p>
      ) : (
        <>
          <p className="mt-4 text-center text-lg">{game.message}</p>

          {game.deck.length > 0 && (
            <Button color="dark" onClick={handleDrawCard}>
              Draw Card
            </Button>
          )}

          {/* Show drawn cards */}
          {game.drawnCards.length > 0 && (
            <div className="mt-10 mx-auto relative" style={{ height: '300px', width: '100%' }}>
              <h3 className="text-lg font-semibold text-center mb-10">Drawn Cards:</h3>
              <div className="flex justify-center">
                {game.drawnCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -50, rotate: -20 }} // Start with opacity 0, move up, and rotate
                    animate={{ opacity: 1, y: 0, rotate: 0 }} // Animate to full opacity, original position, and no rotation
                    transition={{ duration: 0.6, delay: index * 0.2 }} // Staggered animations
                    className="absolute"
                    style={{
                      width: '160px',
                      height: '220px',
                      left: `${index * 20}px`, // Offset each card slightly to the right
                      zIndex: index + 1, // Ensure cards stack correctly
                      top: `${-index * 20}px`, // Move each subsequent card up by 20px
                    }}
                  >
                    <div className="p-2 border-2 border-gray-300 rounded-lg shadow-lg">
                      <img src={cardImages[card]} alt={card} className="w-full h-40 rounded-md object-cover" />
                      <p className="text-center text-sm capitalize mt-2">{card}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {game.gameOver && (
        <Button
          className="mt-4 w-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
          onClick={handleRestart}
        >
          Restart Game
        </Button>
      )}
    </Card>
  );
};

export default Game;
