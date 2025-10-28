import { useCallback } from 'react'

export function useSound() {
  const playSound = useCallback((soundFile) => {
    try {
      const audio = new Audio(`./sounds/${soundFile}`)
      audio.volume = 0.5
      audio.play().catch(() => {
      })
    } catch (error) {
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