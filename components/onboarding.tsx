"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MonsterEgg from "@/components/monster-egg"
import AddWorkoutForm from "@/components/add-workout-form"
import styles from "@/styles/onboarding.module.css"

interface OnboardingProps {
  username: string
  onComplete: () => void
}

export default function Onboarding({ username, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false)
  const [hasAddedWorkout, setHasAddedWorkout] = useState(false)
  const [monsterImg, setMonsterImg] = useState<string | undefined>(undefined)
  const router = useRouter()

  const steps = [
    {
      title: "Bem-vindo ao GymMonsters!",
      description:
        "Transforme seus treinos em uma aventura divertida e motivadora. Acompanhe seu progresso e crie seu próprio time de monstros de academia!",
      action: "Próximo",
    },
    {
      title: "Conheça seu primeiro GymMonster",
      description:
        "Este é o seu ovo de GymMonster! Adicione seu primeiro treino concluído para que ele possa chocar e revelar seu primeiro companheiro de academia.",
      action: "Vamos começar",
    },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mostrar formulário de adição de treino
      setShowAddWorkoutForm(true)
    }
  }

  const handleWorkoutAdded = (newMonsterImg?: string) => {
    setHasAddedWorkout(true)
    setMonsterImg(newMonsterImg)

    // Dar tempo para a animação do ovo chocar
    setTimeout(() => {
      onComplete()
      router.push("/home")
    }, 3000)
  }

  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingCard}>
        {!showAddWorkoutForm ? (
          <>
            <h1 className={styles.onboardingTitle}>{steps[currentStep].title}</h1>
            <p className={styles.onboardingDescription}>{steps[currentStep].description}</p>

            {currentStep === 1 && (
              <div className={styles.eggContainer}>
                <MonsterEgg isHatching={false} />
              </div>
            )}

            <button className={styles.nextButton} onClick={handleNextStep}>
              {steps[currentStep].action}
            </button>
          </>
        ) : (
          <>
            {!hasAddedWorkout ? (
              <AddWorkoutForm onWorkoutAdded={handleWorkoutAdded} />
            ) : (
              <>
                <h1 className={styles.onboardingTitle}>Seu treino foi registrado!</h1>
                <p className={styles.onboardingDescription}>
                  Seu GymMonster está chocando! Observe enquanto ele nasce.
                </p>
                <div className={styles.eggContainer}>
                  <MonsterEgg isHatching={true} monsterImg={monsterImg} />
                  <p className={styles.hatchingText}>Seu GymMonster está nascendo!</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
