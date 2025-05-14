"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ApiService } from "@/services/api-service"
import styles from "@/styles/login.module.css"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!username || !password) {
      setErrorMessage("Por favor, preencha todos os campos")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await ApiService.login({
        user: username,
        password,
      })

      if (response.success) {
        // Salvar informações do usuário no localStorage
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("username", username)

        // Se for o primeiro login (sem monster), redirecionar para onboarding
        const isFirstAccess = !response.monster
        localStorage.setItem("hasCompletedOnboarding", isFirstAccess ? "false" : "true")

        // Salvar informações do monster se existir
        if (response.monster) {
          localStorage.setItem("monster", response.monster)
          localStorage.setItem("monsterImg", response.monsterImg || "")
        }

        // Redirecionar para a home
        router.push("/home")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setErrorMessage("Nome de usuário ou senha incorretos. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar</p>
        </div>

        <div className={styles.content}>
          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Nome de usuário
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                autoComplete="username"
                autoCapitalize="none"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password" className={styles.label}>
                  Senha
                </label>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.registerText}>
              Não tem uma conta?{" "}
              <Link href="/" className={styles.registerLink}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
