const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = new Audio("./assets/audio.mp3")

const scoreEl = document.querySelector(".score--value")
const finalScoreEl = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const btnPlay = document.querySelector(".btn-play")

const SIZE = 30
const SPEED = 150
const POINTS_PER_FOOD = 10
const WIDTH = canvas.width
const HEIGHT = canvas.height

const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
}

const KEYS = {
    arrowup: DIRECTIONS.up,
    w: DIRECTIONS.up,
    arrowdown: DIRECTIONS.down,
    s: DIRECTIONS.down,
    arrowleft: DIRECTIONS.left,
    a: DIRECTIONS.left,
    arrowright: DIRECTIONS.right,
    d: DIRECTIONS.right
}

let snake
let direction   // direção pedida pelo jogador (null = parado)
let lastMoved   // direção em que a cobra realmente andou no último tick
let scoreValue
let playing
let loopId

const food = { x: 0, y: 0, color: "red" }

const createSnake = () => [
    { x: 300, y: 300 },
    { x: 330, y: 300 },
    { x: 360, y: 300 }
]

const randomPosition = () => Math.floor(Math.random() * (WIDTH / SIZE)) * SIZE

const placeFood = () => {
    do {
        food.x = randomPosition()
        food.y = randomPosition()
    } while (snake.some((s) => s.x === food.x && s.y === food.y))
}

const updateScore = () => {
    scoreEl.innerText = String(scoreValue).padStart(2, "0")
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white"
        }
        ctx.fillRect(position.x, position.y, SIZE, SIZE)
    })
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillRect(x, y, SIZE, SIZE)
    ctx.shadowBlur = 0
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = SIZE; i < WIDTH; i += SIZE) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, HEIGHT)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(WIDTH, i)
        ctx.stroke()
    }
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]
    snake.push({
        x: head.x + direction.x * SIZE,
        y: head.y + direction.y * SIZE
    })
    snake.shift()
    lastMoved = direction
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x === food.x && head.y === food.y) {
        scoreValue += POINTS_PER_FOOD
        updateScore()
        snake.unshift({ ...snake[0] })

        audio.currentTime = 0
        audio.play().catch(() => {})

        placeFood()
    }
}

const gameOver = () => {
    playing = false
    direction = null
    menu.style.display = "flex"
    finalScoreEl.innerText = String(scoreValue).padStart(2, "0")
    canvas.style.filter = "blur(2px)"
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const limit = WIDTH - SIZE

    const hitWall = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit
    const hitSelf = snake
        .slice(0, -1)
        .some((segment) => segment.x === head.x && segment.y === head.y)

    if (hitWall || hitSelf) {
        gameOver()
    }
}

const gameLoop = () => {
    clearTimeout(loopId)

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    if (!playing) return

    loopId = setTimeout(gameLoop, SPEED)
}

const resetGame = () => {
    snake = createSnake()
    direction = null
    lastMoved = DIRECTIONS.right // o corpo começa à esquerda da cabeça
    scoreValue = 0
    playing = true

    updateScore()
    placeFood()

    menu.style.display = "none"
    canvas.style.filter = "none"

    gameLoop()
}

document.addEventListener("keydown", (e) => {
    const next = KEYS[e.key.toLowerCase()]
    if (!next) return

    e.preventDefault() // evita a página rolar com as setas
    if (!playing) return

    const isOpposite = next.x + lastMoved.x === 0 && next.y + lastMoved.y === 0
    if (!isOpposite) {
        direction = next
    }
})

btnPlay.addEventListener("click", resetGame)

resetGame()