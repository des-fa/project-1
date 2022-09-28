import Character from './Character.js'
import ObstacleA from './ObstacleA.js'
import ObstacleB from './ObstacleB.js'
import Item from './Item.js'

// JQUERY CONSTANTS
const $startScreen = $("#start-screen")
const $instructions = $("#instructions-screen")
const $gameOver = $("#game-over-screen")
const $gameArea = $("#game-area")
const $countdownDiv = $("#countdown-container")
const $countdown = $("#countdown")
const $score = $(".score")
const $inGameCounter= $("#in-game-counter")

// GAME CONSTANTS
const DIMENSION = { w: 400, h: 700 }
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)

// OBSTACLE CONSTANTS
const ObstacleA_DIMENSION = { h: 50 }
const ObstacleA_VELOCITY = 2.5
const ObstacleA_BACKGROUND = 'blue'
const ObstacleB_DIMENSION = { w: 50, h: 50 }
const ObstacleB_VELOCITY = 2.5
const ObstacleB_BACKGROUND = 'pink'

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
  this.id = 'game-area'
  this.dimension = DIMENSION
  this.loop = null
  this.player = null
  this.obstacles = []
  this.lastObstacleSpawn = new Date()
  this.spawnCD = 0
  this.scoreStartTime = null
  this.score = null

  // Initialize Game
  const init = () => {
    const { dimension: { w, h } } = this

    // Set Game Screen
    $('#game-screen').css('width', w).css('height', h)
    // Set Game Area
    this.$elem = $('#game-area')
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
  // Track Score
  const trackScore= () => {
    if (!this.scoreStartTime) this.scoreStartTime = new Date()

    const currT = new Date()
    this.score = Math.floor((currT - this.scoreStartTime) / 1000)
    $score.html(this.score)
  }

  // Generate Obstacles
  const generateObstacles = () => {
    const currTime = new Date()
    const timeDiff = currTime - this.lastObstacleSpawn

    if (timeDiff >= this.spawnCD) {
      this.spawnCD = getRandomMS()
      this.lastObstacleSpawn = currTime

      let newObstacle = null
      if (Math.random() < 0.5) {
        const randomWidth = getRandomSize()
        const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w - randomWidth
        newObstacle = new ObstacleA({
          initDimension: {...ObstacleA_DIMENSION, w: randomWidth},
          initVelocity: ObstacleA_VELOCITY,
          initBackground: ObstacleA_BACKGROUND,
          initPos: { x: randomPos, y: 0 }
        }, this.$elem)

      } else {
        const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w - ObstacleB_DIMENSION.w
        newObstacle = new ObstacleB({
          initDimension: { ...ObstacleB_DIMENSION },
          initVelocity: ObstacleB_VELOCITY,
          initBackground: ObstacleB_BACKGROUND,
          initPos: { x: randomPos, y: 0 }
        }, this.$elem)
      }

      this.obstacles.push(newObstacle)
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
      // obstacles A & B stop game
      const hasCollided = cX < oX + oW && cX + cW > oX && cY < oY + oH && cY + cH > oY
      if (hasCollided) {
        $elem.css('background', 'black')
        this.stopGame()
      }
    })
  }

  // Interval Handler
  const handleGameLoop = () => {
    generateObstacles()
    updateMovements()
    trackScore()
    detectColl()
  }

  // Start Game
  this.startGame = () => {
    $(document).on('keydown', handleKeyDown)
    $(document).on('keyup', handleKeyUp)

    // Show Game Screen & Elements
    $startScreen.fadeOut()
    $gameOver.hide()
    $gameArea.fadeIn()
    $countdownDiv.fadeIn()

    // Restart Score
    $score.html('0')

    //Countdown to Play
    let countdown = ['3', '2', '1', 'GO!', '']
    countdown.forEach((text, i) => {
      setTimeout(() => {
        $countdown.html(text)

        if (i === 4) {
          $countdownDiv.hide()
          $inGameCounter.show()

          // Initialize Character
          this.player = new Character(this.$elem)

          // Start Interval
          this.loop = setInterval(handleGameLoop, LOOP_INTERVAL)
        }
      }, i * 1000)
    })

  }

  // Stop Game
  this.stopGame = () => {
    $(document).off('keydown', handleKeyDown)
    $(document).off('keyup', handleKeyUp)

    // Clear Interval
    clearInterval(this.loop)

    // Clear Game Screen
    this.$elem.find(":not(:nth-child(-n + 2))").remove()

    // Show Game Over Screen
    $gameArea.fadeOut()
    $gameOver.fadeIn()
    $inGameCounter.hide()

    // Reset Variables
    this.loop = null
    this.player = null
    this.obstacles = []
    this.lastObstacleSpawn = new Date() - 3000
    this.scoreStartTime = null
    this.score = null
  }

  // Show Instructions
  this.showInstructions = () => {
    $startScreen.fadeOut()
    $instructions.fadeIn()
  }

  // Back to Start Screen
  this.backToStart = () => {
    $instructions.fadeOut()
    $startScreen.fadeIn()
  }
}

export default Game
