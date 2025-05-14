// Tipos para autenticação
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

// Tipos para exercícios
export interface Exercise {
  id: string
  name: string
  description: string
  category: "strength" | "cardio" | "flexibility"
  target: string
  difficulty: "beginner" | "intermediate" | "advanced"
  instructions: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ExerciseFilters {
  category?: string
  target?: string
  difficulty?: string
  search?: string
}

// Tipos para treinos
export interface Workout {
  id: string
  name: string
  description: string
  exercises: WorkoutExercise[]
  duration: number
  userId: string
  createdAt: string
  updatedAt: string
  lastPerformed?: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  exercise: Exercise
  sets: number
  reps: number
  weight?: number
  duration?: number
  rest: number
  notes?: string
}

export interface CreateWorkoutData {
  name: string
  description: string
  exercises: Omit<WorkoutExercise, "id" | "exercise">[]
}

// Tipos para progresso
export interface ProgressEntry {
  id: string
  userId: string
  workoutId: string
  workout: Workout
  date: string
  duration: number
  exercises: ProgressExercise[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ProgressExercise {
  id: string
  exerciseId: string
  exercise: Exercise
  sets: ProgressSet[]
}

export interface ProgressSet {
  id: string
  reps: number
  weight?: number
  duration?: number
  completed: boolean
}

export interface CreateProgressData {
  workoutId: string
  date: string
  duration: number
  exercises: {
    exerciseId: string
    sets: Omit<ProgressSet, "id">[]
  }[]
  notes?: string
}

// Tipos para estatísticas
export interface UserStats {
  totalWorkouts: number
  totalWeight: number
  totalDuration: number
  personalRecords: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
