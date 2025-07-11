import { createSlice } from '@reduxjs/toolkit';
import { fakeUsers } from '../data/fakeData';

// Creazione dello slice per gestire lo stato degli utenti
const initialState = {
  isAuthenticated: false,
  userInfo: null,
  usersList: fakeUsers,
};

// Funzione per aggiungere un nuovo utente
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
