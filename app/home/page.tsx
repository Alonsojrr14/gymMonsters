"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Onboarding from "@/components/onboarding"
import Dashboard from "@/components/dashboard"
import styles from "@/styles/home.module.css"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstAccess, setIsFirstAccess] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

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

    // Verificar se é o primeiro acesso
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding") === "true"
    setIsFirstAccess(!hasCompletedOnboarding)

    setIsLoading(false)
  }, [router])

  const completeOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true")
    setIsFirstAccess(false)
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
      {isFirstAccess ? (
        <Onboarding username={username} onComplete={completeOnboarding} />
      ) : (
        <Dashboard username={username} />
      )}
    </div>
  )
}
