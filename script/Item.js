function Item({initDimension, initVelocity, initBackground, initPos}, $game) {
  this.$elem = null
  this.id = `_${Math.random().toString(36).substring(2, 15)}`
  this.type = null
  this.dimension = initDimension
  this.velocity = initVelocity
  this.background = initBackground
  this.position = initPos

  // Initialize Item & Append to game
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

  // Every time this gets invoked, update item position, return false if outside of game box
  this.moveObstacle = () => {
    const gameH = $game.height()
    const { position: { y }, velocity } = this

    let newY = y
    newY = newY + velocity

    this.position.y = newY
    this.$elem.css('top', newY)

    return newY < gameH
  }

  this.removeObstacle = () => {
    this.$elem.remove()
  }
}

export default Item