/* Grid */
var ROWS = 20, COLS = 20;
/* Cell IDs */
var EMPTY = 0, SNAKE = 1, POWER = 2;
/* Direction */
var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;
/* Keys */
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

class Grid {
    constructor(d, col, row) {
        this.width = col;
        this.height = row;
        this._grid = [];

        for (var x=0; x < col; x++) {
            this._grid.push([])
            for (var y=0; y < row; y++) {
                this._grid[x].push(d);
            }
        }
    }

    set(val, x, y) {
        this._grid[x][y] = val;
    }

    get(x, y) {
        return this._grid[x][y];
    }
}

class Snake {
    constructor(dir, x, y) {
        this.direction = null;
        this.last = null;
        this._queue = null;
        
        this.direction = dir;
        this._queue = [];
        this.insert(x, y);
    }

    insert(x, y) {
        this._queue.unshift({x:x, y:y});
        this.last = this._queue[0];
    }

    remove() {
        return this._queue.pop();
    }
}

function randomPower() {
    var empty = [];
    for (var x=0; x < grid.width; x++) {
        for (var y=0; y < grid.height; y++) {
            if(grid.get(x, y) === EMPTY) {
                empty.push({x:x, y:y});
            }
        }
    }
    var randpos = empty[Math.floor(Math.random()*empty.length)];
    grid.set(POWER, randpos.x, randpos.y);
}

/* Game */
var canvas, ctx, keyState, frames, snake, grid;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = COLS*20;
    canvas.height = ROWS*20
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    frames = 0;
    keyState = {};
    document.addEventListener("keydown", function(evt) {
        keyState[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
        delete keyState[evt.keyCode]
    });

    init();
    loop();
}

function init() {
    grid = new Grid(EMPTY, COLS, ROWS);    
    var sp = {x:Math.floor(COLS/2), y:ROWS-1};
    snake = new Snake(UP, sp.x, sp.y);
    grid.set(SNAKE, sp.x, sp.y);

    randomPower();
}

function loop() {
    update();
    draw();

    window.requestAnimationFrame(loop, canvas);
}

function update() {
    frames++;

    if (keyState[KEY_LEFT] && snake.direction !== RIGHT) 
        snake.direction = LEFT;
    if (keyState[KEY_UP] && snake.direction !== DOWN) 
        snake.direction = UP;
    if (keyState[KEY_RIGHT] && snake.direction !== LEFT) 
        snake.direction = RIGHT;
    if (keyState[KEY_DOWN] && snake.direction !== UP) 
        snake.direction = DOWN;

    if (frames%5 === 0) {
        var nx = snake.last.x;
        var ny = snake.last.y;
        
        switch (snake.direction) {
            case LEFT:
                nx--;
                break;
            case UP:
                ny--;
                break;
            case RIGHT:
                nx++;
                break;
            case DOWN:
                ny++;
                break;
        }

        if (0 > nx || nx > grid.width - 1 ||
            0 > ny || ny > grid.height - 1 || 
            grid.get(nx, ny) === SNAKE){
                return init();
            }

        if (grid.get(nx, ny) === POWER) {
            var tail = {x:nx, y:ny};
            randomPower();
        } else {
            var tail = snake.remove();
            grid.set(EMPTY, tail.x, tail.y);
            tail.x = nx;
            tail.y = ny;
        }
        grid.set(SNAKE, tail.x, tail.y);

        snake.insert(tail.x, tail.y);
    }
}

function draw() {
    var tw = canvas.width/grid.width;
    var th = canvas.height/grid.height;

    for (var x=0; x < grid.width; x++) {
        for (var y=0; y < grid.height; y++) {
            switch(grid.get(x, y)) {
                case EMPTY:
                    ctx.fillStyle = "#34495e";
                    break;
                case SNAKE:
                    ctx.fillStyle = "#ecf0f1";
                    break;
                case POWER:
                    ctx.fillStyle = "#e74c3c";
                    break;
            }
            ctx.fillRect(x*tw, y*th, tw, th)
        }
    }
}

main();