import { useState, useEffect, useCallback } from 'react'
import GameHeader from './components/GameHeader/GameHeader'
import GameBoard from './components/GameBoard/GameBoard'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/GameOverModal/GameOverModal'
import MusicToggle from './components/MusicToggle/MusicToggle'
import { useDiscordSDK } from './hooks/useDiscordSDK'
import { useGameLogic } from './hooks/useGameLogic'
import { useSound } from './hooks/useSound'

function App() {
  const { discordSdk, isAuthenticated } = useDiscordSDK()
  const { playKeyboard, playTable, playFail } = useSound()
  
  // Debug logs
  console.log('App render - isAuthenticated:', isAuthenticated)
  console.log('App render - discordSdk:', discordSdk ? 'loaded' : 'not loaded')
  console.log('App render - window.parent !== window:', window.parent !== window)
  console.log('App render - current URL:', window.location.href)
  
  const {
    currentGuess,
    guesses,
    currentRow,
    gameStatus,
    targetWord,
    keyboardState,
    handleKeyPress,
    resetGame
  } = useGameLogic()

  const [showModal, setShowModal] = useState(false)

  // Удалили блокировку консоли для отладки Discord SDK

  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (gameStatus === 'lost') {
        playFail()
      }
      setTimeout(() => setShowModal(true), 1500)
    }
  }, [gameStatus, playFail])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase()
      if (/^[A-Z]$/.test(key) || key === 'ENTER' || key === 'BACKSPACE') {
        handleKeyPressWithSound(key === 'BACKSPACE' ? 'DELETE' : key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyPressWithSound = useCallback((key) => {
    playKeyboard()
    handleKeyPress(key)
  }, [playKeyboard, handleKeyPress])

  const handleTileReveal = useCallback(() => {
    playTable()
  }, [playTable])

  const handleNewGame = useCallback(() => {
    setShowModal(false)
    resetGame()
  }, [resetGame])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading Hoofdle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6">
        <GameHeader />
        <GameBoard 
          guesses={guesses}
          currentGuess={currentGuess}
          currentRow={currentRow}
          targetWord={targetWord}
          onTileReveal={handleTileReveal}
        />
        <Keyboard 
          keyboardState={keyboardState}
          onKeyPress={handleKeyPressWithSound}
        />
        {showModal && (
          <GameOverModal
            gameStatus={gameStatus}
            targetWord={targetWord}
            guesses={guesses.filter(guess => guess.length === 6)}
            onNewGame={handleNewGame}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <MusicToggle />
    </div>
  )
}

export default App
