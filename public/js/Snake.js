class Snake {
    constructor() {
        this.canvas             = document.getElementById('snake');
        this.playBtn            = document.getElementById('play');
        this.ctx                = null;
        this.snakeShape         = null;
        this.defaultSnakeWidth  = 10;
        this.defaultSnakeHeight = 10;
        this.refreshRate = 200;

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

                    console.log(this.direction.length);
                    this.movesCount += 1;
                    if(this.movesCount >= 1) {
                        this.hasDirectionChanged = true;
                        this.direction.push('l');
                    }
                    this.interval.l = setInterval(() => {
                        this.snakeShape.updateCanvas("l")
                    }, this.refreshRate);
                break;

                case this.keybinds.r:

                    console.log(this.direction.length);
                    this.movesCount += 1;
                    if(this.movesCount >= 1) {
                        this.hasDirectionChanged = true;
                        this.direction.push('r');
                    }
                    this.interval.r = setInterval(() => {
                        this.snakeShape.updateCanvas("r")
                    }, this.refreshRate);
                break;

                case this.keybinds.t:

                    console.log(this.direction.length);
                    this.movesCount += 1;
                    if(this.movesCount >= 1) {
                        this.hasDirectionChanged = true;
                        this.direction.push('t');
                    }
                    this.interval.t = setInterval(() => {
                        this.snakeShape.updateCanvas("t")
                    }, this.refreshRate);
                break;

                case this.keybinds.b:

                    console.log(this.direction.length);
                    this.movesCount += 1;
                    if(this.movesCount >= 1) {
                        this.hasDirectionChanged = true;
                        this.direction.push('b');
                    }
                    this.interval.b = setInterval(() => {
                        this.snakeShape.updateCanvas("b")
                    }, this.refreshRate);
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

            draw: () => {
                this.ctx.beginPath();
                this.ctx.rect(this.snakeShape.x, this.snakeShape.y, this.snakeShape.width, this.snakeShape.height);
                this.ctx.fillStyle = this.snakeShape.color;
                this.ctx.fill();
                this.ctx.closePath();
            },

            updateCanvas: (direction) => {
                this.snakeShape.draw();
                switch (direction) {
                    // LEFT : X AXIS
                    case "l":
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }
                        this.snakeShape.x -= this.defaultSnakeWidth;
                        break;

                    // RIGHT : X AXIS
                    case "r":
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }
                        this.snakeShape.x += this.defaultSnakeWidth;
                        break;

                    // TOP : Y AXIS
                    case "t":
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }
                        this.snakeShape.y -= this.defaultSnakeHeight;
                        break;

                    // BOTTOM : Y AXIS
                    case "b":
                        if(this.movesCount > 1) {
                            // stop the interval of the previous move
                            clearInterval(this.interval[this.direction[this.movesCount - 2]]);
                        }
                        this.snakeShape.y += this.defaultSnakeHeight;
                        break;
                }
            }
        };

        this.snakeShape.draw();
    }
}