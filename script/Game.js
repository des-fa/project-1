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
  this.$elem = null
  this.id = 'game-screen'
  this.dimension = DIMENSION
  this.loop = null
  this.player = null
  this.obstacles = []
  this.lastObstacleSpawn = new Date()
  this.spawnCD = 0

  // Initialize Game
  const init = () => {
    const { dimension: { w, h } } = this

    this.$elem = $('#game-screen')
      .css('width', w)
      .css('height', h)
  }
  init()

  // Handling Key Down
  const handleKeyDown = (e) => {
    this.player.setCharacterMovement(true, e.keyCode)
  }

  // Handling Key Up
  const handleKeyUp = (e) => {
    this.player.setCharacterMovement(false, e.keyCode)
  }

  // Generate Obstacles
  const generateObstacles = () => {
    const currTime = new Date()
    const timeDiff = currTime - this.lastObstacleSpawn

    if (timeDiff >= this.spawnCD) {
      const randomWidth = getRandomSize()
      const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w - randomWidth

      this.spawnCD = getRandomMS()
      this.lastObstacleSpawn = currTime
      this.obstacles.push(new Obstacle({
        initDimension: {...O_DIMENSION, w: randomWidth},
        initVelocity: O_VELOCITY,
        initBackground: O_BACKGROUND,
        initPos: { x: randomPos, y: 0 }
      }, this.$elem))
    }
  }

  // Update Character & Obstacles Movements
  const updateMovements = () => {
    // Move Character
    this.player.moveCharacter()

    // Move Objects & Clean Up
    for (let i = 0; i < this.obstacles.length; i += 1) {
      const obstacle = this.obstacles[i];
      const isInScreen = obstacle.moveObstacle()
      if (!isInScreen) {
        obstacle.removeObstacle()
        this.obstacles.splice(i, 1)
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
    } = this.player

    this.obstacles.forEach(({ position: { x: oX, y: oY }, dimension: { w: oW, h: oH } }) => {
      // ! Do not need to have an else statement because if the first if statement is true it should stop running or minus health...etc
      const hasCollided = cX < oX + oW && cX + cW > oX && cY < oY + oH && cY + cH > oY
      if (hasCollided) {
        // console.log('collision')
        $elem.css('background', 'black')
        this.stopGame()
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
    this.player = new Character(this.$elem)

    // Start Interval
    this.loop = setInterval(handleGameLoop, LOOP_INTERVAL)
  }

  this.stopGame = () => {
    $(document).off('keydown', handleKeyDown)
    $(document).off('keyup', handleKeyUp)

    // Clear Interval
    clearInterval(this.loop)

    // Clear Game Screen
    this.$elem.empty()

    // Reset Variables
    this.loop = null
    this.player = null
    this.obstacles = []
    this.lastObstacleSpawn = new Date() - 3000
  }
}

export default Game
