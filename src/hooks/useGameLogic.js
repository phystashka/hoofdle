import { useState, useCallback, useEffect } from 'react'
import wordsData from '../../config/words.json'

const WORD_LIST = wordsData.words

const EPOCH_DATE = new Date('2024-01-01T00:00:00Z')

function getDaysFromEpoch() {
  const now = new Date()
  const utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const utcEpoch = new Date(EPOCH_DATE.getUTCFullYear(), EPOCH_DATE.getUTCMonth(), EPOCH_DATE.getUTCDate())
  const diffTime = utcNow - utcEpoch
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function getDailyWord() {
  const daysSinceEpoch = getDaysFromEpoch()
  const wordIndex = daysSinceEpoch % WORD_LIST.length
  return WORD_LIST[wordIndex]
}

function getTimeUntilNextWord() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  return tomorrow - now
}

export function useGameLogic() {
  const [targetWord, setTargetWord] = useState(() => getDailyWord())
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')
  const [keyboardState, setKeyboardState] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      const newWord = getDailyWord()
      if (newWord !== targetWord) {
        setTargetWord(newWord)
        setCurrentGuess('')
        setGuesses([])
        setCurrentRow(0)
        setGameStatus('playing')
        setKeyboardState({})
      }
    }, 60000) 

    return () => clearInterval(interval)
  }, [targetWord])

  const resetGame = useCallback(() => {
    setTargetWord(getDailyWord())
    setCurrentGuess('')
    setGuesses([])
    setCurrentRow(0)
    setGameStatus('playing')
    setKeyboardState({})
  }, [])

  const updateKeyboardState = useCallback((guess, target) => {
    const newKeyboardState = { ...keyboardState }
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      if (target[i] === letter) {
        newKeyboardState[letter] = 'correct'
      } else if (target.includes(letter) && newKeyboardState[letter] !== 'correct') {
        newKeyboardState[letter] = 'present'
      } else if (!target.includes(letter)) {
        newKeyboardState[letter] = 'absent'
      }
    }
    
    setKeyboardState(newKeyboardState)
  }, [keyboardState])

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return

    if (key === 'ENTER') {
      if (currentGuess.length === 6) {
        const newGuesses = [...guesses, currentGuess]
        setGuesses(newGuesses)
        updateKeyboardState(currentGuess, targetWord)
        
        if (currentGuess === targetWord) {
          setGameStatus('won')
        } else if (newGuesses.length >= 6) {
          setGameStatus('lost')
        } else {
          setCurrentRow(currentRow + 1)
        }
        
        setCurrentGuess('')
      }
    } else if (key === 'DELETE') {
      setCurrentGuess(currentGuess.slice(0, -1))
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 6) {
      setCurrentGuess(currentGuess + key)
    }
  }, [currentGuess, guesses, currentRow, gameStatus, targetWord, updateKeyboardState])

  return {
    targetWord,
    currentGuess,
    guesses,
    currentRow,
    gameStatus,
    keyboardState,
    handleKeyPress,
    resetGame
  }
}