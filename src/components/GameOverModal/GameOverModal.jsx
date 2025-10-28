import { useState, useEffect } from 'react'
import './GameOverModal.css'

function getTimeUntilNextWord() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  return tomorrow - now
}

function formatTimeUntilNext(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function GameOverModal({ gameStatus, targetWord, guesses, onNewGame, onClose }) {
  const isWin = gameStatus === 'won'
  const [timeUntilNext, setTimeUntilNext] = useState(getTimeUntilNextWord())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNext(getTimeUntilNextWord())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const getTitle = () => {
    if (isWin) {
      return '🎉 Congratulations!'
    }
    return '😔 Game Over'
  }

  const getMessage = () => {
    if (isWin) {
      return `You guessed the word in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!`
    }
    return `The word was: ${targetWord}`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <h2 className="modal-title">{getTitle()}</h2>
          <p className="modal-message">{getMessage()}</p>
        </div>

        <div className="modal-stats">
          <div className="stat-item">
            <span className="stat-value">{guesses.length}</span>
            <span className="stat-label">Guesses</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{targetWord}</span>
            <span className="stat-label">Word</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatTimeUntilNext(timeUntilNext)}</span>
            <span className="stat-label">Next Word</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-new-game" onClick={onNewGame}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal