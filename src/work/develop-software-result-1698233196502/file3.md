Here is an example implementation of a Flappy Bird clone in functional style using JavaScript:

```javascript
// Define game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const PIPE_SPEED = 2;
const PIPE_GAP = 150;

// Create game state
const initialState = {
  bird: {
    x: 50,
    y: 200,
    velocity: 0
  },
  pipes: [],
  score: 0,
  gameOver: false
};

// Update bird position based on velocity
const updateBird = (bird) => ({
  ...bird,
  y: bird.y + bird.velocity,
  velocity: bird.velocity + GRAVITY
});

// Create new pipe
const createPipe = (x) => ({
  x,
  topHeight: Math.random() * 200 + 50,
  bottomHeight: Math.random() * 200 + 50
});

// Update pipe positions
const updatePipes = (pipes) =>
  pipes.map(pipe => ({
    ...pipe,
    x: pipe.x - PIPE_SPEED
  }));

// Check collision between bird and pipes
const checkCollision = (bird, pipes) =>
  pipes.some(pipe =>
    bird.y < pipe.topHeight ||
    bird.y > pipe.topHeight + PIPE_GAP ||
    bird.y > 400 - pipe.bottomHeight
  );

// Check if bird has passed a pipe
const checkScore = (bird, pipes) =>
  pipes.reduce((score, pipe) => {
    if (bird.x > pipe.x && !pipe.passed) {
      pipe.passed = true;
      return score + 1;
    }
    return score;
  }, 0);

// Game loop
const gameLoop = (state) => {
  if (state.gameOver) {
    return state;
  }

  const updatedBird = updateBird(state.bird);
  const updatedPipes = updatePipes(state.pipes);
  const collision = checkCollision(updatedBird, updatedPipes);
  const score = checkScore(updatedBird, updatedPipes);

  return {
    bird: updatedBird,
    pipes: updatedPipes,
    score,
    gameOver: collision || updatedBird.y > 400
  };
};

// Main function to start the game
const startGame = () => {
  let state = initialState;

  const gameInterval = setInterval(() => {
    state = gameLoop(state);
    console.log(state);

    if (state.gameOver) {
      clearInterval(gameInterval);
      console.log('Game over!');
    }
  }, 1000 / 60);

  // Simulate user input to make the bird jump
  document.addEventListener('keydown', () => {
    state.bird.velocity = JUMP_FORCE;
  });
};

// Start the game
startGame();
```

This is a simplified implementation of a Flappy Bird game using functional programming principles. It defines the game constants and initial state, and then uses pure functions to update the game state and check for collisions and scores. The game loop runs at 60 frames per second and updates the state accordingly. The game ends when the bird collides with a pipe or falls to the ground.