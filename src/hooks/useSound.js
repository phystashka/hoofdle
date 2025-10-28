import { useCallback } from 'react'

export function useSound() {
  const basePath = import.meta.env.BASE_URL
  
  const playSound = useCallback((soundFile) => {
    try {
      const audio = new Audio(`${basePath}sounds/${soundFile}`)
      audio.volume = 0.5
      audio.play().catch(() => {
      })
    } catch (error) {
    }
  }, [basePath])

  const playKeyboard = useCallback(() => {
    playSound('keyboard.mp3')
  }, [playSound])

  const playTable = useCallback(() => {
    playSound('table.mp3')
  }, [playSound])

  const playFail = useCallback(() => {
    playSound('fail.mp3')
  }, [playSound])

  return {
    playKeyboard,
    playTable,
    playFail
  }
}