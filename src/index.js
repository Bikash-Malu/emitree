import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './store/store'; // Import the Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App with Provider and pass the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
