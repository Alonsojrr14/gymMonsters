"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dumbbell, Plus, User, LogOut, Clock, Flame } from "lucide-react"
import { ApiService } from "@/services/api-service"
import styles from "@/styles/dashboard.module.css"
import { getLevelFromXP } from "@/lib/utils"

interface DashboardProps {
  username: string
}

interface Workout {
  duration: number
  calories: number
  photo: string | null
  exp: number
  date: string
}

export default function Dashboard({ username }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [monster, setMonster] = useState<string | null>(null)
  const [monsterImg, setMonsterImg] = useState<string | null>(null)
  const [exp, setExp] = useState(0)
  const router = useRouter()
  const apiBaseUrl = "http://localhost:3001" // URL base da API

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await ApiService.getUserData(username)
        setWorkouts(userData.workouts || [])
        setMonster(userData.monster)
        setMonsterImg(userData.monsterImg)
        setExp(userData.exp)
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    localStorage.removeItem("monster")
    localStorage.removeItem("monsterImg")
    localStorage.removeItem("hasCompletedOnboarding")
    router.push("/login")
  }

  const handleAddWorkout = () => {
    router.push("/add-workout")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Dumbbell className={styles.logoIcon} />
          <span>GymMonsters</span>
        </div>

        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <User className={styles.userIcon} />
            <span>{username}</span>
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut className={styles.logoutIcon} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeInfo}>
                <h1 className={styles.welcomeTitle}>Olá, {username}!</h1>
                <p className={styles.welcomeSubtitle}>
                  {workouts.length > 0
                    ? "Continue sua jornada fitness com seus GymMonsters!"
                    : "Vamos começar sua jornada fitness com GymMonsters!"}
                </p>
                <div className={styles.expInfo}>
                  <span className={styles.expLabel}>XP Total:</span>
                  <span className={styles.expValue}>{exp}</span>
                  <span className={styles.expLabel} style={{marginLeft: '1rem'}}>Nível:</span>
                  <span className={styles.expValue}>{getLevelFromXP(exp)}</span>
                </div>
              </div>

              {monsterImg && (
                <div className={styles.monsterPreviewLarge}>
                  <img
                    src={`${apiBaseUrl}${monsterImg}`}
                    alt={monster || "Seu GymMonster"}
                    className={styles.monsterImageLarge}
                  />
                  <p className={styles.monsterName}>{monster}</p>
                </div>
              )}
            </div>

            <h2 className={styles.sectionTitle}>Seus Treinos</h2>

            {workouts.length > 0 ? (
              <div className={styles.workoutsGrid}>
                {workouts.map((workout, index) => (
                  <div key={index} className={styles.workoutCard}>
                    <div className={styles.workoutHeader}>
                      <h3>Treino {index + 1}</h3>
                      <span className={styles.workoutDate}>{formatDate(workout.date)}</span>
                    </div>
                    <div className={styles.workoutBody}>
                      <div className={styles.workoutStats}>
                        <div className={styles.workoutStat}>
                          <Clock className={styles.statIcon} />
                          <span>{workout.duration} min</span>
                        </div>
                        <div className={styles.workoutStat}>
                          <Flame className={styles.statIcon} />
                          <span>{workout.calories} cal</span>
                        </div>
                      </div>
                      <div className={styles.workoutExp}>
                        <span>+{workout.exp} XP</span>
                      </div>
                    </div>
                    {workout.photo && (
                      <div className={styles.workoutPhoto}>
                        <img
                          src={`${apiBaseUrl}${workout.photo}`}
                          alt="Foto do treino"
                          className={styles.workoutImage}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className={styles.addWorkoutCard} onClick={handleAddWorkout}>
                  <Plus className={styles.addIcon} />
                  <p>Adicionar novo treino</p>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <Dumbbell className={styles.dumbbellIcon} />
                </div>
                <h2 className={styles.emptyStateTitle}>Nenhum treino encontrado</h2>
                <p className={styles.emptyStateDescription}>
                  Adicione seu primeiro treino para começar a evoluir seus GymMonsters!
                </p>
                <button className={styles.addWorkoutButton} onClick={handleAddWorkout}>
                  <Plus className={styles.addIcon} />
                  Adicionar meu primeiro treino
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2023 GymMonsters. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
