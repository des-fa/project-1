function Obstacle({initDimension, initVelocity, initBackground, initPos}, $game) {
  const obstacle = {
    $elem: null,
    id: `_${Math.random().toString(36).substring(2, 15)}`,
    dimension: initDimension,
    velocity: initVelocity,
    background: initBackground,
    position: initPos,
  }

  // Initialize Obstacle & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = obstacle
    obstacle.$elem = $(`<div id="${id}"></div>`)
      .css('left', x)
      .css('top', y)
      .css('background', background)
      .css('width', w)
      .css('height', h)
      .css('position', 'absolute')
      .appendTo('#game-screen')
  }
  init()

  // Everytime this gets invoked, update obstacle position, return false if outside of game box
  this.moveObstacle = () => {
    const gameH = $game.height()
    const {
      velocity,
      position: { y },
    } = obstacle

    let newY = y
    newY = newY + velocity

    obstacle.position.y = newY
    obstacle.$elem.css('top', newY)

    return newY < gameH
  }

  this.removeObstacle = () => {
    obstacle.$elem.remove()
  }

  this.getInfo = () => {
    return {
      dimension: obstacle.dimension,
      position: obstacle.position
    }
  }
}

export default Obstacle
