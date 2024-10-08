import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const cardTypes = [
  { type: 'cat', points: 1 },
  { type: 'bomb', points: -1 },
  { type: 'defuse', points: 2 },
  { type: 'shuffle', points: 0 }
]; 

const initialState = {
  username: '',
  deck: [],
  drawnCards: [],
  gameOver: false,
  message: '',
  points: 0, 
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
      const shuffledDeck = [...cardTypes].sort(() => Math.random() - 0.5);
      state.deck = shuffledDeck;
      state.drawnCards = [];
      state.gameOver = false;
      state.message = 'Game Started! Draw a card from the deck.';
      state.points = 0;
    },
    drawCardFromDeck: (state, action) => {
      if (state.deck.length > 0) {
        const drawnCard = state.deck.pop(); 
        state.drawnCards.push(drawnCard.type);
        state.points += drawnCard.points; 
        state.message = `You drew a ${drawnCard.type} card! Points: ${state.points}`;
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
      state.points = 0;
      state.message = 'Game reset!';
    },
    setDeck: (state, action) => {
      state.deck = action.payload.deck;
      state.message = action.payload.message;
      state.gameOver = action.payload.gameOver;
    },
    drawCard: (state, action) => {
      state.deck = action.payload.deck;
      state.points = action.payload.points;
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
    const res = await axios.post('http://localhost:5001/api/startGame', { username });
    dispatch(setDeck(res.data));
  } catch (error) {
    console.error('Error starting game:', error);
  }
};
export const drawCardFromDeckAPI = (username) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:5001/api/drawCard', { username });
    dispatch(drawCard(res.data));
  } catch (error) {
    console.error('Error drawing card:', error);
  }
};
export const fetchLeaderboard = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5001/api/getLeaderboard');
    dispatch(setLeaderboard(response.data)); 
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};
export default gameSlice.reducer;
