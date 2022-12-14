// CHARACTER CONSTANTS
const DIMENSION = { w: 50, h: 50 }
const VELOCITY = 6
const BACKGROUND = 'transparent'
const MOVEMENT_KEYS = { left: 37, right: 39 }

function Character($game) {
  this.$elem = null
  this.id = `_${Math.random().toString(36).substring(2, 15)}`
  this.dimension = DIMENSION
  this.velocity = VELOCITY
  this.background = BACKGROUND
  this.movementKeys = MOVEMENT_KEYS
  this.movement = { left: false, right: false, }
  this.position = { x: ($game.width() - DIMENSION.w) / 2, y: $game.height() - DIMENSION.h - 10 }

  // Initialize Character & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = this

    this.$elem = $(`<div id="${id}"></div>`)
      .css('left', x)
      .css('top', y)
      .css('background', background)
      .css('background-size', 'cover')
      .css('background-image', 'url("images/run.png")')
      .css('width', w)
      .css('height', h)
      .css('position', 'absolute')
      .css('margin-bottom', '5px')
      .appendTo($game)
  }
  init()

  // Toggle which direction the character is moving to
  this.setCharacterMovement = (value, keyCode) => {
    const { movementKeys: { left, right } } = this

    switch (keyCode) {
      case left:
        this.movement.left = value
        break
      case right:
        this.movement.right = value
        break
    }
  }

  // Every time this gets invoked, update character position
  this.moveCharacter = () => {
    const gameW = $game.width()
    const { position: { x }, dimension: { w }, movement: { left, right }, velocity } = this

    let newX = x
    if (left) newX = x - velocity < 0 ? 0 : newX - velocity
    if (right) newX = x + w + velocity > gameW ? gameW - w : newX + velocity

    this.position.x = newX
    this.$elem.css('left', newX)
  }
}

export default Character
