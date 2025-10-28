import GameTile from '../GameTile/GameTile'
import './GameRow.css'

function GameRow({ guess, targetWord, isSubmitted, isCurrent, rowIndex, onTileReveal }) {
  const tiles = Array.from({ length: 6 }, (_, index) => {
    const letter = guess[index] || ' '
    let status = 'empty'
    
    if (isSubmitted && letter.trim()) {
      if (targetWord[index] === letter) {
        status = 'correct'
      } else if (targetWord.includes(letter)) {
        status = 'present'
      } else {
        status = 'absent'
      }
    } else if (letter.trim()) {
      status = 'filled'
    }

    return { letter: letter.trim(), status }
  })

  return (
    <div className="game-row">
      {tiles.map((tile, index) => (
        <GameTile
          key={index}
          letter={tile.letter}
          status={tile.status}
          isSubmitted={isSubmitted}
          delay={index * 150}
          onReveal={onTileReveal}
        />
      ))}
    </div>
  )
}

export default GameRow