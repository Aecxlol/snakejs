class Snake {
    constructor() {
        this.canvas             = document.getElementById('snake');
        this.playBtn            = document.getElementById('play');
        this.ctx                = null;
        this.snakeShape         = null;
        this.defaultSnakeWidth  = 10;
        this.defaultSnakeHeight = 10;
        this.refreshRate        = 100;
        this.foodEaten          = 0;
        this.pos = 0;

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

        this.currentAxis = {
            x: null,
            y: null
        }

        this.currentFoodPos = {
            x: null,
            y: null
        }

        this.direction           = [];
        this.positionHistory = [
            [],
            [],
        ];
        this.foodHasSpawned      = false;

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
        this.snakeShape.generateFood();
        // Move the snake according to the key pressed
        window.addEventListener("keydown", (e) => {
            switch (e.code) {

                case this.keybinds.l:
                    // prevent the x axis to still iterate
                    // if the key is pressed twice or more
                    if (!this.keybindsPressed.l) {
                        // prevent the user from being able to press
                        // the left direction whereas the the right one is the current one
                        if (!this.currentAxis.x) {
                            this.movesCount += 1;
                            if (this.movesCount >= 1) {
                                this.direction.push('l');
                            }
                            this.interval.l = setInterval(() => {
                                this.snakeShape.updateCanvas("l")
                            }, this.refreshRate);
                        }
                    }
                    break;

                case this.keybinds.r:
                    if (!this.keybindsPressed.r) {
                        if (!this.currentAxis.x) {
                            this.movesCount += 1;
                            if (this.movesCount >= 1) {
                                this.direction.push('r');
                            }
                            this.interval.r = setInterval(() => {
                                this.snakeShape.updateCanvas("r")
                            }, this.refreshRate);
                        }
                    }
                    break;

                case this.keybinds.t:
                    if (!this.keybindsPressed.t) {
                        if (!this.currentAxis.y) {
                            this.movesCount += 1;
                            if (this.movesCount >= 1) {
                                this.direction.push('t');
                            }
                            this.interval.t = setInterval(() => {
                                this.snakeShape.updateCanvas("t")
                            }, this.refreshRate);
                        }
                    }
                    break;

                case this.keybinds.b:
                    if (!this.keybindsPressed.b) {
                        if (!this.currentAxis.y) {
                            this.movesCount += 1;
                            if (this.movesCount >= 1) {
                                this.direction.push('b');
                            }
                            this.interval.b = setInterval(() => {
                                this.snakeShape.updateCanvas("b")
                            }, this.refreshRate);
                        }
                    }
                    break;
            }
        });
    }

    /**
     *
     */
    setTheSnakeShape() {
        this.snakeShape = {
            x: (this.canvas.width / 2),
            y: (this.canvas.height / 2),
            width: this.defaultSnakeWidth,
            height: this.defaultSnakeHeight,
            color: 'black',
            foodColor: '#8db600',

            /**
             *
             */
            drawSnake: () => {
                this.ctx.beginPath();
                this.ctx.rect(this.snakeShape.x, this.snakeShape.y, this.snakeShape.width, this.snakeShape.height);
                this.ctx.fillStyle = this.snakeShape.color;
                this.ctx.fill();
                this.ctx.closePath();
            },

            /**
             *
             * @param direction
             */
            updateCanvas: (direction) => {
                // store every x and y position
                this.positionHistory[0][this.pos] = this.snakeShape.x;
                this.positionHistory[1][this.pos] = this.snakeShape.y;
                this.pos++;

                if(this.pos > 1) {
                    // get the previous x and y value
                    let xIndex = this.pos - 2;
                    let yIndex = this.pos - 2;
                    for(let i = 0; i < this.positionHistory.length; i++){
                        // each time a food has been eaten, delete the previous x and y position minus the food eaten (1)
                        // if no food has been eaten, only delete the previous position then the snake will only be its default size (10*10)
                        this.ctx.clearRect(this.positionHistory[0][xIndex - this.foodEaten], this.positionHistory[1][yIndex - this.foodEaten], this.defaultSnakeWidth, this.defaultSnakeHeight)
                    }
                }

                this.snakeShape.drawSnake();
                this.snakeShape.generateFood();

                switch (direction) {
                    // LEFT : X AXIS
                    case "l":
                        this.snakeShape.resetKeys("l");
                        this.currentAxis.x = true;
                        this.currentAxis.y = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snakeShape.x === this.currentFoodPos.x && this.snakeShape.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snakeShape.generateFood();
                        }

                        // if it's not the first move
                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        // if the snake doesn't hit the edge of the canvas
                        if (this.snakeShape.x > -this.defaultSnakeWidth && this.snakeShape.x < this.canvas.width) {
                            //make it move
                            this.snakeShape.x -= this.defaultSnakeWidth;
                        } else {
                            this._endTheGame();
                        }
                        break;

                    // RIGHT : X AXIS
                    case "r":
                        this.snakeShape.resetKeys("r");
                        this.currentAxis.x = true;
                        this.currentAxis.y = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snakeShape.x === this.currentFoodPos.x && this.snakeShape.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snakeShape.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snakeShape.x > -this.defaultSnakeWidth && this.snakeShape.x < this.canvas.width) {
                            this.snakeShape.x += this.defaultSnakeWidth;
                        } else {
                            this._endTheGame();
                        }
                        break;

                    // TOP : Y AXIS
                    case "t":
                        this.snakeShape.resetKeys("t");
                        this.currentAxis.y = true;
                        this.currentAxis.x = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snakeShape.x === this.currentFoodPos.x && this.snakeShape.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snakeShape.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snakeShape.y > -this.defaultSnakeHeight && this.snakeShape.y < this.canvas.height) {
                            this.snakeShape.y -= this.defaultSnakeHeight;
                        } else {
                            this._endTheGame();
                        }
                        break;

                    // BOTTOM : Y AXIS
                    case "b":
                        this.snakeShape.resetKeys("b");
                        this.currentAxis.y = true;
                        this.currentAxis.x = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snakeShape.x === this.currentFoodPos.x && this.snakeShape.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snakeShape.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snakeShape.y > -this.defaultSnakeHeight && this.snakeShape.y < this.canvas.height) {
                            this.snakeShape.y += this.defaultSnakeHeight;
                        } else {
                            this._endTheGame();
                        }
                        break;
                }
            },

            /**
             *
             * @param key
             */
            resetKeys: (key) => {
                // set all the keys pressed at false but the pressed one (key)
                Object.keys(this.keybindsPressed).map((k, v) => {
                    this.keybindsPressed[k]   = false;
                    this.keybindsPressed[key] = true;
                })
            },

            generateFood: () => {
                if (!this.foodHasSpawned) {
                    this.ctx.beginPath();
                    // store at the same time the food position
                    this.ctx.rect(this.currentFoodPos.x = this._generateRandomPosition()['x'], this.currentFoodPos.y = this._generateRandomPosition()['y'], this.snakeShape.width, this.snakeShape.height);
                    this.ctx.fillStyle = this.snakeShape.foodColor;
                    this.ctx.fill();
                    this.ctx.closePath();
                    this.foodHasSpawned = true;
                }
            }
        };
        this.snakeShape.drawSnake();
    }

    /**
     * Generate a random position for the food to spawn
     * @returns {{x: null, y: null}}
     * @private
     */
    _generateRandomPosition() {
        let random = {
            x: null,
            y: null
        }

        // rands a number between 1 and 10 - multiplies it by the size of the snake - adds a random number between 100 and the canvas size minus the size fo the snake
        random.x = (Math.floor(Math.random() * 10) * (this.defaultSnakeWidth)) + (Math.floor(Math.random() * 10) * ((this.canvas.width / 10) - (this.defaultSnakeWidth)))
        random.y = (Math.floor(Math.random() * 10) * (this.defaultSnakeHeight)) + (Math.floor(Math.random() * 10) * ((this.canvas.height / 10) - (this.defaultSnakeHeight)))
        return random;
    }

    _endTheGame() {
        // stop the interval of the last move
        clearInterval(this.interval[this.direction[this.movesCount - 1]]);
        console.log("game over");
        return true;
    }
}
