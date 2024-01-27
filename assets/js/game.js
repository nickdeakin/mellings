'use strict';

class Game {
    static INITIAL = 1;
    static GAME_PLAYING = 2;
    static GAME_OVER = 3;

    // Base
    ctx;
    canvas;

    // Game state
    currentState = Game.INITIAL;

    // Game speed
    velocity = -5;

    textParams = {
        textType: 'fill',
        font: '36px Verdana',
        fillStyle: 'white',
        centered: true
    };

    backgroundParams = {
        fillStyle: 'rgba(0,0,0,0.7)',
        fullscreen: true
    }

    worldBoundary;
    background;
    score;
    mellingFactory;

    gameObjects = [];
    mouseDelegates = [];

    constructor(context, canvas) {
        this.ctx = context;
        this.canvas = canvas;
    }

    start = async () => {
        // Start game
        this.currentState = Game.INITIAL;
        this.runLoop();
        this.bindEvents();
    };

    startNewGame = async () => {        
        await this.createGameObjects();
        
        this.score.reset();
        
        this.currentState = Game.GAME_PLAYING;
    };

    bindEvents = () => {
        // Mouse events
        this.canvas.addEventListener('click', this.click);
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mouseup', this.mouseUp);
        
        // Key events
        window.addEventListener('keydown', this.keyPress);
    }

    mouseMove = event => {
        this.mouseDelegates.forEach(x => x.mouseMove && x.mouseMove(event));
    }

    mouseDown = event => {
        this.mouseDelegates.forEach(x => x.mouseDown && x.mouseDown(event));
    }

    mouseUp = event => {
        this.mouseDelegates.forEach(x => x.mouseUp && x.mouseUp(event));
    }

    click = event => {
        switch (this.currentState) {
            case Game.INITIAL:
                this.startNewGame();
                break;
            case Game.GAME_PLAYING:

                break;
            case Game.GAME_OVER:
                break;
            default:
        }
    }

    keyPress = event => {
        switch (this.currentState) {
            case Game.INITIAL:
                break;
            case Game.GAME_PLAYING:
                break;
            case Game.GAME_OVER:
                switch (event.keyCode) {
                    case KEY_CODE.R:
                        this.currentState = Game.INITIAL
                        break;
                }
                break;
            default:
        }

    }

    runLoop = () => {
        requestAnimationFrame(this.runGameLoop);
    }

    deadDelegate = dead => {
        this.score.deductLife();
        if (this.score.lives < 1) {
            this.currentState = Game.GAME_OVER
        } else {
            this.restart();
        }
    }

    scoreDelegate = amount => {
        this.score.addScore(amount);
    }

    runGameLoop = () => {
        // Game state
        switch (this.currentState) {
            case Game.INITIAL:
                // Draw initial screen
                this.drawInitialScreen();
                break;
            case Game.GAME_PLAYING:
                // Draw game playing screen
                this.drawPlayingScreen();
                break;
            case Game.GAME_OVER:
                // Draw game over screen
                this.drawGameOverScreen();
                break;
            default:
        }
        this.runLoop();
    };

    // Refactor
    createGameObjects = async () => {
        this.mouseDelegates = [];
        this.gameObjects = [];

        this.background = new GameBackground(this.ctx, this.canvas, 'rgba(20, 20, 20, 1)');
        this.score = new GameScore(this.ctx, this.canvas);
        this.mellingFactory = new MellingFactory(this.ctx, this.canvas);
        this.mellingFactory.scoreDelegate = this.scoreDelegate;

        this.gameObjects.push(this.background);
        this.gameObjects.push(this.mellingFactory);
        this.gameObjects.push(this.score);

        this.testLevel();

        this.restart();
    };

    testLevel = () => {
        const melling1 = new Melling(this.ctx, this.canvas);
        melling1.spawn(1600, 500);        
        this.gameObjects.push(melling1);        

        const obsticle1 = new Obsticle(this.ctx, this.canvas);
        obsticle1.setBounds(700, 688, 300, 500, 'rgba(90, 90, 90, 1)');
        this.gameObjects.push(obsticle1);

        this.worldBoundary = new WorldBoundary(this.ctx, this.canvas);
        this.worldBoundary.setBoundary(true, true, true, true, 5, 'rgba(50, 50, 50, 1)');
        this.gameObjects.push(this.worldBoundary);
    };

    restart = () => {
        
    };

    detectCollisions = () => {
        this.gameObjects.forEach(x => {
            this.gameObjects.forEach(y => {
                if (y !== x && y.canCollide && x.canCollide) {
                    if (x.testCollision && x.testCollision(y)) {
                        if (x.didCollide) {
                            x.didCollide(y);
                        }
                    }
                }
            });
        });
    };

    applyCollisions = () => {
        this.gameObjects.forEach(x => {
            if (x.applyCollision) {
                x.applyCollision();
            }
        });
    };

    update = () => {
        this.gameObjects.forEach(x => {
            x.update();
        });
    };

    clearScreen = () => {
        this.ctx.clearRect(0, 0 ,canvas.width, canvas.height);
    };

    drawInitialScreen = () => {
        this.clearScreen();
        fillRect(this.ctx, this.backgroundParams);
        drawText(this.ctx, this.textParams, '... Click to start ...');
    };

    drawPlayingScreen = () => {
        this.detectCollisions();
        this.applyCollisions();
        this.update();
        this.clearScreen();
        this.gameObjects.forEach(x => {
            x.draw();
        });
    };

    drawGameOverScreen = () => {
        this.clearScreen();
        fillRect(this.ctx, this.backgroundParams);
        
        this.score.draw();
        drawText(this.ctx, { ...this.textParams, ...{ extraY: -32 } }, '... Game over ...');
        drawText(this.ctx, { ...this.textParams, ...{ extraY: 32 } }, 'Press R to reload');
    };
}
