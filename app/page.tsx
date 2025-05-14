"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ApiService } from "@/services/api-service"
import styles from "@/styles/register.module.css"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!username || !password) {
      setErrorMessage("Por favor, preencha todos os campos")
      return
    }

    // Validação de senha
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await ApiService.register({
        user: username,
        password,
      })

      if (response.success) {
        setSuccessMessage("Conta criada com sucesso! Redirecionando para o login...")

        // Limpar o formulário após sucesso
        setUsername("")
        setPassword("")

        // Redirecionar para a página de login após 2 segundos
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setErrorMessage(error instanceof Error ? error.message : "Erro ao criar conta. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar uma conta</h1>
          <p className={styles.subtitle}>Preencha as informações para criar sua conta</p>
        </div>

        <div className={styles.content}>
          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className={styles.successMessage} role="status">
              {successMessage}
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
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.loginText}>
              Já tem uma conta?{" "}
              <Link href="/login" className={styles.loginLink}>
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
