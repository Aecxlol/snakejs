class Snake {
    constructor() {
        this.canvas             = document.getElementById('snake');
        this.playBtn            = document.getElementById('play');
        this.retryBtn           = document.getElementById('retry');
        this.ctx                = null;
        this.snake              = null;
        this.isGameOver         = false;
        this.defaultSnakeWidth  = 10;
        this.defaultSnakeHeight = 10;
        this.refreshRate        = 100;
        this.foodEaten          = 0;
        this.pos                = 0;
        this.keybinds           = {
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

        this.snakeCoordinates = [
            [],
            []
        ]
        this.foodHasSpawned   = false;

        // each time a key is pressed, this var will increase by 1
        this.movesCount = 0;

        // y x
        this.slotsAvailableForFoodToSpawn = [
            [],
            []
        ];

        // this.maxSlots = (this.canvas.width / this.defaultSnakeWidth)
        this.init();
    }

    /**
     * Start the game if the browser supports canvas
     */
    init() {
        this.isCanvasSupported() ? this.ctx = this.canvas.getContext('2d') : false;

        if (this.ctx) {
            this.playBtn.addEventListener('click', () => {
                this.playBtn.classList.add('active');
                this.startTheGame();
            });

            this.retryBtn.addEventListener('click', () => {
                this.reset();
                this.retryBtn.classList.add('inactive');
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

    /**
     * @todo check the random x & y
     */
    startTheGame() {
        // this.drawCheckerboard();
        // Draw the default shape of the snake
        this.setSnake();
        this.snake.generateFood();
        this.initFoodMatrix();
        console.log("mdr : " + this.pos);
        // Move the snake according to the key pressed
        window.addEventListener("keydown", (e) => {
            switch (e.code) {

                case this.keybinds.l:
                    if (!this.isGameOver) {
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
                                    this.snake.updateCanvas("l")
                                }, this.refreshRate);
                            }
                        }
                    } else {
                        console.log("la partie est terminée");
                    }
                    break;

                case this.keybinds.r:
                    if (!this.isGameOver) {
                        if (!this.keybindsPressed.r) {
                            if (!this.currentAxis.x) {
                                this.movesCount += 1;
                                if (this.movesCount >= 1) {
                                    this.direction.push('r');
                                }
                                this.interval.r = setInterval(() => {
                                    this.snake.updateCanvas("r")
                                }, this.refreshRate);
                            }
                        }
                    } else {
                        console.log("la partie est terminée");
                    }
                    break;

                case this.keybinds.t:
                    if (!this.isGameOver) {
                        if (!this.keybindsPressed.t) {
                            if (!this.currentAxis.y) {
                                this.movesCount += 1;
                                if (this.movesCount >= 1) {
                                    this.direction.push('t');
                                }
                                this.interval.t = setInterval(() => {
                                    this.snake.updateCanvas("t")
                                }, this.refreshRate);
                            }
                        }
                    } else {
                        console.log("la partie est terminée");
                    }
                    break;

                case this.keybinds.b:
                    if (!this.isGameOver) {
                        if (!this.keybindsPressed.b) {
                            if (!this.currentAxis.y) {
                                this.movesCount += 1;
                                if (this.movesCount >= 1) {
                                    this.direction.push('b');
                                }
                                this.interval.b = setInterval(() => {
                                    this.snake.updateCanvas("b")
                                }, this.refreshRate);
                            }
                        }
                    } else {
                        console.log("la partie est terminée");
                    }
                    break;
            }
        });
    }

    /**
     *
     */
    setSnake() {
        this.snake = {
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
                this.ctx.rect(this.snake.x, this.snake.y, this.snake.width, this.snake.height);
                this.ctx.fillStyle = this.snake.color;
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
                this.positionHistory[x][this.pos] = this.snake.x;
                this.positionHistory[y][this.pos] = this.snake.y;
                this.snakeCoordinates[x].push(this.snake.x);
                this.snakeCoordinates[y].push(this.snake.y);
                this.pos++;

                // store the snake position into an array
                this.snakeCoordinates[x].splice(0, this.snakeCoordinates[x].length - 1 - this.foodEaten);
                this.snakeCoordinates[y].splice(0, this.snakeCoordinates[y].length - 1 - this.foodEaten);

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
                        // compare the current position of the snake's head (this.snake.x) to the last values of x and y and by taking in consideration the size of the snake
                        // and if the snake hit his tail, then end the game
                        if (this.snake.x === this.positionHistory[x][this.positionHistory[x].length - 2 - i] && this.snake.y === this.positionHistory[y][this.positionHistory[y].length - 2 - i]) {
                            this.endTheGame();
                        }
                    }
                }

                // set all the slots available to 0 except the ones where the snake currently is
                // for (let xAxis = 0; xAxis < this.canvas.width; xAxis += this.defaultSnakeWidth) {
                //     this.slotsAvailableForFoodToSpawn[xAxis] = [];
                //     for (let yAxis = 0; yAxis < this.canvas.height; yAxis += this.defaultSnakeHeight) {
                //         for (let i = 0; i < this.snakeCoordinates[x].length; i++) {
                //             this.slotsAvailableForFoodToSpawn[xAxis][yAxis] = yAxis === this.snakeCoordinates[x][i] && xAxis === this.snakeCoordinates[y][i] ? 1 : 0;
                //             if (this.pos === 1) {
                //                 console.log(xAxis, yAxis);
                //             }
                //         }
                //     }
                // }
                this.initFoodMatrix();

                if (this.snake.x < this.canvas.width && this.snake.x >= 0
                    && this.snake.y < this.canvas.height && this.snake.y >= 0) {
                    // for (let i = 0; i < this.snakeCoordinates[x].length; i++) {
                    //     this.slotsAvailableForFoodToSpawn[this.snakeCoordinates[y][i]][this.snakeCoordinates[x][i]] = 1;
                    // }
                    for (let i = this.snakeCoordinates[x].length - 1; i > 0; i--) {
                        this.slotsAvailableForFoodToSpawn[this.snakeCoordinates[y][i]][this.snakeCoordinates[x][i]] = 1;
                    }
                }

                // if (this.foodEaten === 6) {
                //     console.table(this.slotsAvailableForFoodToSpawn)
                // }
                // if (this.pos === 50) {
                //     console.table(this.slotsAvailableForFoodToSpawn);
                //     console.log(this.foodEaten, this.snakeCoordinates[x].length);
                //     console.table(this.snakeCoordinates)
                // }
                // if (this.pos === 1){
                //     console.log(this.slotsAvailableForFoodToSpawn[150].length);
                // }
                this.snake.drawSnake();
                this.snake.generateFood();

                switch (direction) {
                    // LEFT : X AXIS
                    case "l":
                        this.snake.resetKeys("l");
                        this.currentAxis.x = true;
                        this.currentAxis.y = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snake.x === this.currentFoodPos.x && this.snake.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snake.generateFood();
                        }

                        // if it's not the first move
                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        // if the snake doesn't hit the edge of the canvas
                        if (this.snake.x >= 0 && this.snake.x < this.canvas.width) {
                            //make it move
                            this.snake.x -= this.defaultSnakeWidth;
                        } else {
                            this.endTheGame();
                        }
                        break;

                    // RIGHT : X AXIS
                    case "r":
                        this.snake.resetKeys("r");
                        this.currentAxis.x = true;
                        this.currentAxis.y = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snake.x === this.currentFoodPos.x && this.snake.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snake.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snake.x >= 0 && this.snake.x < this.canvas.width) {
                            this.snake.x += this.defaultSnakeWidth;
                        } else {
                            this.endTheGame();
                        }
                        break;

                    // TOP : Y AXIS
                    case "t":
                        this.snake.resetKeys("t");
                        this.currentAxis.y = true;
                        this.currentAxis.x = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snake.x === this.currentFoodPos.x && this.snake.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snake.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snake.y >= 0 && this.snake.y < this.canvas.height) {
                            this.snake.y -= this.defaultSnakeHeight;
                        } else {
                            this.endTheGame();
                        }
                        break;

                    // BOTTOM : Y AXIS
                    case "b":
                        this.snake.resetKeys("b");
                        this.currentAxis.y = true;
                        this.currentAxis.x = false;

                        // if the snake eats the food then regenerate a new one
                        if (this.snake.x === this.currentFoodPos.x && this.snake.y === this.currentFoodPos.y) {
                            this.foodEaten++;
                            this.foodHasSpawned = false;
                            this.snake.generateFood();
                        }

                        if (this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }

                        if (this.snake.y >= 0 && this.snake.y < this.canvas.height) {
                            this.snake.y += this.defaultSnakeHeight;
                        } else {
                            this.endTheGame();
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
                    console.log(`x : ${this._generateRandomPosition()['x']} | y : ${this._generateRandomPosition()['y']}`);
                    this.ctx.rect(this.currentFoodPos.x = this._generateRandomPosition()['x'], this.currentFoodPos.y = this._generateRandomPosition()['y'], this.snake.width, this.snake.height);
                    // this.ctx.rect(this.currentFoodPos.x = 60, this.currentFoodPos.y = 60, this.snake.width, this.snake.height);
                    this.ctx.fillStyle = this.snake.foodColor;
                    this.ctx.fill();
                    this.ctx.closePath();
                    this.foodHasSpawned = true;
                }
            }
        };
        this.snake.drawSnake();
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

        let x = 0;
        let y = 1;

        random.x = this._getRandomNumber(0, (this.canvas.width - this.defaultSnakeWidth) / 10);
        random.y = this._getRandomNumber(0, (this.canvas.height - this.defaultSnakeHeight) / 10);

        // if (this.pos === 0) {
        //     if (random.x !== this.snake.x && random.y !== this.snake.y) {
        //         return random;
        //     } else {
        //         return this._generateRandomPosition();
        //     }
        // } else {
        //     for (let i = 0; i < this.snakeCoordinates[x].length; i++) {
        //         if(this.slotsAvailableForFoodToSpawn[this.snakeCoordinates[y][i]][this.snakeCoordinates[x][i]] === 1){
        //             console.log("recurs");
        //             return this._generateRandomPosition();
        //         }
        //     }
        //     return random;
        // checks the snake's position if it doesn't match with the random position

        if (this.pos === 0) {
            if (random.x !== this.snake.x && random.y !== this.snake.y) {
                console.log("pos 0 normal", `x : ${random.x} | y : ${random.y}`);
                return random;
            } else {
                console.log("pos 0 rec");
                return this._generateRandomPosition();
            }
        } else {
            console.log("mdr");
            if (this.snakeCoordinates[x].indexOf(random.x) !== -1 && this.snakeCoordinates[y].indexOf(random.y) !== -1) {
                console.log("rec");
                return this._generateRandomPosition();
            } else {
                console.log("normal", `x : ${random.x} | y : ${random.y}`);

                return random;
            }
            // if(this.slotsAvailableForFoodToSpawn[])
            // if (this.slotsAvailableForFoodToSpawn[random.x][random.y] === 1) {
            //     console.log("recurse");
            //     return this._generateRandomPosition();
            // } else {
            //     console.log("normal");
            //     return random;
            // }
            // if(this.snakeCoordinates.indexOf())
        }
    }

    initFoodMatrix() {
        // set all the slots available to 0 except the ones where the snake currently is
        for (let xAxis = 0; xAxis < this.canvas.width; xAxis += this.defaultSnakeWidth) {
            this.slotsAvailableForFoodToSpawn[xAxis] = [];
            for (let yAxis = 0; yAxis < this.canvas.height; yAxis += this.defaultSnakeHeight) {
                this.slotsAvailableForFoodToSpawn[xAxis][yAxis] = 0;
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

    reset() {
        // this.isGameOver     = false;
        // this.foodEaten      = 0;
        // this.pos            = 0;
        // this.movesCount     = 0;
        // this.foodHasSpawned = false;

    }

    endTheGame() {
        // stop the interval of the last move
        clearInterval(this.interval[this.direction[this.movesCount - 1]]);
        // clear the canvas
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.retryBtn.classList.add('active');
        }, this.refreshRate + 20)
        this.isGameOver = true;
    }
}
