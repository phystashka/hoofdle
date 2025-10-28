import './GameHeader.css'

function GameHeader() {
  const basePath = import.meta.env.BASE_URL
  
  return (
    <header className="game-header">
      <div className="logo-container">
        <img src={`${basePath}logo.png`} alt="Hoofdle" className="game-logo" />
      </div>
    </header>
  )
}

export default GameHeader