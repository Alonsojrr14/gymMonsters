"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "@/styles/exercises.module.css"
import { Dumbbell, Heart, Search, TrendingUp } from "lucide-react"
import { ExercisesService } from "@/services/exercises-service"
import type { Exercise, ExerciseFilters, PaginatedResponse } from "@/types/api-types"

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  })

  const fetchExercises = async (filters?: ExerciseFilters, page = 1) => {
    setLoading(true)
    setError(null)

    try {
      let response: PaginatedResponse<Exercise>

      if (activeTab === "favorites") {
        const favoritesData = await ExercisesService.getFavorites()
        response = {
          data: favoritesData,
          total: favoritesData.length,
          page: 1,
          limit: favoritesData.length,
          totalPages: 1,
        }
      } else {
        response = await ExercisesService.getExercises(filters, page, pagination.limit)
      }

      setExercises(response.data)
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      })
    } catch (err) {
      setError("Erro ao carregar exercícios")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filters: ExerciseFilters = {}

    if (searchQuery) {
      filters.search = searchQuery
    }

    if (activeTab !== "all" && activeTab !== "favorites") {
      filters.category = activeTab
    }

    fetchExercises(filters, 1)
  }, [activeTab, searchQuery])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // A busca já é acionada pelo useEffect quando searchQuery muda
  }

  const handleToggleFavorite = async (exercise: Exercise) => {
    try {
      if (exercise.favorite) {
        await ExercisesService.removeFromFavorites(exercise.id)
      } else {
        await ExercisesService.addToFavorites(exercise.id)
      }

      // Atualiza o estado local
      setExercises(exercises.map((ex) => (ex.id === exercise.id ? { ...ex, favorite: !ex.favorite } : ex)))
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err)
    }
  }

  // Tradução das categorias
  const categoryTranslations: Record<string, string> = {
    strength: "Força",
    cardio: "Cardio",
    flexibility: "Flexibilidade",
    all: "Todos os Exercícios",
    favorites: "Favoritos",
  }

  // Tradução dos níveis de dificuldade
  const difficultyTranslations: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  }

  // Tradução dos alvos musculares
  const targetTranslations: Record<string, string> = {
    Chest: "Peito",
    Back: "Costas",
    Legs: "Pernas",
    "Full Body": "Corpo Inteiro",
    Cardiovascular: "Cardiovascular",
    Shoulders: "Ombros",
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Biblioteca de Exercícios</h1>
          <p className={styles.subtitle}>Navegue e descubra exercícios para sua rotina de treino</p>
        </div>
        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <Search className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Buscar exercícios..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className={styles.tabs}>
        {["all", "strength", "cardio", "flexibility", "favorites"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {categoryTranslations[tab]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando exercícios...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => fetchExercises()}>
            Tentar novamente
          </button>
        </div>
      ) : exercises.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum exercício encontrado.</p>
          {searchQuery && (
            <button className={styles.clearButton} onClick={() => setSearchQuery("")}>
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.exercisesGrid}>
            {exercises.map((exercise) => (
              <div key={exercise.id} className={styles.exerciseCard}>
                <div className={styles.exerciseImageContainer}>
                  {exercise.imageUrl ? (
                    <img
                      src={exercise.imageUrl || "/placeholder.svg"}
                      alt={exercise.name}
                      className={styles.exerciseImage}
                    />
                  ) : (
                    <div className={styles.exerciseImagePlaceholder}>
                      <Dumbbell className={styles.exerciseImageIcon} />
                    </div>
                  )}
                  <button
                    className={styles.favoriteButton}
                    onClick={() => handleToggleFavorite(exercise)}
                    aria-label={exercise.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart className={`${styles.heartIcon} ${exercise.favorite ? styles.favoriteActive : ""}`} />
                  </button>
                </div>
                <div className={styles.exerciseCardHeader}>
                  <h3 className={styles.exerciseTitle}>{exercise.name}</h3>
                  <p className={styles.exerciseDetails}>
                    <span>{categoryTranslations[exercise.category]}</span>
                    <span className={styles.separator}>•</span>
                    <span>Alvo: {targetTranslations[exercise.target] || exercise.target}</span>
                  </p>
                </div>
                <div className={styles.exerciseCardContent}>
                  <div className={styles.exerciseDifficulty}>
                    <TrendingUp className={styles.difficultyIcon} />
                    <span>{difficultyTranslations[exercise.difficulty]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                disabled={pagination.page === 1}
                onClick={() => fetchExercises(undefined, pagination.page - 1)}
              >
                Anterior
              </button>
              <span className={styles.paginationInfo}>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                className={styles.paginationButton}
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchExercises(undefined, pagination.page + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
