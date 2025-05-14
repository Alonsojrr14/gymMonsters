import { api, setAuthToken, removeAuthToken } from "./api"
import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/types/api-types"

/**
 * Serviço para gerenciar autenticação de usuários
 */
export const AuthService = {
  /**
   * Realiza login do usuário
   * @param credentials Credenciais de login (email e senha)
   * @returns Resposta com token e dados do usuário
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials)

    // Salva o token no localStorage
    if (response.token) {
      setAuthToken(response.token)
    }

    return response
  },

  /**
   * Registra um novo usuário
   * @param data Dados de registro (nome de usuário, email e senha)
   * @returns Resposta com token e dados do usuário
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data)

    // Salva o token no localStorage
    if (response.token) {
      setAuthToken(response.token)
    }

    return response
  },

  /**
   * Realiza logout do usuário
   */
  logout: (): void => {
    removeAuthToken()
  },

  /**
   * Obtém dados do usuário atual
   * @returns Dados do usuário
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>("/auth/me")
  },

  /**
   * Atualiza dados do usuário
   * @param data Dados a serem atualizados
   * @returns Dados atualizados do usuário
   */
  updateUser: async (data: Partial<User>): Promise<User> => {
    return api.put<User>("/auth/me", data)
  },

  /**
   * Altera a senha do usuário
   * @param currentPassword Senha atual
   * @param newPassword Nova senha
   * @returns Mensagem de sucesso
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    })
  },
}
