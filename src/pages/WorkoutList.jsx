import WorkoutCard from '../components/WorkoutCard';

const exercises = [
  {
    id: 1,
    name: 'Panca piana con bilanciere',
    muscle: 'Petto',
    sets: 4,
    reps: 8,
  },
  {
    id: 2,
    name: 'Panca inclinata con manubri',
    muscle: 'Petto',
    sets: 3,
    reps: 10,
  },
  {
    id: 3,
    name: 'Croci ai cavi',
    muscle: 'Petto',
    sets: 3,
    reps: 12,
  },
];

function WorkoutList() {
  return (
    <div>
      {exercises.map((exercise) => (
        <WorkoutCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}

export default WorkoutList;
