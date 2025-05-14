import Link from "next/link"
import styles from "@/styles/hero.module.css"

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Liberte seu <span className={styles.highlight}>Monstro Interior</span>
          </h1>
          <p className={styles.heroDescription}>
            Acompanhe treinos, monitore progresso e alcance seus objetivos de fitness com nossa plataforma completa de
            gerenciamento de academia.
          </p>
        </div>
        <div className={styles.heroButtons}>
          <Link href="/register" className={styles.primaryButton}>
            Começar Agora <span className={styles.arrowIcon}>→</span>
          </Link>
          <Link href="/exercises" className={styles.outlineButton}>
            Explorar Exercícios
          </Link>
        </div>
      </div>
    </section>
  )
}
