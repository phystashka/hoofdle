import './KeyboardKey.css'

function KeyboardKey({ letter, status, onClick }) {
  const isSpecialKey = letter === 'ENTER' || letter === 'DELETE'
  
  const keyClass = `keyboard-key ${
    status === 'correct' ? 'keyboard-key-correct' :
    status === 'present' ? 'keyboard-key-present' :
    status === 'absent' ? 'keyboard-key-absent' :
    ''
  } ${isSpecialKey ? 'keyboard-key-wide' : ''}`

  const displayText = letter === 'DELETE' ? '⌫' : letter

  return (
    <button
      className={keyClass}
      onClick={onClick}
      type="button"
    >
      {displayText}
    </button>
  )
}

export default KeyboardKey