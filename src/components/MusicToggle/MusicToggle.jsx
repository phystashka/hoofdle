import { useState, useRef, useEffect } from 'react'
import { IoMusicalNotes, IoPlay } from 'react-icons/io5'
import './MusicToggle.css'

function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    try {
      audioRef.current = new Audio('/hoofdle/music/music.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    } catch (error) {
      // Ignore audio loading errors
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
      })
      setIsPlaying(true)
    }
  }

  return (
    <div className="music-toggle">
      <button 
        className="music-button" 
        onClick={toggleMusic}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <IoMusicalNotes className="text-lg sm:text-xl" /> : <IoPlay className="text-lg sm:text-xl" />}
      </button>
    </div>
  )
}

export default MusicToggle