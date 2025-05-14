/**
 * Serviço base de API para o GymMonsters
 */

// URL base da API - substitua pela URL real do backend
const API_BASE_URL = "http://localhost:3001/api"

// Chave para armazenar o token no localStorage
const AUTH_TOKEN_KEY = "gymmonsters_token"

// Função para obter o token do localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

// Função para salvar o token no localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

// Função para remover o token do localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// Função para fazer requisições à API
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> =>
{
  const url = `${API_BASE_URL}${endpoint}`

  // Adiciona o token de autenticação ao header, se existir
  const token = getAuthToken()
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      let message = `Erro na requisição: ${response.status}`
      try {
        const errorData = await response.json()
        message = errorData.message || message
      } catch (e) {
        // Se não conseguir parsear o JSON, usa a mensagem de erro padrão
      }
      throw new Error(message)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("Erro na API:", error)
    throw error
  }
}

// Objeto com os métodos HTTP
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "DELETE" }),
  patch: <T>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
}

// Função específica para registrar um usuário (registerUser)
export const registerUser = async (data: any): Promise<any> => {
  return api.post("/auth/register", data)
}
