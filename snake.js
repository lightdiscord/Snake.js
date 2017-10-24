const GridSize = {
    Rows: 20,
    Cols: 20
}
  
const CellType = {
    Empty: 0,
    Snake: 1,
    Boost: 2
}

const Directions = {
    Left: 0,
    Up: 1,
    Right: 2,
    Down: 3
}

const Keys = {
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40
}

class Grid {
    constructor (def, col, row) {
        this.width = col
        this.height = row
        
        this.grid = [...Array(this.width)].map(() => [...Array(this.height)].map(() => def))
    }

    set (value, x, y) {
        this.grid[x][y] = value
    }

    get (x, y) {
        return this.grid[x][y]
    }

    randomCase(include = [CellType.Empty, CellType.Snake, CellType.Boost]) {
        const found = []
        this.grid.forEach((row, x) => {
            row.forEach((_, y) => {
                if (include.includes(this.get(x, y))) found.push({x, y})
            })
        })
        return found[~~(Math.random()*found.length)]
    }
}

class Snake {
    constructor (direction, x, y) {
        this.direction = direction
        this.last = null
        this.queue = []
        this.insert(x, y)
    }

    insert (x, y) {
        this.queue.unshift({x, y})
        this.last = this.queue[0]
    }

    remove () {
        return this.queue.pop()
    }
}

class Game {
    constructor () {
        this.canvas = document.createElement('canvas')
        this.canvas.width = GridSize.Cols*20
        this.canvas.height = GridSize.Rows*20
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)

        this.frames = 0
        this.keyState = {}

        document.addEventListener('keydown', event => {
            this.keyState[event.keyCode] = true
        })
        document.addEventListener('keyup', event => {
            delete this.keyState[event.keyCode]
        })

        this.init()
        this.loop()
    }

    init () {
        this.grid = new Grid(CellType.Empty, GridSize.Cols, GridSize.Rows)
        const {x, y} = { x: ~~(GridSize.Cols/2), y: GridSize.Rows-1 }
        this.snake = new Snake(Directions.Up, x, y)
        this.grid.set(CellType.Snake, x, y)
        this.randomPower()
    }

    randomPower () {
        const {x,y} = this.grid.randomCase([CellType.Empty])
        this.grid.set(CellType.Boost, x, y)
    }

    update () {
        this.frames++

        if (this.keyState[Keys.Left] && this.snake.direction !== Directions.Right) this.snake.direction = Directions.Left
        if (this.keyState[Keys.Up] && this.snake.direction !== Directions.Down) this.snake.direction = Directions.Up
        if (this.keyState[Keys.Right] && this.snake.direction !== Directions.Left) this.snake.direction = Directions.Right
        if (this.keyState[Keys.Down] && this.snake.direction !== Directions.Up) this.snake.direction = Directions.Down

        if (this.frames%5 == 0) {

            let {x,y} = this.snake.last

            switch (this.snake.direction) {
                case Directions.Left: 
                    x--
                    break
                case Directions.Up: 
                    y--
                    break
                case Directions.Right: 
                    x++
                    break
                case Directions.Down: 
                    y++
                    break
            }

            if (0 > x || x > this.grid.width - 1
            || 0 > y || y > this.grid.height - 1
            || this.grid.get(x,y) == CellType.Snake) return this.init()

            let tail
            if (this.grid.get(x,y) == CellType.Boost) {
                tail = {x,y}
                this.randomPower()
            } else {
                tail = this.snake.remove()
                this.grid.set(CellType.Empty, tail.x, tail.y)
                tail = {x,y}
            }
            
            this.grid.set(CellType.Snake, tail.x, tail.y)
            this.snake.insert(tail.x, tail.y)
        }
    }

    draw () {
        const tw = this.canvas.width/this.grid.width
        const th = this.canvas.height/this.grid.height
        const _ = [...Array(this.grid.width)].map((_,x) => [...Array(this.grid.height)].map((v,y) => {
            switch (this.grid.get(x,y)) {
                case CellType.Empty: 
                    this.context.fillStyle = "#34495e"
                    break
                case CellType.Snake: 
                    this.context.fillStyle = "#ecf0f1"
                    break
                case CellType.Boost: 
                    this.context.fillStyle = "#e74c3c"
                    break
            }
            this.context.fillRect(x*tw, y*th, tw, th)
        }))
    }
    
    loop () {
        this.update()
        this.draw()
        window.requestAnimationFrame(() => {
            this.loop()
        }, this.canvas)
    }
}

console.log(new Game())