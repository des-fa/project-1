const itemTypes = {
  normal: {
    weight: 6,
    reward: 1,
    background: 'white',
    effect: function(){
      console.log('normal', this)
    }
  },
  speedUp: {
    weight: 1,
    background: 'green',
    reward: 0,
    effect: function(){
      // speedUp character, items, obstacles
    }
  },
  immune: {
    weight: 1,
    background: 'purple',
    reward: 0,
    effect: function(){
      // turn off collision detection
      console.log('immune')
      this.detectCollision = false
      const immunity = () => {
        this.detectCollision = true
        console.log('collide again')
      }
      setTimeout(immunity, 1500)

    }
  },
  slowDown: {
    weight: 1,
    background: 'red',
    reward: 0,
    effect: function(){
      // slow down character velocity
      console.log('slowDown')
      this.player.velocity = 3
      const slowCharacter = () => {
        this.player.velocity = 5
      }
      setTimeout(slowCharacter, 1500)
    }
  },
  block: {
    weight: 1,
    background: 'black',
    reward: 0,
    effect: function(){
      // add game layer to limit vision
      console.log('blocked')
      $boxEffect.show()
      const hideBlock = () => {
        $boxEffect.fadeOut()
      }
      setTimeout(hideBlock, 1500)
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
