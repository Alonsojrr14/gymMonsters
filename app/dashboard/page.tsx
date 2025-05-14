"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { WorkoutsService } from "@/services/workouts-service"
import { ProgressService } from "@/services/progress-service"
import type { Workout, UserStats } from "@/types/api-types"
import styles from "@/styles/dashboard.module.css"
import { Dumbbell, Calendar, Clock, Plus, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workoutsData, statsData] = await Promise.all([
          WorkoutsService.getRecentWorkouts(3),
          ProgressService.getUserStats("month"),
        ])

        setRecentWorkouts(workoutsData)
        setStats(statsData)
      } catch (err) {
        setError("Erro ao carregar dados do dashboard")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Bem-vindo de volta, {user?.username}</p>
          </div>
          <Link href="/workouts/new" className={styles.createButton}>
            <Plus className={styles.buttonIcon} /> Novo Treino
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando dados...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Dumbbell />
                </div>
                <div className={styles.statContent}>
                  <h3 className={styles.statTitle}>Treinos Completados</h3>
                  <p className={styles.statValue}>{stats?.totalWorkouts || 0}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <BarChart3 />
                </div>
                <div className={styles.statContent}>
                  <h3 className={styles.statTitle}>Peso Total Levantado</h3>
                  <p className={styles.statValue}>{stats?.totalWeight || 0} kg</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Clock />
                </div>
                <div className={styles.statContent}>
                  <h3 className={styles.statTitle}>Tempo Total</h3>
                  <p className={styles.statValue}>{stats?.totalDuration || 0} min</p>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Treinos Recentes</h2>
                <Link href="/workouts" className={styles.sectionLink}>
                  Ver todos
                </Link>
              </div>

              <div className={styles.workoutsGrid}>
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map((workout) => (
                    <div key={workout.id} className={styles.workoutCard}>
                      <div className={styles.workoutCardHeader}>
                        <h3 className={styles.workoutTitle}>{workout.name}</h3>
                        <p className={styles.workoutDescription}>{workout.description}</p>
                      </div>
                      <div className={styles.workoutCardContent}>
                        <div className={styles.workoutStats}>
                          <div className={styles.workoutStat}>
                            <Dumbbell className={styles.statIcon} />
                            <span>{workout.exercises.length} exercícios</span>
                          </div>
                          <div className={styles.workoutStat}>
                            <Clock className={styles.statIcon} />
                            <span>{workout.duration} min</span>
                          </div>
                        </div>
                        {workout.lastPerformed && (
                          <div className={styles.lastPerformed}>
                            <Calendar className={styles.calendarIcon} />
                            <span>Último treino: {new Date(workout.lastPerformed).toLocaleDateString("pt-BR")}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.workoutCardFooter}>
                        <Link href={`/workouts/${workout.id}`} className={styles.viewButton}>
                          Visualizar
                        </Link>
                        <Link href={`/workouts/${workout.id}/start`} className={styles.startButton}>
                          Iniciar Treino
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Você ainda não tem treinos. Crie seu primeiro treino agora!</p>
                    <Link href="/workouts/new" className={styles.createButton}>
                      <Plus className={styles.buttonIcon} /> Criar Treino
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
