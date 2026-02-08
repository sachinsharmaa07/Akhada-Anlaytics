import { create } from 'zustand';

const useWorkoutStore = create((set) => ({
  workouts: [],
  personalRecords: [],
  muscleIntensity: null,
  currentWorkout: [],
  loading: false,
  setWorkouts: (workouts) => set({ workouts }),
  setPersonalRecords: (personalRecords) => set({ personalRecords }),
  setMuscleIntensity: (muscleIntensity) => set({ muscleIntensity }),
  setCurrentWorkout: (exercises) => set({ currentWorkout: exercises }),
  addExerciseToCurrentWorkout: (exercise) => set((state) => ({ currentWorkout: [...state.currentWorkout, exercise] })),
  updateSetInCurrentWorkout: (exerciseIndex, setIndex, updatedSet) => set((state) => {
    const newWorkout = [...state.currentWorkout];
    newWorkout[exerciseIndex] = {
      ...newWorkout[exerciseIndex],
      sets: newWorkout[exerciseIndex].sets.map((s, i) => i === setIndex ? { ...s, ...updatedSet } : s)
    };
    return { currentWorkout: newWorkout };
  }),
  resetCurrentWorkout: () => set({ currentWorkout: [] }),
  setLoading: (loading) => set({ loading }),
}));

export default useWorkoutStore;
