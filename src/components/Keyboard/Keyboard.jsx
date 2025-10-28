import KeyboardKey from '../KeyboardKey/KeyboardKey'
import './Keyboard.css'

function Keyboard({ keyboardState, onKeyPress }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
  ]

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <KeyboardKey
              key={key}
              letter={key}
              status={keyboardState[key] || 'default'}
              onClick={() => onKeyPress(key)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard