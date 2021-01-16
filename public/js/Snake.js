class Snake {
    constructor() {
        this.canvas             = document.getElementById('snake');
        this.playBtn            = document.getElementById('play');
        this.ctx                = null;
        this.snakeShape         = null;
        this.defaultSnakeWidth  = 10;
        this.defaultSnakeHeight = 10;
        this.refreshRate = 100;

        this.keybinds = {
            l: "ArrowLeft",
            r: "ArrowRight",
            t: "ArrowUp",
            b: "ArrowDown"
        };

        this.lastPosition = {
            x: null,
            y: null
        }

        this.interval = {
            l: null,
            r: null,
            t: null,
            b: null
        }

        this.keybindsPressed = {
            l: null,
            r: null,
            t: null,
            b: null
        }

        this.direction = [];
        this.hasDirectionChanged = false;
        console.log(Object.keys(this.interval));
        // each time a key is pressed, this var will increase by 1
        this.movesCount = 0;

        this.init();
    }

    /**
     * Start the game if the browser supports canvas
     */
    init() {
        this.isCanvasSupported() ? this.ctx = this.canvas.getContext('2d') : false;

        if (this.ctx) {
            this.playBtn.addEventListener('click', () => {
                this.startTheGame();
            });
        }
    }

    /**
     * Check if the browser supports canvas
     * @returns {boolean}
     */
    isCanvasSupported() {
        return !!this.canvas.getContext;
    }

    startTheGame() {
        this.playBtn.classList.add('active');
        // Draw the default shape of the snake
        this.setTheSnakeShape();

        // Move the snake according to the key pressed
        window.addEventListener("keydown", (e) => {
            switch (e.code) {

                case this.keybinds.l:
                    // prevent the x axis to still iterate
                    // if the key is pressed twice or more
                    if(!this.keybindsPressed.l){
                        this.movesCount += 1;
                        if(this.movesCount >= 1) {
                            this.hasDirectionChanged = true;
                            this.direction.push('l');
                        }
                        this.interval.l = setInterval(() => {
                            this.snakeShape.updateCanvas("l")
                        }, this.refreshRate);
                    }
                break;

                case this.keybinds.r:
                    if(!this.keybindsPressed.r){
                        this.movesCount += 1;
                        if(this.movesCount >= 1) {
                            this.hasDirectionChanged = true;
                            this.direction.push('r');
                        }
                        this.interval.r = setInterval(() => {
                            this.snakeShape.updateCanvas("r")
                        }, this.refreshRate);
                    }
                break;

                case this.keybinds.t:
                    if(!this.keybindsPressed.t){
                        this.movesCount += 1;
                        if(this.movesCount >= 1) {
                            this.hasDirectionChanged = true;
                            this.direction.push('t');
                        }
                        this.interval.t = setInterval(() => {
                            this.snakeShape.updateCanvas("t")
                        }, this.refreshRate);
                    }
                break;

                case this.keybinds.b:
                    if(!this.keybindsPressed.b){
                        this.movesCount += 1;
                        if(this.movesCount >= 1) {
                            this.hasDirectionChanged = true;
                            this.direction.push('b');
                        }
                        this.interval.b = setInterval(() => {
                            this.snakeShape.updateCanvas("b")
                        }, this.refreshRate);
                    }
                break;
            }
        });
    }

    setTheSnakeShape() {
        this.snakeShape = {
            x: (this.canvas.width / 2) - (this.defaultSnakeWidth / 2),
            y: (this.canvas.height / 2) - (this.defaultSnakeHeight / 2),
            width: this.defaultSnakeWidth,
            height: this.defaultSnakeHeight,
            color: 'black',

            drawSnake: () => {
                this.ctx.beginPath();
                this.ctx.rect(this.snakeShape.x, this.snakeShape.y, this.snakeShape.width, this.snakeShape.height);
                this.ctx.fillStyle = this.snakeShape.color;
                this.ctx.fill();
                this.ctx.closePath();
            },

            updateCanvas: (direction) => {
                // clear the trail left by the snake
                // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.snakeShape.drawSnake();
                switch (direction) {
                    // LEFT : X AXIS
                    case "l":
                        this.keybindsPressed.l = true;
                        this.keybindsPressed.r = false;
                        this.keybindsPressed.t = false;
                        this.keybindsPressed.b = false;
                        // if it's not the first move
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        // if the snake doesn't hit the edge of the canvas
                        if(this.snakeShape.x > -this.defaultSnakeWidth && this.snakeShape.x < this.canvas.width) {
                            //make it move
                            this.snakeShape.x -= this.defaultSnakeWidth;
                        }else {
                            this._endTheGame();
                        }
                        break;

                    // RIGHT : X AXIS
                    case "r":
                        this.keybindsPressed.l = false;
                        this.keybindsPressed.r = true;
                        this.keybindsPressed.t = false;
                        this.keybindsPressed.b = false;
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if(this.snakeShape.x > -this.defaultSnakeWidth && this.snakeShape.x < this.canvas.width) {
                            console.log(this.lastPosition.y);
                                this.snakeShape.x += this.defaultSnakeWidth;
                        }else {
                            this._endTheGame();
                        }
                        break;

                    // TOP : Y AXIS
                    case "t":
                        this.keybindsPressed.l = false;
                        this.keybindsPressed.r = false;
                        this.keybindsPressed.t = true;
                        this.keybindsPressed.b = false;
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if(this.snakeShape.y > -this.defaultSnakeHeight && this.snakeShape.y < this.canvas.height) {
                            this.snakeShape.y -= this.defaultSnakeHeight;
                        }else {
                            this._endTheGame();
                        }
                        break;

                    // BOTTOM : Y AXIS
                    case "b":
                        this.keybindsPressed.l = false;
                        this.keybindsPressed.r = false;
                        this.keybindsPressed.t = false;
                        this.keybindsPressed.b = true;
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if(this.snakeShape.y > -this.defaultSnakeHeight && this.snakeShape.y < this.canvas.height) {
                            this.snakeShape.y += this.defaultSnakeHeight;
                        }else {
                            this._endTheGame();
                        }
                        break;
                }
            }
        };
        this.snakeShape.drawSnake();
    }

    _endTheGame() {
        // stop the interval of the last move
        clearInterval(this.interval[this.direction[this.movesCount - 1]]);
        console.log("game over");
        return true;
    }
}