import Game from './Game.js'

// JQUERY CONSTANTS
const $startBtn = $("#start-btn")
const $retryBtn = $("#try-btn")
const $instructBtn = $("#instructions-btn")
const $homeBtn = $(".home-btn")
const $moreBtn = $(".more-btn")
const $backBtn = $(".back-btn")
const $screenAudio = $("#screen-audio")




const playScreenAudio = () => {
  let screenAudio = new Audio("audio/screens.mp3")
  if (screenAudio.paused) {
    screenAudio.play();
  } else {
    screenAudio.currentTime = 0
  }
}
$(document).ready(playScreenAudio)

const game = new Game()

$startBtn.on("click", game.startGame)
$retryBtn.on("click", game.startGame)
$instructBtn.on("click", game.showFirstInstructions)
$moreBtn.on("click", game.showSecondInstructions)
$backBtn.on("click", game.backToFirstInstructions)
$homeBtn.on("click", game.backToHome)
