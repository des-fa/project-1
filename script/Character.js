// CHARACTER CONSTANTS
const DIMENSION = { w: 50, h: 50 }
const VELOCITY = 4
const BACKGROUND = 'red'
const MOVEMENT_KEYS = { left: 37, right: 39 }

function Character($game) {
  const character = {
    $elem: null,
    id: `_${Math.random().toString(36).substring(2, 15)}`,
    dimension: DIMENSION,
    velocity: VELOCITY,
    background: BACKGROUND,
    movementKeys: MOVEMENT_KEYS,
    movement: { left: false, right: false, },
    position: { x: ($game.width() - DIMENSION.w) / 2, y: $game.height() - DIMENSION.h },
  }

  // Initialize Character & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = character
    character.$elem = $(`<div id="${id}"></div>`)
      .css('left', x)
      .css('top', y)
      .css('background', background)
      .css('width', w)
      .css('height', h)
      .css('position', 'absolute')
      .appendTo($game)
  }
  init()

  // Toggle which direction the character is moving to
  this.setCharacterMovement = (value, keyCode) => {
    const { movementKeys: { left, right } } = character
    switch (keyCode) {
      case left:
        character.movement.left = value
        break
      case right:
        character.movement.right = value
        break
    }
  }

  // Everytime this gets invoked, update character position
  this.moveCharacter = () => {
    const gameW = $game.width()
    const {
      velocity,
      dimension: { w },
      position: { x },
      movement: { left, right }
    } = character

    let newX = x

    if (left) {
      newX = x - velocity < 0 ? 0 : newX - velocity
    }

    if (right) {
      newX = x + w + velocity > gameW ? gameW - w : newX + velocity
    }

    character.position.x = newX
    character.$elem.css('left', newX)
  }

  this.getInfo = () => {
    return {
      $elem: character.$elem,
      dimension: character.dimension,
      position: character.position
    }
  }
}

export default Character
