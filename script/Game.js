import Character from './Character.js'
import Obstacle from './Obstacle.js'

// GAME CONSTANTS
const DIMENSION = { w: 600, h: 700 }
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)

// OBSTACLE CONTACTS
const O_DIMENSION = { w: 50, h: 50 }
const O_VELOCITY = 2.5
const O_BACKGROUND = 'blue'

function Game() {
  const game = {
    $elem: $('#game-screen'),
    id: 'game-screen',
    dimension: DIMENSION,
    loop: null,
    player: null,
    obstacles: [],
    lastObstacleSpawn: new Date() - 3000
  }

  // Initialize Game
  const init = () => {
    const { dimension: { w, h } } = game
    game.$elem
      .css('width', w)
      .css('height', h)
  }
  init()

  // Handling Key Down
  const handleKeyDown = (e) => {
    game.player.setCharacterMovement(true, e.keyCode)
  }

  // Handling Key Up
  const handleKeyUp = (e) => {
    game.player.setCharacterMovement(false, e.keyCode)
  }

  // Generate Obstacles
  const generateObstacles = () => {
    const currTime = new Date()
    const timeDiff = currTime - game.lastObstacleSpawn

    if (timeDiff >= 3000) {
      console.log('spawn')
      game.lastObstacleSpawn = currTime
      game.obstacles.push(new Obstacle({
        initDimension: O_DIMENSION,
        initVelocity: O_VELOCITY,
        initBackground: O_BACKGROUND,
        initPos: { x: 0, y: 0 }
      }, game.$elem))
    }
  }

  // Update Character & Obstacles Movements
  const updateMovements = () => {
    // Move Character
    game.player.moveCharacter()

    // Move Objects & Clean Up
    for (let i = 0; i < game.obstacles.length; i += 1) {
      const obstacle = game.obstacles[i];
      const isInScreen = obstacle.moveObstacle()
      if (!isInScreen) {
        obstacle.removeObstacle()
        game.obstacles.splice(i, 1)
        i -= 1
      }
    }
  }

  // Interval Handler
  const handleGameLoop = () => {
    generateObstacles()
    updateMovements()
  }

  this.startGame = () => {
    $(document).on('keydown', handleKeyDown)
    $(document).on('keyup', handleKeyUp)

    // Initialize Character
    game.player = new Character(game.$elem)

    // Start Interval
    game.loop = setInterval(handleGameLoop, LOOP_INTERVAL)
  }

  this.stopGame = () => {
    $(document).off('keydown', handleKeyDown)
    $(document).off('keyup', handleKeyUp)

    // Clear Interval
    clearInterval(game.loop)

    // Clear Game Screen
    game.$elem.empty()

    // Reset Variables
    game.loop = null
    game.player = null
    game.obstacles = []
    game.lastObstacleSpawn = new Date() - 3000
  }
}

export default Game
