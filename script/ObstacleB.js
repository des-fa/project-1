function ObstacleB({initDimension, initVelocity, initBackground, initPos}, $game) {
  this.$elem = null
  this.id = `_${Math.random().toString(36).substring(2, 15)}`
  this.type = "B"
  this.dimension = initDimension
  this.velocity = initVelocity
  this.background = initBackground
  this.position = initPos
  this.isLeft = Math.random() < 0.5

  // Initialize Obstacle & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = this

    this.$elem = $(`<div id="${id}"></div>`)
      .css('left', x)
      .css('top', y)
      .css('background', background)
      .css('background-size', '75% auto')
      .css('background-image', 'url("images/answer.png")')
      .css('background-repeat', 'no-repeat')
      .css('background-position', 'center')
      .css('width', w)
      .css('height', h)
      .css('border-radius','5px')
      .css('position', 'absolute')
      .appendTo($game)
  }
  init()

  // Every time this gets invoked, update obstacle position, return false if outside of game box
  this.moveObstacle = () => {
    const gameW = $game.width()
    const gameH = $game.height()
    const {
      dimension: { w, h },
      position: { x, y },
      velocity,
      isLeft
    } = this

    let newX = x
    let newY = y
    newY = newY + velocity

    if (isLeft) {
      if (x - velocity < 0) {
        newX = 0
        this.isLeft = !isLeft
      } else {
        newX = newX - (velocity)
      }
    } else {
      if (x + w + velocity > gameW) {
        newX = gameW - w
        this.isLeft = !isLeft
      } else {
        newX = newX + (velocity)
      }
    }

    this.position.x = newX
    this.position.y = newY
    this.$elem.css('left', newX).css('top', newY)

    return newY < gameH
  }

  this.removeObstacle = () => {
    this.$elem.remove()
  }
}

export default ObstacleB
