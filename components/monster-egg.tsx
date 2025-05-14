"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/monster-egg.module.css"

interface MonsterEggProps {
  isHatching: boolean
  monsterImg?: string
}

export default function MonsterEgg({ isHatching, monsterImg }: MonsterEggProps) {
  const [animationStage, setAnimationStage] = useState(0)
  const apiBaseUrl = "http://localhost:3001" // URL base da API

  useEffect(() => {
    if (isHatching) {
      // Iniciar sequência de animação
      const timer1 = setTimeout(() => setAnimationStage(1), 500)
      const timer2 = setTimeout(() => setAnimationStage(2), 1200)
      const timer3 = setTimeout(() => setAnimationStage(3), 2000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isHatching])

  return (
    <div className={`${styles.eggContainer} ${isHatching ? styles.hatching : ""}`}>
      <div className={`${styles.egg} ${isHatching ? styles.shaking : ""}`}>
        {animationStage < 3 ? (
          <>
            <div className={`${styles.eggTop} ${animationStage >= 1 ? styles.cracked : ""}`}></div>
            <div className={`${styles.eggBottom} ${animationStage >= 2 ? styles.open : ""}`}></div>
          </>
        ) : (
          <div className={styles.monster}>
            {monsterImg ? (
              <img src={`${apiBaseUrl}${monsterImg}`} alt="Seu GymMonster" className={styles.monsterImage} />
            ) : (
              <>
                <div className={styles.monsterBody}></div>
                <div className={styles.monsterEye}></div>
                <div className={styles.monsterEye}></div>
                <div className={styles.monsterMouth}></div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
