import Game from './Game.js'

// JQUERY CONSTANTS
const $startBtn = $("#start-btn")
const $retryBtn = $("#try-btn")
const $instructBtn = $("#instructions-btn")
const $backBtn = $("#back-btn")

const game = new Game()

$startBtn.on("click", game.startGame)
$retryBtn.on("click", game.startGame)
$instructBtn.on("click", game.showInstructions)
$backBtn.on("click", game.backToStart)

// make counter
