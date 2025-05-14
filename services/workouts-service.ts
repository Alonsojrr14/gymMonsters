import { api } from "./api"
import type { Workout, CreateWorkoutData, PaginatedResponse, ApiResponse } from "@/types/api-types"

/**
 * Serviço para gerenciar treinos
 */
export const WorkoutsService = {
  /**
   * Obtém todos os treinos do usuário
   * @param page Número da página
   * @param limit Limite de itens por página
   * @returns Lista paginada de treinos
   */
  getWorkouts: async (page = 1, limit = 10): Promise<PaginatedResponse<Workout>> => {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())

    return api.get<PaginatedResponse<Workout>>(`/workouts?${queryParams.toString()}`)
  },

  /**
   * Obtém um treino pelo ID
   * @param id ID do treino
   * @returns Detalhes do treino
   */
  getWorkoutById: async (id: string): Promise<Workout> => {
    return api.get<Workout>(`/workouts/${id}`)
  },

  /**
   * Cria um novo treino
   * @param data Dados do treino a ser criado
   * @returns Treino criado
   */
  createWorkout: async (data: CreateWorkoutData): Promise<Workout> => {
    return api.post<Workout>("/workouts", data)
  },

  /**
   * Atualiza um treino existente
   * @param id ID do treino
   * @param data Dados a serem atualizados
   * @returns Treino atualizado
   */
  updateWorkout: async (id: string, data: Partial<CreateWorkoutData>): Promise<Workout> => {
    return api.put<Workout>(`/workouts/${id}`, data)
  },

  /**
   * Remove um treino
   * @param id ID do treino
   * @returns Mensagem de sucesso
   */
  deleteWorkout: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(`/workouts/${id}`)
  },

  /**
   * Registra a realização de um treino
   * @param id ID do treino
   * @param date Data da realização (opcional, padrão é a data atual)
   * @returns Mensagem de sucesso
   */
  logWorkoutCompletion: async (id: string, date?: string): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(`/workouts/${id}/log`, { date: date || new Date().toISOString() })
  },

  /**
   * Obtém os treinos recentes
   * @param limit Limite de treinos a serem retornados
   * @returns Lista de treinos recentes
   */
  getRecentWorkouts: async (limit = 5): Promise<Workout[]> => {
    return api.get<Workout[]>(`/workouts/recent?limit=${limit}`)
  },
}
