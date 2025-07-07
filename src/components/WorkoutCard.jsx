function WorkoutCard({ exercise }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
      <h3>{exercise.name}</h3>
      <p>Muscolo: {exercise.muscle}</p>
      <p>Serie: {exercise.sets} × Ripetizioni: {exercise.reps}</p>
    </div>
  );
}

export default WorkoutCard;
