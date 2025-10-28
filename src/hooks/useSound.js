import { useCallback } from 'react'

export function useSound() {
  const playSound = useCallback((soundFile) => {
    try {
      const audio = new Audio(`/hoofdle/sounds/${soundFile}`)
      audio.volume = 0.5
      audio.play().catch(() => {
        // Ignore audio play errors (autoplay restrictions)
      })
    } catch (error) {
      // Ignore audio loading errors
    }
  }, [])

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