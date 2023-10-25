Here's an example code for implementing a basic Flappy Bird clone using functional programming in JavaScript:

```javascript
// Import necessary libraries
const { pipe, prop, add, always, ifElse, gt, dec, always, cond, T, identity, times, map, compose, random, clamp, subtract, multiply, path, propOr, over, lensProp, evolve, assoc, merge, lensPath, update, set, juxt, __ } = require('ramda');
const uuid = require('uuid');

// Constants
const GRAVITY = 0.5;
const JUMP_FORCE = 7;
const PIPE_WIDTH = 80;
const PIPE_HEIGHT = 300;
const PIPE_GAP = 200;
const PIPE_SPEED = 2;

// Helper functions
const getRandomInt = (min, max) => Math.floor(random() * (max - min + 1)) + min;
const createId = always(uuid.v4());

// Game state
const initialState = {
  bird: {
    x: 100,
    y: 200,
    velocity: 0,
    jumping: false,
  },
  pipes: [],
  score: 0,
  gameOver: false,
};

// Bird functions
const updateBird = (state) => pipe(
  prop('bird'),
  evolve({
    y: ifElse(
      prop('jumping'),
      subtract(__, JUMP_FORCE),
      pipe(
        prop('velocity'),
        add(GRAVITY),
      ),
    ),
    velocity: ifElse(
      prop('jumping'),
      always(-JUMP_FORCE),
      pipe(
        prop('velocity'),
        add(GRAVITY),
      ),
    ),
  }),
  over(lensProp('bird'), identity),
)(state);

const jumpBird = (state) => pipe(
  over(lensPath(['bird', 'jumping']), always(true)),
  over(lensPath(['bird', 'velocity']), always(-JUMP_FORCE)),
)(state);

// Pipe functions
const createPipe = (x, gapY) => ({
  id: createId(),
  x,
  gapY,
});

const updatePipes = (state) => pipe(
  prop('pipes'),
  map(pipe(
    evolve({
      x: subtract(PIPE_SPEED),
    }),
    ifElse(
      pipe(prop('x'), gt(-PIPE_WIDTH)),
      identity,
      always(null),
    ),
  )),
  filter(identity),
  over(lensProp('pipes'), identity),
)(state);

const addPipe = (state) => pipe(
  prop('pipes'),
  juxt([
    pipe(
      propOr(0, 'x'),
      add(PIPE_GAP + PIPE_WIDTH),
    ),
    pipe(
      pipe(
        prop('bird'),
        prop('y'),
      ),
      clamp(0, 600 - PIPE_HEIGHT - 200),
    ),
  ]),
  apply(createPipe),
  over(lensProp('pipes'), concat(__, [__])),
)(state);

// Collision detection
const isColliding = (bird, pipe) => {
  const birdBounds = {
    top: bird.y,
    bottom: bird.y + 40,
    left: bird.x,
    right: bird.x + 40,
  };

  const pipeBounds = {
    top: pipe.gapY,
    bottom: pipe.gapY + PIPE_GAP,
    left: pipe.x,
    right: pipe.x + PIPE_WIDTH,
  };

  return (
    birdBounds.right > pipeBounds.left &&
    birdBounds.left < pipeBounds.right &&
    (birdBounds.top < pipeBounds.top || birdBounds.bottom > pipeBounds.bottom)
  );
};

const checkCollisions = (state) => pipe(
  over(lensProp('pipes'), map(pipe(
    ifElse(
      pipe(isColliding, not),
      identity,
      always(null),
    ),
  ))),
  over(lensProp('pipes'), filter(identity)),
)(state);

// Score
const updateScore = (state) => pipe(
  prop('pipes'),
  filter(pipe(prop('x'), equals(60))),
  prop('length'),
  over(lensProp('score'), add(__, 1)),
)(state);

// Game loop
const updateGameState = (state) => pipe(
  updateBird,
  updatePipes,
  addPipe,
  checkCollisions,
  updateScore,
  ifElse(
    pipe(prop('bird', prop('y')), gt(600)),
    over(lensProp('gameOver'), always(true)),
    identity,
  ),
)(state);

// Example usage
let state = initialState;

const gameLoop = () => {
  state = updateGameState(state);
  console.log(state);
  
  if (!state.gameOver) {
    setTimeout(gameLoop, 1000 / 60); // Run at 60 FPS
  } else {
    console.log('Game over! Final score:', state.score);
  }
};

gameLoop();
```

This code sets up the basic game mechanics for a Flappy Bird clone. It includes functions to update the bird's position, handle jumping, update the pipes' positions, detect collisions, update the score, and run the game loop. The game loop repeatedly updates the game state and checks for game over conditions until the game ends.