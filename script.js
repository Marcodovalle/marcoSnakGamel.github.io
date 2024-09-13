const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const gridSize = 20
let snake, direction, food, tileSize, gameSpeed, gameLoopInterval

const startScreen = document.getElementById('startScreen')
const gameOverScreen = document.getElementById('gameOverScreen')
const startButton = document.getElementById('startButton')
const restartButton = document.getElementById('restartButton')

function initializeGame() {
  snake = [{ x: 10, y: 10 }]
  direction = { x: 1, y: 0 }
  food = getRandomPosition()
  tileSize = canvas.width / gridSize
  gameSpeed = 100
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function setupCanvas() {
  canvas.width = canvas.height =
    Math.min(window.innerWidth, window.innerHeight) * 0.9
  tileSize = canvas.width / gridSize
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  }
}

function drawRect(color, pos) {
  ctx.fillStyle = color
  ctx.fillRect(pos.x * tileSize, pos.y * tileSize, tileSize - 2, tileSize - 2)
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    food = getRandomPosition()
  } else {
    snake.pop()
  }
}

function checkCollision() {
  const head = snake[0]
  return (
    snake.some(
      (part, index) => index !== 0 && part.x === head.x && part.y === head.y
    ) ||
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize
  )
}

function gameOver() {
  clearInterval(gameLoopInterval)
  canvas.style.display = 'none'
  gameOverScreen.style.display = 'flex'
  document.addEventListener('keydown', startGameOnKeyPress)
}

function gameLoop() {
  if (checkCollision()) return gameOver()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawRect('red', food)
  snake.forEach((part) => drawRect('lime', part))
  moveSnake()
}

function startGame() {
  startScreen.style.display = 'none'
  gameOverScreen.style.display = 'none'
  canvas.style.display = 'block'
  initializeGame()
  gameLoopInterval = setInterval(gameLoop, gameSpeed)
}

function startGameOnKeyPress() {
  if (gameOverScreen.style.display === 'flex') {
    startGame()
    document.removeEventListener('keydown', startGameOnKeyPress)
  }
}

startButton.addEventListener('click', startGame)
restartButton.addEventListener('click', startGame)
window.addEventListener('keydown', (e) => {
  const { key } = e
  const isArrowOrWASDKey = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'w',
    's',
    'a',
    'd',
    'W',
    'S',
    'A',
    'D',
  ].includes(key)
  if (isArrowOrWASDKey) {
    e.preventDefault() // Prevents scrolling
    const newDirection = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, // W or w as ArrowUp
      W: { x: 0, y: -1 },
      s: { x: 0, y: 1 }, // S or s as ArrowDown
      S: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, // A or a as ArrowLeft
      A: { x: -1, y: 0 },
      d: { x: 1, y: 0 }, // D or d as ArrowRight
      D: { x: 1, y: 0 },
    }[key]
    if (newDirection.x !== -direction.x && newDirection.y !== -direction.y) {
      direction = newDirection
    }
  }
})

setupCanvas()
