import { api } from "./api"
import type { Exercise, ExerciseFilters, PaginatedResponse, ApiResponse } from "@/types/api-types"

/**
 * Serviço para gerenciar exercícios
 */
export const ExercisesService = {
  /**
   * Obtém todos os exercícios com filtros opcionais
   * @param filters Filtros para os exercícios
   * @param page Número da página
   * @param limit Limite de itens por página
   * @returns Lista paginada de exercícios
   */
  getExercises: async (filters?: ExerciseFilters, page = 1, limit = 10): Promise<PaginatedResponse<Exercise>> => {
    // Constrói a query string com os filtros
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value)
        }
      })
    }

    return api.get<PaginatedResponse<Exercise>>(`/exercises?${queryParams.toString()}`)
  },

  /**
   * Obtém um exercício pelo ID
   * @param id ID do exercício
   * @returns Detalhes do exercício
   */
  getExerciseById: async (id: string): Promise<Exercise> => {
    return api.get<Exercise>(`/exercises/${id}`)
  },

  /**
   * Obtém exercícios por categoria
   * @param category Categoria dos exercícios
   * @returns Lista de exercícios da categoria
   */
  getExercisesByCategory: async (category: string): Promise<Exercise[]> => {
    return api.get<Exercise[]>(`/exercises/category/${category}`)
  },

  /**
   * Obtém exercícios por alvo muscular
   * @param target Alvo muscular
   * @returns Lista de exercícios para o alvo muscular
   */
  getExercisesByTarget: async (target: string): Promise<Exercise[]> => {
    return api.get<Exercise[]>(`/exercises/target/${target}`)
  },

  /**
   * Adiciona um exercício aos favoritos
   * @param exerciseId ID do exercício
   * @returns Mensagem de sucesso
   */
  addToFavorites: async (exerciseId: string): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(`/exercises/${exerciseId}/favorite`)
  },

  /**
   * Remove um exercício dos favoritos
   * @param exerciseId ID do exercício
   * @returns Mensagem de sucesso
   */
  removeFromFavorites: async (exerciseId: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(`/exercises/${exerciseId}/favorite`)
  },

  /**
   * Obtém exercícios favoritos do usuário
   * @returns Lista de exercícios favoritos
   */
  getFavorites: async (): Promise<Exercise[]> => {
    return api.get<Exercise[]>("/exercises/favorites")
  },
}
