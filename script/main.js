import Game from './Game.js'

// CONSTANTS
const GAME_WIDTH = 600
const GAME_HEIGHT = 700
const CHARACTER_WIDTH = 50
const CHARACTER_HEIGHT = 50
const VELOCITY = 2.5
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)

const gameSettings = ({
  id: '#game-screen',
  loopInterval: LOOP_INTERVAL,
  initDimension: {
    w: GAME_WIDTH,
    h: GAME_HEIGHT
  }
})

const player = {
  initDimension: {
    w: CHARACTER_WIDTH,
    h: CHARACTER_HEIGHT
  },
  initVelocity: VELOCITY,
  initPos: { x: (GAME_WIDTH - CHARACTER_WIDTH) / 2, y: GAME_HEIGHT - CHARACTER_HEIGHT },
  initBackground: 'red',
  movementKeys: {
    left: 37,
    right: 39,
  }
}

const obstacle = {
  initDimension: {
    w: CHARACTER_WIDTH,
    h: CHARACTER_HEIGHT
  },
  initVelocity: VELOCITY,
  initPos: { x: 0, y: 0},
  initBackground: 'blue',
}

const game = new Game(gameSettings)
game.addPlayer(player)
// game.addObstacle(obstacle)
game.startGame()
