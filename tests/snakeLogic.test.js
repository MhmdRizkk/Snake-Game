import assert from "node:assert/strict";
import {
  createInitialState,
  placeFood,
  queueDirection,
  stepGame,
} from "../src/snakeLogic.js";

function run(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

run("snake moves forward one cell on each step", () => {
  const initial = createInitialState(10, () => 0);
  const next = stepGame(initial, () => 0);

  assert.deepEqual(next.snake[0], { x: initial.snake[0].x + 1, y: initial.snake[0].y });
  assert.equal(next.snake.length, initial.snake.length);
});

run("snake grows and score increments when eating food", () => {
  const initial = createInitialState(10, () => 0);
  const foodAhead = { x: initial.snake[0].x + 1, y: initial.snake[0].y };
  const state = { ...initial, food: foodAhead };

  const next = stepGame(state, () => 0);

  assert.equal(next.score, state.score + 1);
  assert.equal(next.snake.length, state.snake.length + 1);
});

run("collision with wall sets game over", () => {
  let state = createInitialState(4, () => 0);
  state = { ...state, snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], direction: "right", pendingDirection: "right" };

  const next = stepGame(state, () => 0);
  assert.equal(next.isGameOver, true);
});

run("queueDirection blocks direct reverse turns", () => {
  const initial = createInitialState(10, () => 0);
  const rejected = queueDirection(initial, "left");
  const accepted = queueDirection(initial, "up");

  assert.equal(rejected.pendingDirection, "right");
  assert.equal(accepted.pendingDirection, "up");
});

run("placeFood never spawns on the snake body", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = placeFood(snake, 3, () => 0.95);

  assert.notEqual(food, null);
  assert.equal(snake.some((segment) => segment.x === food.x && segment.y === food.y), false);
});
