import { useEffect, useState } from 'react'
import './GameTile.css'

function GameTile({ letter, status, isSubmitted, delay = 0, onReveal }) {
  const [currentStatus, setCurrentStatus] = useState('empty')
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (letter && !isSubmitted) {
      setCurrentStatus('filled')
    } else if (!letter) {
      setCurrentStatus('empty')
    }
  }, [letter, isSubmitted])

  useEffect(() => {
    if (isSubmitted && letter) {
      const timer = setTimeout(() => {
        setIsFlipping(true)
        if (onReveal) {
          onReveal()
        }

        setTimeout(() => {
          setCurrentStatus(status)
        }, 250)
        
        setTimeout(() => {
          setIsFlipping(false)
        }, 500)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted, status, delay, letter, onReveal])

  const getTileClass = () => {
    let baseClass = 'tile'
    let statusClass = `tile-${currentStatus}`
    
    if (isFlipping) {
      return `${baseClass} ${statusClass} tile-reveal`
    }
    
    return `${baseClass} ${statusClass}`
  }

  return (
    <div className={getTileClass()}>
      {letter}
    </div>
  )
}

export default GameTile