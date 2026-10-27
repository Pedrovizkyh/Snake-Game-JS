const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

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

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if(index === snake.length -1){
            ctx.fillStyle = "White"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
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

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    moveSnake()
    drawSnake()

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
