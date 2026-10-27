const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const size = 30

const snake = [
    {x: 200, y: 200},
    {x: 230, y: 200},
    {x: 260, y: 200}
]

let direction

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
    snake.shift()

    switch (direction) {
        case "right":
            snake.push({x: head.x + size, y: head.y})
            break;
        
        case "left":
            snake.push({x: head.x - size, y: head.y})
            break;

        case "top":
            snake.push({x: head.x, y: head.y - size})
            break;

        case "down":
            snake.push({x: head.x, y: head.y + size})
            break;
    
        default:
            return
    }
}

setInterval(() => {
    ctx.clearRect(0, 0, 600, 600)
    moveSnake()
    drawSnake()
}, 300)
