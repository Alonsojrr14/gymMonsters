import { api } from "./api"
import type { ProgressEntry, CreateProgressData, UserStats, PaginatedResponse } from "@/types/api-types"

/**
 * Serviço para gerenciar progresso do usuário
 */
export const ProgressService = {
  /**
   * Obtém todas as entradas de progresso do usuário
   * @param page Número da página
   * @param limit Limite de itens por página
   * @returns Lista paginada de entradas de progresso
   */
  getProgressEntries: async (page = 1, limit = 10): Promise<PaginatedResponse<ProgressEntry>> => {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())

    return api.get<PaginatedResponse<ProgressEntry>>(`/progress?${queryParams.toString()}`)
  },

  /**
   * Obtém uma entrada de progresso pelo ID
   * @param id ID da entrada de progresso
   * @returns Detalhes da entrada de progresso
   */
  getProgressEntryById: async (id: string): Promise<ProgressEntry> => {
    return api.get<ProgressEntry>(`/progress/${id}`)
  },

  /**
   * Cria uma nova entrada de progresso
   * @param data Dados da entrada de progresso a ser criada
   * @returns Entrada de progresso criada
   */
  createProgressEntry: async (data: CreateProgressData): Promise<ProgressEntry> => {
    return api.post<ProgressEntry>("/progress", data)
  },

  /**
   * Atualiza uma entrada de progresso existente
   * @param id ID da entrada de progresso
   * @param data Dados a serem atualizados
   * @returns Entrada de progresso atualizada
   */
  updateProgressEntry: async (id: string, data: Partial<CreateProgressData>): Promise<ProgressEntry> => {
    return api.put<ProgressEntry>(`/progress/${id}`, data)
  },

  /**
   * Remove uma entrada de progresso
   * @param id ID da entrada de progresso
   * @returns Mensagem de sucesso
   */
  deleteProgressEntry: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/progress/${id}`)
  },

  /**
   * Obtém estatísticas do usuário
   * @param timeRange Intervalo de tempo para as estatísticas (week, month, quarter, year, all)
   * @returns Estatísticas do usuário
   */
  getUserStats: async (timeRange: "week" | "month" | "quarter" | "year" | "all" = "month"): Promise<UserStats> => {
    return api.get<UserStats>(`/progress/stats?timeRange=${timeRange}`)
  },

  /**
   * Obtém dados de progresso para um exercício específico
   * @param exerciseId ID do exercício
   * @param timeRange Intervalo de tempo para os dados (week, month, quarter, year, all)
   * @returns Dados de progresso do exercício
   */
  getExerciseProgress: async (
    exerciseId: string,
    timeRange: "week" | "month" | "quarter" | "year" | "all" = "month",
  ): Promise<{ date: string; weight: number; reps: number }[]> => {
    return api.get<{ date: string; weight: number; reps: number }[]>(
      `/progress/exercise/${exerciseId}?timeRange=${timeRange}`,
    )
  },
}
