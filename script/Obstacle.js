function Obstacle({ initDimension, initVelocity, initPos, initBackground }, $game) {
  const obstacle = {
    $elem: null,
    id: `_${Math.random().toString(36).substring(2, 15)}`,
    dimension: initDimension,
    velocity: initVelocity,
    position: initPos,
    background: initBackground
  }

  // Create obstacle and appends the obstacle to game-screen
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
      dimension: { h },
      position: { y },
    } = obstacle

    let newY = y
    newY = newY + velocity

    obstacle.position.y = newY
    obstacle.$elem.css('top', newY)

    if (newY >= gameH) {
      return false
    } else {
      return true
    }
  }

  this.removeObstacle = () => {
    obstacle.$elem.remove()
  }
}

export default Obstacle
