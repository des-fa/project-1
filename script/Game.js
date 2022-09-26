import Character from './Character.js'
import Obstacle from './Obstacle.js'

// GAME CONSTANTS
const DIMENSION = { w: 400, h: 700 }
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)

// OBSTACLE CONSTANTS
const O_DIMENSION = { h: 50 }
const O_VELOCITY = 2.5
const O_BACKGROUND = 'blue'

// Util Functions

// Generate Random Number for Obstacle Creation
const getRandomMS = () => {
  let randomMS = Math.floor(Math.random() * (5000 - 1500 + 1) + 1500)
  return randomMS
}

// Generate Random Number for Obstacle Size
const getRandomSize = () => {
  let randomSize = Math.floor(Math.random() * (300 - 50 + 1) + 50)
  return randomSize
}

function Game() {
  const game = {
    $elem: $('#game-screen'),
    id: 'game-screen',
    dimension: DIMENSION,
    loop: null,
    player: null,
    obstacles: [],
    lastObstacleSpawn: new Date(),
    spawnCD: 0
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

    if (timeDiff >= game.spawnCD) {
      const randomWidth = getRandomSize()
      const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w - randomWidth

      game.spawnCD = getRandomMS()
      game.lastObstacleSpawn = currTime
      game.obstacles.push(new Obstacle({
        initDimension: {...O_DIMENSION, w: randomWidth},
        initVelocity: O_VELOCITY,
        initBackground: O_BACKGROUND,
        initPos: { x: randomPos, y: 0 }
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

  //Detect collision
  const detectColl = () => {
    const {
      $elem,
      position: { x: cX, y: cY },
      dimension: { w: cW, h: cH }
    } = game.player.getInfo()

    game.obstacles.forEach(function(obstacle) {
      const {
        position: { x: oX, y: oY },
        dimension: { w: oW, h: oH }
      } = obstacle.getInfo()

      if (
        cX < oX + oW &&
        cX + cW > oX &&
        cY < oY + oH &&
        cY + cH > oY
      ) {
        console.log('collision')
        $elem.css('background', 'black')
      } else {
        $elem.css('background', 'green')
      }
    })
  }

  // Interval Handler
  const handleGameLoop = () => {
    generateObstacles()
    updateMovements()
    detectColl()
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
