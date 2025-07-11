//store per la gestione dello stato dell'applicazione React
// Importa le librerie necessarie per la creazione dello store
// Importa i reducer degli slice

import { configureStore } from '@reduxjs/toolkit'; // Importa configureStore da Redux Toolkit
import userReducer from './features/userSlice';
import exercisesReducer from './features/exercisesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    exercises: exercisesReducer,
  },
});

export default store;
