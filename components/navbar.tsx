"use client"

import Link from "next/link"
import { useState } from "react"
import { Dumbbell, Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import styles from "@/styles/navbar.module.css"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Dumbbell className={styles.logoIcon} />
          <span>GymMonsters</span>
        </Link>

        <nav className={styles.desktopNav}>
          <Link href="/exercises" className={styles.navLink}>
            Exercícios
          </Link>
          <Link href="/workouts" className={styles.navLink}>
            Treinos
          </Link>
          <Link href="/progress" className={styles.navLink}>
            Progresso
          </Link>
          <Link href="/community" className={styles.navLink}>
            Comunidade
          </Link>
        </nav>

        <div className={styles.desktopActions}>
          {isAuthenticated ? (
            <div className={styles.profileContainer}>
              <button className={styles.profileButton} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <User className={styles.profileIcon} />
                <span>{user?.username}</span>
              </button>

              {isProfileMenuOpen && (
                <div className={styles.profileMenu}>
                  <Link href="/profile" className={styles.profileMenuItem} onClick={() => setIsProfileMenuOpen(false)}>
                    Perfil
                  </Link>
                  <Link
                    href="/dashboard"
                    className={styles.profileMenuItem}
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button className={styles.logoutButton} onClick={handleLogout}>
                    <LogOut className={styles.logoutIcon} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                Entrar
              </Link>
              <Link href="/register" className={styles.signupButton}>
                Cadastrar
              </Link>
            </>
          )}
        </div>

        <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link href="/exercises" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              Exercícios
            </Link>
            <Link href="/workouts" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              Treinos
            </Link>
            <Link href="/progress" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              Progresso
            </Link>
            <Link href="/community" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              Comunidade
            </Link>

            <div className={styles.mobileActions}>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className={styles.mobileProfileLink} onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  <Link href="/dashboard" className={styles.mobileProfileLink} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button className={styles.mobileLogoutButton} onClick={handleLogout}>
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.mobileLoginButton} onClick={() => setIsMenuOpen(false)}>
                    Entrar
                  </Link>
                  <Link href="/register" className={styles.mobileSignupButton} onClick={() => setIsMenuOpen(false)}>
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
