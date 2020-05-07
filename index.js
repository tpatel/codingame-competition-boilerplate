if (typeof readline === "undefined") {
  //This remove the "undefined readline" in node.js
  global.readline = () => {
    console.log("no readline here...");
  };
}
const { performance } = require("perf_hooks");

let state = {
  turn: 0,
};

const time = {};

// Constants
const ACTIONS = {
  READ_INPUT: "read-input",
  PLAY: "play",
  SIMULATE_PLAY: "simulate-play",
};

function readInput(state, action, params) {
  //TODO: code for input reading here

  return {
    ...state,
    //TODO: overwrite the state here
  };
}

function simulatePlay(state, action, params) {
  //TODO: update and return updated state
}

function play(state, action, params) {
  console.log(); //TODO: console log the action
  return update(state, ACTIONS.SIMULATE_PLAY, params);
}

// Reducer
function update(state, action, params) {
  switch (action) {
    case ACTIONS.READ_INPUT:
      return readInput(state, action, params);
    case ACTIONS.SIMULATE_PLAY:
      return simulatePlay(state, action, params);
    case ACTIONS.PLAY:
      return play(state, action, params);
    default:
      console.error("Action not defined", action);
  }
}

class Distance {
  static manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
}

class Negamax {
  static counter = 0;

  static score(state) {
    //TODO: compute score depending on the state
    return 0;
  }
  static isGameFinished(state) {
    return false;
  }
  static moves(state, isMe) {
    //TODO: return possible next steps for the player
    return [];
  }
  static negamax(state, depth, alpha, beta, isMe) {
    Negamax.counter++;
    if (depth == 0 || Negamax.isGameFinished(state)) {
      return score(state) * (isMe ? 1 : -1);
    }

    let childNodes = Negamax.moves(state, !isMe).map((move) => {
      return update(state, ACTIONS.SIMULATE_PLAY, {
        myTurn: !isMe,
        move,
      });
    });

    //childNodes := orderMoves(childNodes) //TODO: order moves

    let value = -Infinity;

    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];

      value = Math.max(
        value,
        -Negamax.negamax(child, depth - 1, -beta, -alpha, !isMe)
      );
      alpha = Math.max(alpha, value);

      if (alpha >= beta) {
        break;
      }
    }

    return value;
  }
  static chooseNextMove() {
    Negamax.counter = 0;

    const nextMoves = Negamax.moves(state, true);

    console.error(JSON.stringify(nextMoves));

    const scores = nextMoves.map((move) => {
      const nextState = update(state, ACTIONS.SIMULATE_PLAY, {
        myTurn: true,
        move,
      });

      // console.error({ move });

      return {
        move,
        score: Negamax.negamax(
          nextState,
          MAX_NEGAMAX_ITERATIONS,
          -Infinity,
          +Infinity,
          true
        ),
      };
    });

    console.error({ counter });

    const maxScore = Math.max(...scores.map((s) => s.score));
    const bestMoveIndex = scores.findIndex((s) => s.score == maxScore);

    console.error(JSON.stringify(scores));
    return scores[bestMoveIndex].move;
  }
}

if (process.env.ENV == "test") {
  const assert = require("assert").strict;

  assert(Distance.manhattan({ x: 0, y: 0 }, { x: 1, y: 1 }) === 2);
  assert(Distance.manhattan({ x: 0, y: 0 }, { x: 0, y: 0 }) === 0);

  console.log("Tests ran successfully ✅");
  process.exit(0);
}

// game loop
while (true) {
  time.mainLoop = 0;

  if (process.env.ENV == "dev") {
    state = {}; // Paste the state of the game that you want to debug locally here
  } else {
    state = update(state, ACTIONS.READ_INPUT);
  }
  const startTime = performance.now();

  console.error(JSON.stringify(state));

  //TODO: Write the actual AI here
  const move = {};

  state = update(state, ACTIONS.PLAY, {
    myTurn: true,
    move,
  });

  time.mainLoop = performance.now() - startTime;
  console.error({ ...time });
  console.error(JSON.stringify(state));

  if (process.env.ENV == "dev") break;
}
