import React, { useEffect } from 'react'; // Import React and useEffect for side effects
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { fetchExercises } from '../features/exercisesSlice';  // Import the action to fetch exercises

const ExerciseList = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.exercises); // Access the exercises state from Redux

  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);  // Fetch exercises when the component mounts

  if (status === 'loading') return <p>Caricamento...</p>;
  if (status === 'failed') return <p>Errore: {error}</p>;
  
  //Render the list of exercises
  return (
    <div>
      <h2>Lista Esercizi</h2>
      <ul>
        {items.slice(0, 10).map((exercise) => (
          <li key={exercise.id}>
            <strong>{exercise.name}</strong> — {exercise.bodyPart}  // Display exercise name and body part
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
