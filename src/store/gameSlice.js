import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const cardTypes = [
  { type: 'cat', points: 3 },
  { type: 'bomb', points: -1 },
  { type: 'defuse', points: 1 }, 
  { type: 'shuffle', points: 0 },
];

const initialState = {
  username: '',
  deck: [],
  drawnCards: [],
  gameOver: false,
  message: '',
  points: 0,
  hasDefuse: false, 
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
      state.hasDefuse = false; // Reset the defuse status
    },
    drawCardFromDeck: (state, action) => {
      if (state.deck.length > 0) {
        const drawnCard = state.deck.pop();
        if (drawnCard) {
          state.drawnCards.push(drawnCard.type);

          if (drawnCard.type === 'bomb') {
            if (state.hasDefuse) {
              state.hasDefuse = false; 
              state.message = 'You drew an Exploding Kitten but defused it!';
              state.deck.splice(Math.floor(Math.random() * state.deck.length), 0, { type: 'bomb', points: 0 });
            } else {
              state.gameOver = true;
              state.message = 'Boom! You drew an Exploding Kitten without a defuse. Game over!';
            }
          } else if (drawnCard.type === 'defuse') {
            state.hasDefuse = true; 
            state.message = `You drew a Defuse card! You now have a defuse card to prevent game over.`;
          } else {
            state.points += drawnCard.points;
            state.message = `You drew a ${drawnCard.type} card! Points: ${state.points}`;
          }

          if (state.deck.length === 0 && !state.gameOver) {
            state.message = 'Congratulations! You drew all the cards!';
            state.gameOver = true;
          }
        }
      }
    },
    resetGame: (state) => {
      state.deck = [];
      state.drawnCards = [];
      state.gameOver = false;
      state.points = 0;
      state.hasDefuse = false;
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
    const res = await axios.post('https://go-emitrr.onrender.com/api/startGame', { username });
    dispatch(setDeck(res.data));
  } catch (error) {
    console.error('Error starting game:', error);
  }
};
export const drawCardFromDeckAPI = (username) => async (dispatch) => {
  try {
    const res = await axios.post('https://go-emitrr.onrender.com/api/drawCard', { username });
    if (res.data && res.data.deck) {
      dispatch(drawCard(res.data));
    } else {
      console.error('Invalid response from server. Card data is missing.');
    }
  } catch (error) {
    console.error('Error drawing card:', error);
  }
};
export const fetchLeaderboard = () => async (dispatch) => {
  try {
    const response = await axios.get('https://go-emitrr.onrender.com/api/getLeaderboard');
    dispatch(setLeaderboard(response.data)); 
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};

export default gameSlice.reducer;
