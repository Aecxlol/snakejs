class Snake {
    constructor() {
        this.canvas             = document.getElementById('snake');
        this.playBtn            = document.getElementById('play');
        this.ctx                = null;
        this.snakeShape         = null;
        this.isGameOver         = false;
        this.defaultSnakeWidth  = 10;
        this.defaultSnakeHeight = 10;
        this.refreshRate        = 50;
        this.foodEaten          = 0;
        this.pos                = 0;

        this.keybinds = {
            l: "ArrowLeft",
            r: "ArrowRight",
            t: "ArrowUp",
            b: "ArrowDown"
        };

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

        this.direction       = [];
        this.positionHistory = [
            [],
            [],
        ];

        this.snakePosition  = [
            [],
            []
        ]
        this.foodHasSpawned = false;
        // each time a key is pressed, this var will increase by 1
        this.movesCount     = 0;

        this.slotsAvailable = [
            [],
            []
        ];
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
        // this.drawCheckerboard();
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
                let x = 0;
                let y = 1;

                // store every x and y position
                this.positionHistory[x][this.pos] = this.snakeShape.x;
                this.positionHistory[y][this.pos] = this.snakeShape.y;
                this.snakePosition[x].push(this.snakeShape.x);
                this.snakePosition[y].push(this.snakeShape.y);
                this.pos++;

                // store the snake position into an array
                this.snakePosition[x].splice(0, this.snakePosition[x].length - 1 - this.foodEaten);
                this.snakePosition[y].splice(0, this.snakePosition[y].length - 1 - this.foodEaten);

                // allows the snake to grow each time a food has been eaten
                if (this.pos > 1) {
                    // get the previous x and y value
                    let xIndex = this.pos - 2;
                    let yIndex = this.pos - 2;
                    // each time a food has been eaten, delete the previous x and y position minus the food eaten (1)
                    // if no food has been eaten, only delete the previous position then the snake will only be its default size (10*10)
                    this.ctx.clearRect(this.positionHistory[x][xIndex - this.foodEaten], this.positionHistory[y][yIndex - this.foodEaten], this.defaultSnakeWidth, this.defaultSnakeHeight)
                    // get the food count to know the size fo the snake
                    for (let i = 0; i < this.foodEaten; i++) {
                        // compare the current position of the snake's head (this.snakeShape.x) to the last values of x and y and by taking in consideration the size of the snake
                        // and if the snake hit his tail, then end the game
                        if (this.snakeShape.x === this.positionHistory[x][this.positionHistory[x].length - 2 - i] && this.snakeShape.y === this.positionHistory[y][this.positionHistory[y].length - 2 - i]) {
                            this._endTheGame();
                        }
                    }
                }

                // set all the slots available to 0
                for (let xAxis = 0; xAxis < this.canvas.width; xAxis += this.defaultSnakeWidth) {
                    this.slotsAvailable[xAxis] = [];
                    for (let yAxis = 0; yAxis < this.canvas.height; yAxis += this.defaultSnakeHeight) {
                        this.slotsAvailable[xAxis][yAxis] = 0;
                    }
                }

                // set the slots where the snake is to 1
                if (this.snakeShape.x < this.canvas.width && this.snakeShape.x >= 0) {
                    for (let i = 0; i < this.snakePosition[x].length; i++) {
                        this.slotsAvailable[this.snakePosition[x][i]][this.snakePosition[y][i]] = 1;
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
                        if (this.snakeShape.x >= 0 && this.snakeShape.x < this.canvas.width) {
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

                        if (this.snakeShape.x >= 0 && this.snakeShape.x < this.canvas.width) {
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

                        if (this.snakeShape.y >= 0 && this.snakeShape.y < this.canvas.height) {
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

                        if (this.snakeShape.y >= 0 && this.snakeShape.y < this.canvas.height) {
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
                    // spawn a new food and store its position at the same time
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
     * Generates a random number which is a multiple of 10
     * @param min
     * @param max
     * @returns {number}
     * @private
     */
    _getRandomNumber(min, max) {
        return (Math.round(Math.random() * (max - min) + min)) * 10;
    }

    /**
     * Generates a random position for the food to spawn
     * @returns {{x: null, y: null}|*}
     * @private
     */
    _generateRandomPosition() {
        let random = {
            x: null,
            y: null
        }

        random.x = this._getRandomNumber(0, (this.canvas.width - this.defaultSnakeWidth) / 10);
        random.y = this._getRandomNumber(0, (this.canvas.height - this.defaultSnakeHeight) / 10);

        if (this.pos === 0) {
            if (random.x !== this.snakeShape.x && random.y !== this.snakeShape.y) {
                return random;
            } else {
                return this._generateRandomPosition();
            }
        } else {
            // checks the snake's position if it doesn't match with the random position
            if (this.slotsAvailable[random.x][random.y] === 1) {
                return this._generateRandomPosition();
            } else {
                return random;
            }
        }
    }

    // drawCheckerboard() {
    //     for(let i = 0; i < this.canvas.width; i+=this.defaultSnakeWidth){
    //
    //             this.ctx.beginPath();
    //             this.ctx.moveTo(i, 0);
    //
    //             this.ctx.lineTo(i, this.canvas.height);
    //
    //             this.ctx.stroke();
    //
    //     }
    //
    //     for(let j = 0; j < this.canvas.height; j+=this.defaultSnakeHeight) {
    //         this.ctx.beginPath();
    //         this.ctx.moveTo(0, j);
    //         this.ctx.lineTo(this.canvas.width, j);
    //         this.ctx.stroke();
    //     }
    // }

    _endTheGame() {
        // stop the interval of the last move
        clearInterval(this.interval[this.direction[this.movesCount - 1]]);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isGameOver = true;
        return false;
    }
}
