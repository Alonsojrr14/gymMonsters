"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AddWorkoutForm from "@/components/add-workout-form"
import styles from "@/styles/add-workout-page.module.css"

export default function AddWorkoutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Obter o nome de usuário
    const storedUsername = localStorage.getItem("username") || ""
    setUsername(storedUsername)

    setIsLoading(false)
  }, [router])

  const handleWorkoutAdded = () => {
    // Redirecionar para a home após adicionar o treino
    router.push("/home")
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button
          type="button"
          onClick={() => router.push("/home")}
          style={{
            marginBottom: "1rem",
            background: "none",
            border: "none",
            color: "var(--primary-color)",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center"
          }}
        >
          ← Voltar
        </button>
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nome do treino (ex: Peito e Tríceps)"
          required
        />
        <AddWorkoutForm onWorkoutAdded={handleWorkoutAdded} />
      </div>
    </div>
  )
}
