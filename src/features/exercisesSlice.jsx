import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Importazione delle librerie necessarie per la creazione dello slice e delle azioni asincrone
export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async () => {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '49fbbf0055msh9df73f1aa9621e9p1b4392jsn3',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    const data = await response.json();
    return data;
  }
);

// Creazione dello slice per gestire lo stato degli esercizi
const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default exercisesSlice.reducer;
