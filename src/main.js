import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  stepGame,
  togglePause,
} from "./snakeLogic.js";

const TICK_MS = 140;
const keyToDirection = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

const scoreValue = document.getElementById("score-value");
const statusValue = document.getElementById("status-value");
const board = document.getElementById("board");
const restartButton = document.getElementById("restart-button");
const pauseButton = document.getElementById("pause-button");
const controlsRoot = document.getElementById("touch-controls");
const overlay = document.getElementById("game-over-overlay");
const overlayRestartButton = document.getElementById("overlay-restart-button");

let state = createInitialState(GRID_SIZE);
let intervalId = null;

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function createBoard() {
  board.style.setProperty("--grid-size", String(state.gridSize));
  board.replaceChildren();

  const totalCells = state.gridSize * state.gridSize;
  for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
  }
}

function indexFromPosition(position) {
  return position.y * state.gridSize + position.x;
}

function paintBoard() {
  const cells = board.children;
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].className = "cell";
  }

  for (const segment of state.snake) {
    const index = indexFromPosition(segment);
    cells[index].classList.add("snake");
  }

  if (state.food) {
    const foodIndex = indexFromPosition(state.food);
    cells[foodIndex].classList.add("food");
  }
}

function updateHUD() {
  scoreValue.textContent = String(state.score);
  if (state.isGameOver) {
    statusValue.textContent = "Game Over";
  } else if (state.isPaused) {
    statusValue.textContent = "Paused";
  } else {
    statusValue.textContent = "Running";
  }
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
  overlay.classList.toggle("visible", state.isGameOver);
  board.classList.toggle("paused", state.isPaused && !state.isGameOver);
}

function render() {
  paintBoard();
  updateHUD();
}

function restart() {
  state = createInitialState(GRID_SIZE);
  createBoard();
  render();
}

function tick() {
  state = stepGame(state);
  render();
}

function onKeyDown(event) {
  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }
  if (event.key.toLowerCase() === "r") {
    restart();
    return;
  }
  const direction = keyToDirection[event.key];
  if (direction) {
    event.preventDefault();
    state = queueDirection(state, direction);
  }
}

function createTouchControls() {
  controlsRoot.replaceChildren();
  if (!isMobileViewport()) {
    return;
  }

  const controls = [
    { label: "Up", direction: "up" },
    { label: "Left", direction: "left" },
    { label: "Down", direction: "down" },
    { label: "Right", direction: "right" },
  ];

  for (const control of controls) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "control-button";
    button.textContent = control.label;
    button.addEventListener("click", () => {
      state = queueDirection(state, control.direction);
    });
    controlsRoot.appendChild(button);
  }
}

restartButton.addEventListener("click", restart);
overlayRestartButton.addEventListener("click", restart);
pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});
document.addEventListener("keydown", onKeyDown);
window.addEventListener("resize", createTouchControls);

restart();
createTouchControls();
intervalId = window.setInterval(tick, TICK_MS);

window.addEventListener("beforeunload", () => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
