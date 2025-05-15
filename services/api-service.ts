const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface para os dados de login
interface LoginData {
  user: string
  password: string
}

// Interface para os dados de registro
interface RegisterData {
  user: string
  password: string
}

// Interface para os dados de treino
interface WorkoutData {
  name: string
  user: string
  duration: number
  calories: number
  photo?: File
}

// Interface para o GymMonster
interface GymMonster {
  monster: string
  monsterImg: string
}

// Interface para o treino
interface Workout {
  name: string
  duration: number
  calories: number
  photo: string | null
  exp: number
  date: string
}

// Interface para os dados do usuário
interface UserData {
  user: string
  monster: string | null
  monsterImg: string | null
  exp: number
  workouts: Workout[]
}

export const ApiService = {
  // Login de usuário
  login: async (data: LoginData): Promise<{ success: boolean; monster?: string; monsterImg?: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha no login")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  },

  // Registro de usuário
  register: async (data: RegisterData): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Falha no registro")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro no registro:", error)
      throw error
    }
  },

  // Adicionar treino
  addWorkout: async (
    data: WorkoutData,
  ): Promise<{
    success: boolean
    exp?: number
    workout?: Workout
    monster?: string
    monsterImg?: string
  }> => {
    try {
      const formData = new FormData()
      formData.append("user", data.user)
      formData.append("duration", data.duration.toString())
      formData.append("calories", data.calories.toString())

      if (data.photo) {
        formData.append("photo", data.photo)
      }

      const response = await fetch(`${API_URL}/add-workout`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar treino")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao adicionar treino:", error)
      throw error
    }
  },

  // Obter dados do usuário
  getUserData: async (user: string): Promise<UserData> => {
    try {
      const response = await fetch(`${API_URL}/get-user?user=${encodeURIComponent(user)}`)

      if (!response.ok) {
        throw new Error("Falha ao obter dados do usuário")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error)
      throw error
    }
  },
}
