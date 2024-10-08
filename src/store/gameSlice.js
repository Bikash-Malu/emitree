// gameSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const cardTypes = ['cat', 'bomb', 'defuse', 'shuffle']; // Card types

const initialState = {
  username: '',
  deck: [],
  drawnCards: [],
  gameOver: false,
  message: '',
  leaderboard: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    startGame: (state) => {
      // Randomly shuffle the deck
      const shuffledDeck = [...cardTypes].sort(() => Math.random() - 0.5);
      state.deck = shuffledDeck;
      state.drawnCards = [];
      state.gameOver = false;
      state.message = 'Game Started! Draw a card from the deck.';
    },
    drawCardFromDeck: (state) => {
      if (state.deck.length > 0) {
        const drawnCard = state.deck.pop(); // Remove the top card from the deck
        state.drawnCards.push(drawnCard);
        state.message = `You drew a ${drawnCard} card!`;

        if (state.deck.length === 0) {
          state.gameOver = true;
          state.message = 'Congratulations! You drew all the cards!';
        }
      }
    },
    resetGame: (state) => {
      state.deck = [];
      state.drawnCards = [];
      state.gameOver = false;
      state.message = 'Game reset!';
    },
    setDeck: (state, action) => {
      state.deck = action.payload.deck;
      state.message = action.payload.message;
      state.gameOver = action.payload.gameOver;
    },
    drawCard: (state, action) => {
      state.deck = action.payload.deck;
      state.message = action.payload.message;
      state.gameOver = action.payload.gameOver;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
  },
});

export const { 
  setUsername, 
  startGame, 
  drawCardFromDeck, 
  resetGame, 
  setDeck, 
  drawCard, 
  setLeaderboard 
} = gameSlice.actions;
export const startGameAPI = (username) => async (dispatch) => {
  try {
    const res = await axios.post('https://go-emitrr.onrender.com/api/startGame', { username });
    dispatch(setDeck(res.data)); // Use data from API to initialize the game
  } catch (error) {
    console.error('Error starting game:', error);
  }
};
export const drawCardFromDeckAPI = (username) => async (dispatch) => {
  try {
    const res = await axios.post('https://go-emitrr.onrender.com/api/drawCard', { username });
    dispatch(drawCard(res.data)); // Update state with the drawn card
  } catch (error) {
    console.error('Error drawing card:', error);
  }
};
export const fetchLeaderboard = () => async (dispatch) => {
  try {
    const response = await axios.get('https://go-emitrr.onrender.com/api/getLeaderboard');
    dispatch(setLeaderboard(response.data)); // Update leaderboard state
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};

export default gameSlice.reducer;
