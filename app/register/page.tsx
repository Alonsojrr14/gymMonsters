"use client"

import { useState, type FormEvent } from "react"
import { registerUser } from "@/services/api"
import styles from "@/styles/auth.module.css"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password) {
      setErrorMessage("Por favor, preencha todos os campos")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await registerUser({
        username,
        email,
        password,
      })

      console.log("Registro bem-sucedido:", response)
      setSuccessMessage("Conta criada com sucesso!")

      // Limpar o formulário
      setUsername("")
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setErrorMessage(error instanceof Error ? error.message : "Erro ao registrar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Criar uma conta</h1>
          <p className={styles.authDescription}>Preencha as informações para criar sua conta</p>
        </div>
        <div className={styles.authContent}>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Nome de usuário
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                className={styles.formInput}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
