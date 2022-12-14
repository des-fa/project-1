import Character from './Character.js'
import ObstacleA from './ObstacleA.js'
import ObstacleB from './ObstacleB.js'
import Item from './Item.js'

// JQUERY CONSTANTS
const $startScreen = $("#start-screen")
const $firstInstructions = $("#first-instructions-screen")
const $secondInstructions = $("#second-instructions-screen")
const $gameOver = $("#game-over-screen")
const $gameArea = $("#game-area")
const $countdownDiv = $("#countdown-container")
const $countdown = $("#countdown")
const $score = $(".score")
const $inGameCounter= $("#in-game-counter")

// GAME CONSTANTS
const DIMENSION = { w: 450, h: 700 }
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)

// OBSTACLE CONSTANTS
const ObstacleA_DIMENSION = { h: 50 }
const ObstacleA_VELOCITY = 3.75
const ObstacleA_SIZES = [100, 150, 200, 250, 300]
const ObstacleA_BACKGROUND = '#EEF1FF'
const ObstacleB_DIMENSION = { w: 50, h: 50 }
const ObstacleB_VELOCITY = 3.8
const ObstacleB_BACKGROUND = '#EFEFEF'

// ITEM CONSTANTS
const Item_DIMENSION = { w: 35, h: 35  }
const Item_VELOCITY = 3.2

// Util Functions

// Generate Random Number for Obstacle Creation
const getRandomMS = () => {
  let randomMS = Math.floor(Math.random() * (1500 - 1000 + 1) + 1000)
  return randomMS
}

// Generate Random Number for Obstacle Size
const getRandomSize = () => {
  let randomSize = ObstacleA_SIZES[Math.floor(Math.random() * ObstacleA_SIZES.length)]
  return randomSize
}

// Generate Random Number of Items
const getRandomItemQuantity = () => {
  let randomItemQ = Math.floor(Math.random() * (4 - 1 + 1) + 1)
  return randomItemQ
}

function Game() {
  this.$elem = null
  this.id = 'game-area'
  this.dimension = DIMENSION
  this.loop = null
  this.player = null
  this.obstacles = []
  this.items = []
  this.lastObjectSpawn = new Date()
  this.spawnCD = 0
  this.scoreStartTime = null
  this.score = null
  this.bonus = null
  this.detectCollision = true

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
    $score.html(this.score + this.bonus)
  }

  // Generate Obstacles & Items
  const generateGameObjects = () => {
    const currTime = new Date()
    const timeDiff = currTime - this.lastObjectSpawn

    if (timeDiff >= this.spawnCD) {
      this.spawnCD = getRandomMS()
      this.lastObjectSpawn = currTime

      let newObstacle = null
      let newItem = null

      // Weighted Randomization of Objects
      const assignObjectWeight = [['obstacles', 17], ['items', 11]]
      const weightedObjects = assignObjectWeight.map(([x, y]) => Array(y).fill(x)).flat()
      const randomObjectIndex= Math.floor(Math.random() * weightedObjects.length)
      const randomObject= weightedObjects[randomObjectIndex]

      if(randomObject === 'items') {
        // Generate Item w/ Random Position
        const itemPositions = [25, 90, 180, 270, 360]
        const randomItemNum= getRandomItemQuantity()
        for (let i = 0; i< randomItemNum; i += 1) {
          const index = Math.floor(Math.random() * itemPositions.length)
          const randomItemPos = itemPositions[index]
          itemPositions.splice(index, 1)

          newItem = new Item({
            initDimension: { ...Item_DIMENSION },
            initVelocity: Item_VELOCITY,
            initPos: { x: randomItemPos, y: 0 }
          }, this.$elem)
          this.items.push(newItem)
        }
      } else {
        // Generate Random Obstacles
        if (Math.random() < 0.5) {
          // Generate Obstacle A
          const randomWidth = getRandomSize()
          const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w - randomWidth
          newObstacle = new ObstacleA({
            initDimension: {...ObstacleA_DIMENSION, w: randomWidth},
            initVelocity: ObstacleA_VELOCITY,
            initBackground: ObstacleA_BACKGROUND,
            initPos: { x: randomPos, y: 0 }
          }, this.$elem)
        } else {
          // Generate Obstacle B
          const randomPos = Math.random() < 0.5 ? 0 : DIMENSION.w -   ObstacleB_DIMENSION.w
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
  }

  // Update Character & Objects' Movements
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
    for (let i = 0; i < this.items.length; i += 1) {
      const item = this.items[i];
      const isInScreen = item.moveItem()
      if (!isInScreen) {
        item.removeItem()
        this.items.splice(i, 1)
        i -= 1
      }
    }
  }

  //Detect collision
  const detectColl = () => {
    const {
      position: { x: cX, y: cY },
      dimension: { w: cW, h: cH },
    } = this.player

    if (this.detectCollision) {
      this.obstacles.forEach(({
        position: { x: oX, y: oY },
        dimension: { w: oW, h: oH }
      }) => {
        // Obstacles A & B stop game
        const hasCollided = cX < oX + oW && cX + cW > oX && cY <  oY + oH && cY + cH > oY
        if (hasCollided) {
          // $elem.css('background', 'black')
          this.stopGame()
        }
      })
    }

    this.items.forEach((item, i) => {
      // Extract stuff from item
      const {
        $elem,
        position: { x: iX, y: iY },
        dimension: { w: iW, h: iH },
        triggered,
        reward,
      } = item

      // Items fade Out
      const hasCollided = cX < iX + iW && cX + cW > iX && cY <  iY + iH && cY + cH > iY
      if (hasCollided && !triggered) {
        this.bonus += reward
        $elem.fadeOut()
        item.triggered = true
        item.effect(this)
      }
    })
  }

  // Interval Handler
  const handleGameLoop = () => {
    generateGameObjects()
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
    this.$elem.find(":not(:nth-child(-n + 3))").remove()

    // Show Game Over Screen
    $gameArea.fadeOut()
    $gameOver.fadeIn()
    $inGameCounter.hide()

    // Reset Variables
    this.loop = null
    this.player = null
    this.obstacles = []
    this.items = []
    this.lastObjectSpawn = new Date() - 3000
    this.scoreStartTime = null
    this.score = null
    this.bonus = null
  }

  // Show First Instructions
  this.showFirstInstructions = () => {
    $startScreen.fadeOut()
    $firstInstructions.fadeIn()
  }

  // Show Second Instructions
  this.showSecondInstructions = () => {
    $firstInstructions.fadeOut()
    $secondInstructions.fadeIn()
  }

  // Back to First Instructions
  this.backToFirstInstructions = () => {
    $secondInstructions.fadeOut()
    $firstInstructions.fadeIn()
  }

  // Back to Start Screen
  this.backToHome = () => {
    $firstInstructions.fadeOut()
    $secondInstructions.fadeOut()
    $startScreen.fadeIn()
  }
}

export default Game
