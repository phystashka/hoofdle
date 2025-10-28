import GameRow from '../GameRow/GameRow'
import './GameBoard.css'

function GameBoard({ guesses, currentGuess, currentRow, targetWord, onTileReveal }) {
  const rows = Array.from({ length: 6 }, (_, index) => {
    if (index < guesses.length) {
      return guesses[index]
    } else if (index === currentRow) {
      return currentGuess.padEnd(6, ' ')
    } else {
      return '      '
    }
  })

  return (
    <div className="game-board">
      {rows.map((row, index) => (
        <GameRow
          key={index}
          guess={row}
          targetWord={targetWord}
          isSubmitted={index < guesses.length}
          isCurrent={index === currentRow}
          rowIndex={index}
          onTileReveal={onTileReveal}
        />
      ))}
    </div>
  )
}

export default GameBoard