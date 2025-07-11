// File main che avvia l'applicazione React e gestisce le rotte

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';   // <-- Importa BrowserRouter
import store from './store';
import App from './App';
import './index.css';
import './App.css';

console.log('Store:', store);
console.log('Store.getState:', store.getState);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>  {/* Avvolgi App con BrowserRouter */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
