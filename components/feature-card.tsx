import styles from "@/styles/feature-card.module.css"
import { Dumbbell, Calendar, BarChart3, Users } from "lucide-react"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          {icon === "dumbbell" && <Dumbbell className={styles.icon} />}
          {icon === "calendar" && <Calendar className={styles.icon} />}
          {icon === "chart" && <BarChart3 className={styles.icon} />}
          {icon === "users" && <Users className={styles.icon} />}
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
