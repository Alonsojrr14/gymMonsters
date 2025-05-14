import Link from "next/link"
import styles from "@/styles/workouts.module.css"
import { Calendar, Clock, Dumbbell, Plus } from "lucide-react"

export default function WorkoutsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Meus Treinos</h1>
          <p className={styles.subtitle}>Gerencie e acompanhe suas rotinas de treino</p>
        </div>
        <button className={styles.createButton}>
          <Plus className={styles.buttonIcon} /> Criar Treino
        </button>
      </div>

      <div className={styles.workoutsGrid}>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  )
}

interface Workout {
  id: string
  name: string
  description: string
  exercises: number
  duration: number
  lastPerformed?: string
}

interface WorkoutCardProps {
  workout: Workout
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className={styles.workoutCard}>
      <div className={styles.workoutCardHeader}>
        <h3 className={styles.workoutTitle}>{workout.name}</h3>
        <p className={styles.workoutDescription}>{workout.description}</p>
      </div>
      <div className={styles.workoutCardContent}>
        <div className={styles.workoutStats}>
          <div className={styles.workoutStat}>
            <Dumbbell className={styles.statIcon} />
            <span>{workout.exercises} exercícios</span>
          </div>
          <div className={styles.workoutStat}>
            <Clock className={styles.statIcon} />
            <span>{workout.duration} min</span>
          </div>
        </div>
        {workout.lastPerformed && (
          <div className={styles.lastPerformed}>
            <Calendar className={styles.calendarIcon} />
            <span>Último treino: {workout.lastPerformed}</span>
          </div>
        )}
      </div>
      <div className={styles.workoutCardFooter}>
        <Link href={`/workouts/${workout.id}`} className={styles.viewButton}>
          Visualizar
        </Link>
        <button className={styles.startButton}>Iniciar Treino</button>
      </div>
    </div>
  )
}

// Dados de exemplo de treinos
const workouts: Workout[] = [
  {
    id: "1",
    name: "Treino de Força Superior",
    description: "Foco em peito, ombros e tríceps",
    exercises: 6,
    duration: 45,
    lastPerformed: "2 dias atrás",
  },
  {
    id: "2",
    name: "Treino de Potência Inferior",
    description: "Agachamentos, afundos e variações de leg press",
    exercises: 5,
    duration: 50,
    lastPerformed: "5 dias atrás",
  },
  {
    id: "3",
    name: "HIIT Corpo Inteiro",
    description: "Treinamento intervalado de alta intensidade para o corpo todo",
    exercises: 8,
    duration: 30,
    lastPerformed: "1 semana atrás",
  },
  {
    id: "4",
    name: "Destruidor de Core",
    description: "Treino focado em abdominais e lombar",
    exercises: 7,
    duration: 25,
  },
  {
    id: "5",
    name: "Costas e Bíceps",
    description: "Treino de parte superior do corpo com foco em puxadas",
    exercises: 6,
    duration: 40,
    lastPerformed: "3 dias atrás",
  },
]
