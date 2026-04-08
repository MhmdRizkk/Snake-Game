export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isInsideGrid(position, gridSize) {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < gridSize &&
    position.y < gridSize
  );
}

function isOnSnake(position, snake) {
  return snake.some((segment) => positionsEqual(segment, position));
}

export function placeFood(snake, gridSize, random = Math.random) {
  const free = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!isOnSnake({ x, y }, snake)) {
        free.push({ x, y });
      }
    }
  }
  if (free.length === 0) {
    return null;
  }
  const index = Math.floor(random() * free.length);
  return free[index];
}

export function createInitialState(gridSize = GRID_SIZE, random = Math.random) {
  const center = Math.floor(gridSize / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
  return {
    gridSize,
    snake,
    direction: "right",
    pendingDirection: "right",
    food: placeFood(snake, gridSize, random),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return state;
  }
  if (state.isGameOver) {
    return state;
  }
  if (OPPOSITES[state.direction] === nextDirection) {
    return state;
  }
  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }
  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || state.isPaused || !state.food) {
    return state;
  }

  const direction = state.pendingDirection;
  const movement = DIRECTIONS[direction];
  const head = state.snake[0];
  const newHead = {
    x: head.x + movement.x,
    y: head.y + movement.y,
  };

  if (!isInsideGrid(newHead, state.gridSize) || isOnSnake(newHead, state.snake)) {
    return {
      ...state,
      direction,
      isGameOver: true,
    };
  }

  const didEat = positionsEqual(newHead, state.food);
  const nextSnake = [newHead, ...state.snake];
  if (!didEat) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: didEat ? placeFood(nextSnake, state.gridSize, random) : state.food,
    score: didEat ? state.score + 1 : state.score,
  };
}
