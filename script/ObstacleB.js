function ObstacleB({initDimension, initVelocity, initBackground, initPos}, $game) {
  this.$elem = null
  this.id = `_${Math.random().toString(36).substring(2, 15)}`
  this.type = B
  this.dimension = initDimension
  this.velocity = initVelocity
  this.background = initBackground
  this.position = initPos

  // Initialize Obstacle & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = this

    this.$elem = $(`<div id="${id}"></div>`)
      .css('left', x)
      .css('top', y)
      .css('background', background)
      .css('width', w)
      .css('height', h)
      .css('position', 'absolute')
      .appendTo($game)
  }
  init()

  // Everytime this gets invoked, update obstacle position, return false if outside of game box
  this.moveObstacle = () => {
    const gameW = $game.width()
    const gameH = $game.height()
    const {
      dimension: { w, h },
      position: { x, y }, velocity } = this
      movement: { left, right }

    let newX = x
    let newY = y
    newX = newX + velocity
    newY = newY + velocity

    if (left) {
      newX = x - velocity < 0 ? 0 : newX - velocity
    }
    if (right) {
      newX = x + w + velocity > gameW ? gameW - w : newX + velocity
    }

    this.position.x = newX
    this.position.y = newY
    this.$elem.css('left', newX).css('top', newY)

    // return newY < gameH
    let margin = 0
      const moveObstacleB = () => {
        if (margin == gameW) {
          margin = 0 + "px";
        } else {
          this.id.style.marginLeft = margin + "px";
        }
        margin += 10;
      }
  }

  this.removeObstacle = () => {
    this.$elem.remove()
  }
}

export default ObstacleB
