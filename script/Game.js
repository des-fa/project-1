import Character from './Character.js'
import Obstacle from './Obstacle.js'

function Game({ id, loopInterval, initDimension }) {
  const game = {
    $elem: $(id),
    id,
    dimension: initDimension,
    loop: null,
    player: null,
    obstacles: [],
    lastObstacleSpawn: new Date()
  }

  // Set the game width and height
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

  const generateObstacles = () => {
    const currTime = new Date()
    const timeDiff = currTime - game.lastObstacleSpawn

    if (timeDiff >= 3000) {
      console.log('spawn')
      game.lastObstacleSpawn = currTime
    }
  }

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

  const handleGameLoop = () => {
    generateObstacles()
    updateMovements()
  }

  this.startGame = () => {
    $(document).on('keydown', handleKeyDown)
    $(document).on('keyup', handleKeyUp)

    game.loop = setInterval(handleGameLoop, loopInterval)
  }

  this.addPlayer = (setting) => {
    game.player = new Character(setting, game.$elem)
  }

  this.addObstacle = (setting) => {
    game.obstacles.push(new Obstacle(setting, game.$elem))
  }
}

export default Game
