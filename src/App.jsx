import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const disableDevTools = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault()
      }
    }

    const disableContextMenu = (e) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', disableDevTools)
    document.addEventListener('contextmenu', disableContextMenu)

    return () => {
      document.removeEventListener('keydown', disableDevTools)
      document.removeEventListener('contextmenu', disableContextMenu)
    }
  }, [])

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

  const handleKeyPressWithSound = (key) => {
    playKeyboard()
    handleKeyPress(key)
  }

  const handleNewGame = () => {
    setShowModal(false)
    resetGame()
  }

  const showGame = isAuthenticated || window.location.hostname === 'phystashka.github.io' || window.location.hostname === 'localhost'

  if (!showGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700">Connecting to Discord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">
        <GameHeader />
        <GameBoard 
          guesses={guesses}
          currentGuess={currentGuess}
          currentRow={currentRow}
          targetWord={targetWord}
          onTileReveal={playTable}
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
