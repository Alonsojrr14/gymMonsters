"use client"

import { useState } from "react"
import styles from "@/styles/progress.module.css"
import { LineChart } from "lucide-react"

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Acompanhamento de Progresso</h1>
          <p className={styles.subtitle}>Monitore sua jornada fitness e conquistas</p>
        </div>
        <select className={styles.timeRangeSelect} value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="quarter">Últimos 3 Meses</option>
          <option value="year">Último Ano</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        <StatCard title="Treinos Completados" value="24" change="+8%" />
        <StatCard title="Peso Total Levantado" value="12.540 kg" change="+12%" />
        <StatCard title="Duração dos Treinos" value="18,5 horas" change="+5%" />
        <StatCard title="Recordes Pessoais" value="8" change="+2" isCount />
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>Progresso de Força</button>
        <button className={styles.tab}>Medidas Corporais</button>
        <button className={styles.tab}>Desempenho Cardio</button>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Progresso no Supino</h3>
            <p className={styles.chartDescription}>Sua progressão de 1RM ao longo do tempo</p>
          </div>
          <div className={styles.chartContent}>
            <div className={styles.chartPlaceholder}>
              <LineChart className={styles.chartIcon} />
              <p>O gráfico seria exibido aqui</p>
            </div>
          </div>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Progresso no Agachamento</h3>
            <p className={styles.chartDescription}>Sua progressão de 1RM ao longo do tempo</p>
          </div>
          <div className={styles.chartContent}>
            <div className={styles.chartPlaceholder}>
              <LineChart className={styles.chartIcon} />
              <p>O gráfico seria exibido aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  isCount?: boolean
}

function StatCard({ title, value, change, isCount = false }: StatCardProps) {
  const isPositive = change.startsWith("+")

  return (
    <div className={styles.statCard}>
      <div className={styles.statCardHeader}>
        <h3 className={styles.statTitle}>{title}</h3>
      </div>
      <div className={styles.statCardContent}>
        <div className={styles.statValue}>{value}</div>
        <p className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}>
          {change} {!isCount && "em relação ao período anterior"}
        </p>
      </div>
    </div>
  )
}
