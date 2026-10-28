const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = new Audio('../assets/audio.mp3')

const size = 30
let direction, loopId
const snake = [
    {x: 300, y: 300},
    {x: 330, y: 300},
    {x: 360, y: 300}
]


const OPPOSITES = {
    ArrowUp: "ArrowDown",
    ArrowDown: "ArrowUp",
    ArrowRight: "ArrowLeft",
    ArrowLeft: "ArrowRight"
}

const randomPosition = () => {
    const cells = canvas.width / size
    return Math.floor(Math.random() * cells) * size
}
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if(index === snake.length -1){
            ctx.fillStyle = "White"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const drawFood = () => {
    const {x, y, color} = food

    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const moveSnake = () => {
    const head = snake[snake.length -1]
    
    switch (direction) {
        case "ArrowRight":
            snake.push({x: head.x + size, y: head.y})
            break;
        
        case "ArrowLeft":
            snake.push({x: head.x - size, y: head.y})
            break;

        case "ArrowUp":
            snake.push({x: head.x, y: head.y - size})
            break;

        case "ArrowDown":
            snake.push({x: head.x, y: head.y + size})
            break;
    
        default:
            return
    }
    snake.shift()
}

const drawnGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for(let i = 30; i <= canvas.width; i+=30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length -1]

    if(head.x == food.x && head.y == food.y){
        snake.unshift({...snake[0]})
        audio.play()
        let x = randomPosition()
        let y = randomPosition()

        while(snake.some((position) => position.x === x && position.y === y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

const gameOver = () => {
    direction = undefined
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const limit = canvas.width - size
    
    const hitWall = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit
    const hitSelf = snake.slice(0, -1).some(
        (segment) => segment.x === head.x && segment.y === head.y
    )

    if(hitWall || hitSelf){
        gameOver()
    }
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawnGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 150)
}

document.addEventListener("keydown", ({ key }) => {
    if((OPPOSITES[key] && OPPOSITES[key] !== direction)){
        direction = key
    }
})

gameLoop()

