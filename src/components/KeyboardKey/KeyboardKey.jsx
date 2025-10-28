import './KeyboardKey.css'

function KeyboardKey({ letter, status, onClick }) {
  const isSpecialKey = letter === 'ENTER' || letter === 'DELETE'
  
  const keyClass = `key ${
    status === 'correct' ? 'key-correct' :
    status === 'present' ? 'key-present' :
    status === 'absent' ? 'key-absent' :
    'key-default'
  } ${isSpecialKey ? 'key-special' : ''}`

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