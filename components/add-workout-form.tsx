"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { Clock, Flame, Upload } from "lucide-react"
import { ApiService } from "@/services/api-service"
import styles from "@/styles/add-workout-form.module.css"

interface AddWorkoutFormProps {
  onWorkoutAdded: (monsterImg?: string) => void
}

export default function AddWorkoutForm({ onWorkoutAdded }: AddWorkoutFormProps) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [calories, setCalories] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateDurationInMinutes = (start: string, end: string): number => {
    const startDate = new Date(`2023-01-01T${start}:00`)
    const endDate = new Date(`2023-01-01T${end}:00`)

    // Se o treino terminou depois da meia-noite, adiciona um dia à data de término
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1)
    }

    const durationMs = endDate.getTime() - startDate.getTime()
    return Math.round(durationMs / 60000) // Converte ms para minutos
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!startTime || !endTime || !calories) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Validar que a hora de término é posterior à hora de início
    const start = new Date(`2023-01-01T${startTime}`)
    const end = new Date(`2023-01-01T${endTime}`)

    // Se o treino terminou depois da meia-noite, não dá erro
    let isEndAfterStart = end > start
    if (end < start) {
      // Adiciona um dia à data de término para comparação
      const endNextDay = new Date(end)
      endNextDay.setDate(endNextDay.getDate() + 1)
      isEndAfterStart = endNextDay > start
    }

    if (!isEndAfterStart) {
      setErrorMessage("A hora de término deve ser posterior à hora de início")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const username = localStorage.getItem("username") || ""
      const durationMinutes = calculateDurationInMinutes(startTime, endTime)
      const caloriesNumber = Number.parseInt(calories)

      const response = await ApiService.addWorkout({
        name: string,
        user: username,
        duration: durationMinutes,
        calories: caloriesNumber,
        photo: photoFile || undefined,
      })

      if (response.success) {
        console.log("Treino adicionado com sucesso:", response)

        // Se o monster evoluiu, atualiza no localStorage
        if (response.monster) {
          localStorage.setItem("monster", response.monster)
          localStorage.setItem("monsterImg", response.monsterImg || "")
        }

        // Notificar que o treino foi adicionado
        onWorkoutAdded(response.monsterImg)
      }
    } catch (error) {
      console.error("Erro ao adicionar treino:", error)
      setErrorMessage("Erro ao adicionar treino. Por favor, tente novamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Adicionar Treino Concluído</h2>
      <p className={styles.formDescription}>Registre seu treino concluído para que seu GymMonster possa nascer!</p>

      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="startTime" className={styles.label}>
            <Clock className={styles.inputIcon} />
            Hora de início
          </label>
          <input
            id="startTime"
            type="time"
            className={styles.input}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime" className={styles.label}>
            <Clock className={styles.inputIcon} />
            Hora de término
          </label>
          <input
            id="endTime"
            type="time"
            className={styles.input}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="calories" className={styles.label}>
            <Flame className={styles.inputIcon} />
            Calorias gastas
          </label>
          <input
            id="calories"
            type="number"
            placeholder="Ex: 350"
            className={styles.input}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            disabled={isSubmitting}
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Upload className={styles.inputIcon} />
            Foto do treino (opcional)
          </label>
          <div className={styles.photoUploadContainer}>
            <input
              type="file"
              id="photo"
              ref={fileInputRef}
              className={styles.fileInput}
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              {photoPreview ? "Alterar foto" : "Adicionar foto"}
            </button>
          </div>

          {photoPreview && (
            <div className={styles.photoPreview}>
              <img src={photoPreview || "/placeholder.svg"} alt="Preview do treino" className={styles.previewImage} />
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Adicionando treino..." : "Adicionar treino"}
        </button>
      </form>
    </div>
  )
}
