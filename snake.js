const Grid = {
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
      this.queue.pop()
    }
  }
  
  function randomCase(grid, include = [CellType.Empty, CellType.Snake, CellType.Boost]) {
    const found = []
    grid.grid.forEach((row, x) => {
      row.forEach((_, y) => {
        if (include.includes(grid.get({x, y}))) found.push({x, y})
      })
    })
    return found[~~Math.random()*found.length]
  }
  
  class Game {
    constructor () {
      this.canvas = document.createElement('canvas')
      this.canvas.width = Grid.Cols*20
      this.canvas.height = Grid.Rows*20
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
      this.grid = new Grid(CellType.Empty, Grid.Cols, Grid.Rows)
      const {x, y} = { x: ~~(Grid.Cols/2), y: Grid.Rows-1 }
      this.snake = new Snake(Directions.Up, x, y)
      this.grid.set(CellType.Snake, x, y)
      this.randomPower()
    }
  
    randomPower () {
        const {x,y} = randomCase(this.grid, [CellType.Empty])
        this.grid.set(CellType.Boost, x, y)
    }
  
    loop () {
      this.update()
      this.draw()
  
      window.requestAnimationFrame(this.loop, this.canvas)
    }
  
    update () {
      this.frames++
  
      if (this.keyState[KEY_LEFT] && this.snake.direction !== RIGHT) this.snake.direction = LEFT
      if (this.keyState[KEY_UP] && this.snake.direction !== DOWN) this.snake.direction = UP
      if (this.keyState[KEY_RIGHT] && this.snake.direction !== LEFT) this.snake.direction = RIGHT
      if (this.keyState[KEY_DOWN] && this.snake.direction !== UP) this.snake.direction = DOWN
  
      if (this.frames%5 != 0) return
  
      const {x,y} = this.snake.last
  
      switch (this.snake.direction) {
        case Directions.Left: x-- break
        case Directions.Up: y-- break
        case Directions.Right: x++ break
        case Directions.Down: y++ break
      }
  
      if (0 > x || x > grid-width -1
        || 0 > y || y > grid.height -1
        || this.grid.get(x,y) == CellType.Snake) return this.init()
  
      if (grid.get(x,y) == CellType.Boost) this.randomPower()
      else {
        const {_x:x,_y:y} = this.snake.remove()
        this.grid.set(CellType.Empty, _x, _y)
      }
  
      this.grid.set(CellType.Snake, x, y)
      this.snake.insert(x, y)
    }
  }
  
  new Game()