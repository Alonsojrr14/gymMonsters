import Link from "next/link"
import { Dumbbell } from "lucide-react"
import styles from "@/styles/footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <Dumbbell className={styles.logoIcon} />
              <span>GymMonsters</span>
            </Link>
            <p className={styles.footerTagline}>
              Liberte seu potencial fitness com GymMonsters - seu companheiro definitivo de academia.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <h3 className={styles.footerHeading}>Recursos</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/exercises" className={styles.footerLink}>
                  Biblioteca de Exercícios
                </Link>
              </li>
              <li>
                <Link href="/workouts" className={styles.footerLink}>
                  Planejador de Treinos
                </Link>
              </li>
              <li>
                <Link href="/progress" className={styles.footerLink}>
                  Acompanhamento de Progresso
                </Link>
              </li>
              <li>
                <Link href="/community" className={styles.footerLink}>
                  Comunidade
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerLinks}>
            <h3 className={styles.footerHeading}>Empresa</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.footerLink}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className={styles.footerLink}>
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerLinks}>
            <h3 className={styles.footerHeading}>Legal</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.footerLink}>
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={styles.footerLink}>
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} GymMonsters. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
