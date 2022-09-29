const itemTypes = {
  normal: {
    weight: 8,
    reward: 1,
    background: 'transparent',
    effect: function(){
      console.log('normal', this)
    }
  },
  speedUp: {
    weight: 1,
    background: '#99FEFF',
    reward: 0,
    effect: function(game){
      // speedUp character
      game.player.velocity = 8
      const speedUpCharacter = () => {
        game.player.velocity = 6
      }
      setTimeout(speedUpCharacter, 3000)
    }
  },
  immune: {
    weight: 1,
    background: '#99FEFF',
    reward: 0,
    effect: function(game){
      // turn off collision detection
      console.log('immune')
      game.detectCollision = false
      const immunity = () => {
        game.detectCollision = true
        console.log('collide again')
      }
      setTimeout(immunity, 3000)

    }
  },
  slowDown: {
    weight: 1,
    background: '#99FEFF',
    reward: 0,
    effect: function(game){
      // slow down character velocity
      console.log('slowDown')
      game.player.velocity = 4
      const slowCharacter = () => {
        game.player.velocity = 6
      }
      setTimeout(slowCharacter, 3000)
    }
  },
  block: {
    weight: 1,
    background: '#99FEFF',
    reward: 0,
    effect: function(){
      // add game layer to limit vision
      console.log('blocked', $("#box-effect"))
      $("#box-effect").show()
      const hideBlock = () => {
        $("#box-effect").fadeOut()
      }
      setTimeout(hideBlock, 4000)
    }
  }
}

// Weighted Array of Object Types
const entries = Object.entries(itemTypes)
const weightedItemTypes = entries.map(([key, value]) => Array(value.weight).fill(key)).flat()

function Item({initDimension, initVelocity, initPos}, $game) {
  this.$elem = null
  this.id = `_${Math.random().toString(36).substring(2, 15)}`
  this.type = null
  this.dimension = initDimension
  this.velocity = initVelocity
  this.background = null
  this.position = initPos
  this.triggered = false

  // Generate & Assign Random Type Using the Object
  const randomKeyIndex = Math.floor(Math.random() * weightedItemTypes.length)
  const randomKey = weightedItemTypes[randomKeyIndex]
  const typeObj = itemTypes[randomKey]
  this.type = randomKey
  this.background = typeObj.background
  this.reward = typeObj.reward
  this.effect = typeObj.effect

  // Initialize Item & Append to game
  const init = () => {
    const { id, position: { x, y }, dimension: { w, h }, background } = this
    if (this.type === 'normal') {
      this.$elem = $(`<div id="${id}"></div>`)
        .css('left', x)
        .css('top', y)
        .css('background', background)
        .css('background-size', 'cover')
        .css('background-image', 'url("images/kiss.png")')
        .css('width', w)
        .css('height', h)
        .css('position', 'absolute')
        .appendTo($game)
    } else {
      this.$elem = $(`<div id="${id}"></div>`)
        .css('left', x)
        .css('top', y)
        .css('background', background)
        .css('background-size', 'cover')
        .css('background-image', 'url("images/block.png")')
        .css('width', w)
        .css('height', h)
        .css('position', 'absolute')
        .appendTo($game)
    }
  }
  init()

  // Every time this gets invoked, update item position, return false if outside of game box
  this.moveItem = () => {
    const gameH = $game.height()
    const { position: { y }, velocity } = this

    let newY = y
    newY = newY + velocity

    this.position.y = newY
    this.$elem.css('top', newY)

    return newY < gameH
  }

  this.removeItem = () => {
    this.$elem.remove()
  }
}

export default Item
