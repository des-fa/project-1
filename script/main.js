import Game from './Game.js'

// JQUERY CONSTANTS
const $startBtn = $("#start-btn")
const $retryBtn = $("#try-btn")
const $instructBtn = $("#instructions-btn")
const $homeBtn = $(".home-btn")
const $moreBtn = $(".more-btn")
const $backBtn = $(".back-btn")
const $screenAudio = $("#screen-audio")
const $audioBtn = $("#audio-button")

// LoopAudio
const loopAudio = () => {
  $screenAudio[0].currentTime = 0
  $screenAudio[0].play()
}

 // Play Background Music on Loop
const playScreenAudio = () => {
  $screenAudio[0].paused ? $screenAudio[0].play() : $screenAudio[0].pause()
}

const game = new Game()

// Event Listeners
$audioBtn.on('click', playScreenAudio)
$screenAudio.on("ended", loopAudio)
$startBtn.on("click", game.startGame)
$retryBtn.on("click", game.startGame)
$instructBtn.on("click", game.showFirstInstructions)
$moreBtn.on("click", game.showSecondInstructions)
$backBtn.on("click", game.backToFirstInstructions)
$homeBtn.on("click", game.backToHome)
