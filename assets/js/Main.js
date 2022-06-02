// setting strict mode
"use strict";

const KEY = "SNAKE_GAME_SETTING";
let SNAKE_SPEED = 1000 / 60;
// canvas
const canvas = $("canvas").get(0);
const ctx = canvas.getContext("2d");
const cells = 20;
const cellSize = canvas.width / cells;
const boardSize = canvas.width;

// colors
const meteoriteColor = "#FEE2C5";
const textColor = "#fff";

// html elements
const screenGame = $(".screen__game").get(0);
const screenGameSetting = $(".screen__game-setting").get(0);
const screenGameMenu = $(".screen__game-menu").get(0);
const screenGameOver = $(".screen__game-over").get(0);
const screenRules = $(".rules").get(0);
const messageBonusValue = $(".message__bonus-value").get(0);

// btn elements
const btnsNewGame = $(".btn__new-game").toArray();
const btnsSetting = $(".btn__setting").toArray();
const btnRestart = $(".btn__restart").get(0);
const btnsRules = $(".btn__rule").toArray();
const btnsSound = $(".btn__sound").toArray();
const btnHome = $(".btn__back").get(0);
const btnNext = $(".btn__next").get(0);
const btnPrevLevel = $(".btn__prev-level").get(0);
const btnNextLevel = $(".btn__next-level").get(0);

// input elements
const levelsInput = $(`input[name="level"]`).toArray();
let levelCurrentInput = $(`input:checked`).get(0);

// levels ultilities
let levelCurrentId = levelCurrentInput.id;
let levelNextId, levelPrevId;
let levelValue = $(".level__value").get(0);

// score, time elements
let scoreValue = $(".score__value").get(0);
let highScoreValue = $(".high-score__value").get(0);

// score ultilities
let score = 0;
let highScore = 0;

// helpers
let timer;
let particles = [];
let currentHue;
let currentDirection = undefined;
let isSoundOn = false;
let isWall, isBoom, isBlock, isBigFood, isPort, isSeparate, isMeteorite;
let levels;
let boomList = 5;
let blockList = 4;
let portList = 1;
let booms = new Set();
let blocks = new Set();
let separates = [];
let ports = [];
let zoneTime = 18;

// Class
let snake;
let food;
let port;
let meteorite;

// audio
const eatEffect = new Audio("./assets/audio/game_effect/eat.wav");
const btnHoverEffect = new Audio("./assets/audio/game_effect/hover_btn.wav");
const gameOverEffect = new Audio("./assets/audio/game_effect/game_over.wav");
const hitWallEffect = new Audio("./assets/audio/game_effect/hit_wall.wav");
const gameSound = new Audio("./assets/audio/game_sound/game_sound.mp3");

// setting volume
eatEffect.volume = 0.5;
btnHoverEffect.volume = 0.5;
gameOverEffect.volume = 0.5;
hitWallEffect.volume = 0.5;

const LEVEL = {
  0: { id: 0, name: "newbie", SNAKE_SPEED: 1000 / 60 },
  1: { id: 1, name: "easy", isWall: true, SNAKE_SPEED: 1000 / 60 },
  2: {
    id: 2,
    name: "normal",
    isBigFood: true,
    isWall: true,
    isMeteorite: true,
    SNAKE_SPEED: 1000 / 60,
  },
  3: {
    id: 3,
    name: "advanced",
    isBoom: true,
    isWall: true,
    isBigFood: true,
    isMeteorite: true,
    SNAKE_SPEED: 1000 / 60,
  },
  4: {
    id: 4,
    name: "hadcore",
    isBoom: true,
    isWall: true,
    isPort: true,
    isBigFood: true,
    isBlock: false,
    isSeparate: true,
    isMeteorite: true,
    SNAKE_SPEED: 1000 / 60,
  },
  5: {
    id: 5,
    name: "god",
    isBoom: true,
    isWall: true,
    isBigFood: true,
    isBlock: true,
    isSeparate: true,
    isPort: true,
    isMeteorite: true,
    SNAKE_SPEED: 1000 / 60,
  },
};
const myTags = [];
for (let i = 0; i <= 100; i++) {
  myTags.push(`${i}%`);
}

const tagCloud = TagCloud(".welcome", myTags, {
  radius: 400,
  maxSpeed: "fast",
  initSpeed: "fast",
  direction: 135,
  keep: true,
});
const colors = [
  "#A2A8D3",
  "#F34573",
  "#ACDBDF",
  "#00649F",
  "#F2FCFC",
  "#5068A9",
  "#90F6D7",
  "#9CD9DE",
  "#5ACFD6",
  "#F1D6AB",
  "#B23256",
  "#F6DFEB",
  "#7D7D7D",
  "#FE9191",
  "#74DBEF",
  "#635270",
  "#CE7BB0",
  "#74BBCA",
];
const randomBonus = () => {
  let rand = Math.floor(Math.random() * 3);
  return rand;
};
const setNextId = () => {
  if (Number.parseInt(levelCurrentId) === Object.entries(LEVEL).length - 1) {
    levelNextId = 0;
  } else {
    levelNextId = Number.parseInt(levelCurrentId) + 1;
  }
};
const setPrevId = () => {
  if (Number.parseInt(levelCurrentId) === 0) {
    levelPrevId = Object.entries(LEVEL).length - 1;
  } else {
    levelPrevId = Number.parseInt(levelCurrentId) - 1;
  }
};
const randomBigFood = () => {
  return Math.floor(Math.random() * 3);
};
const isCollision = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y;
};

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const randomPosition = () => {
  let x = Math.floor(Math.random() * cells) * cellSize;
  let y = Math.floor(Math.random() * cells) * cellSize;
  return { x, y };
};

// helper
const garbageCollector = () => {
  particles.forEach((particle, i) => {
    if (particle.size <= 0) {
      particles.splice(i, 1);
    }
  });
};

const particleSplash = () => {
  for (let i = 0; i < cellSize; i++) {
    let vel = { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 };
    let position = { x: food.x, y: food.y };
    particles.push(new Particle(position, currentHue, food.size, vel));
  }
};

const SETTING = {
  config: JSON.parse(localStorage.getItem(KEY)) || {},
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(KEY, JSON.stringify(this.config));
  },
  getConfig() {
    isSoundOn = this.config.isSoundOn;
  },
  setLevel(level) {
    isWall = LEVEL[level]?.isWall;
    isBigFood = LEVEL[level]?.isBigFood;
    isMeteorite = LEVEL[level]?.isMeteorite;
    isBoom = LEVEL[level]?.isBoom;
    isPort = LEVEL[level]?.isPort;
    isSeparate = LEVEL[level]?.isSeparate;
    isBlock = LEVEL[level]?.isBlock;
    SNAKE_SPEED = LEVEL[level]?.SNAKE_SPEED;
    levelValue.textContent = LEVEL[level].name;
  },
  setContextLevel() {
    levelsInput.find((levelInput) => {
      if (levelInput.checked) {
        levelCurrentId = levelInput.id;
      }
      setNextId();
      setPrevId();
    });
    this.setLevel(levelCurrentId);
    this.gameContext();
  },
  generateBooms() {
    while (booms.size < boomList) {
      booms.add(new Boom());
    }
  },
  generateBlocks() {
    while (blocks.size < blockList) {
      blocks.add(new Block(randomPosition().x, randomPosition().y));
    }
  },
  generatePorts() {
    while (ports.length < portList) {
      port = new Port();
      ports.push(port);
    }
  },
  generateSeparates() {
    let i = 0;
    while (blocks.size < cells + blockList) {
      blocks.add(new Block(i, canvas.height / 4));
      i += cellSize;
    }
  },
  generateMeteorite() {
    meteorite = new Meteorite();
  },
  bonusTime(value) {
    messageBonusValue.textContent = value;
    if (value <= 50) {
      messageBonusValue.style.color = "red";
      messageBonusValue.style.fontSize = "2.4rem";
    } else {
      messageBonusValue.style.fontSize = "2rem";
      messageBonusValue.style.color = textColor;
    }
  },
  gameContext() {
    const messageBonus = $(".message__bonus").get(0);
    if (isBigFood) {
      if (food.countDown > 0) {
        if ((score !== 0 && food.isBonus === 1) || food.isBonus === 2) {
          food.isBigFood = true;
        }
        this.bonusTime(food.countDown);
        food.countDown--;
      } else {
        food.isBigFood = false;
      }
      food.draw();
      food.isBigFood
        ? messageBonus.classList.add("expand")
        : messageBonus.classList.remove("expand");
    }
    if (isBoom) {
      this.generateBooms();
      booms.forEach((boom) => {
        boom.draw();
      });
    }
    if (isBlock) {
      this.generateBlocks();
      blocks.forEach((block) => {
        block.draw();
      });
    }
    if (isSeparate) {
      this.generateSeparates();
      blocks.forEach((block) => {
        block.draw();
      });
    }
    if (isPort) {
      this.generatePorts();
      ports.forEach((port) => {
        port.draw();
      });
    }
  },
};

//app
const app = (function () {
  const control = () => {
    addEventListener("keydown", (e) => {
      if (e.keyCode === 37 && currentDirection !== "RIGHT") {
        currentDirection = "LEFT";
      }
      if (e.keyCode === 38 && currentDirection !== "DOWN") {
        currentDirection = "UP";
      }
      if (e.keyCode === 39 && currentDirection !== "LEFT") {
        currentDirection = "RIGHT";
      }
      if (e.keyCode === 40 && currentDirection !== "UP") {
        currentDirection = "DOWN";
      }
    });
  };
  const drawGrid = () => {
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "#232332";
    ctx.shadowBlur = 0;
    for (let index = 0; index < cells; index++) {
      const element = index * cellSize;
      ctx.beginPath();
      ctx.moveTo(element, 0);
      ctx.lineTo(element, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, element);
      ctx.lineTo(canvas.width, element);
      ctx.stroke();
      ctx.closePath();
    }
  };
  const clearBoard = () => {
    ctx.clearRect(0, 0, boardSize, boardSize);
  };
  const gameOver = () => {
    showScreen(0);
    isSoundOn ? gameOverEffect.play() : undefined;
    highScore ? null : (highScore = score);
    score > highScore ? (highScore = score) : null;
    highScoreValue.textContent = highScore < 10 ? `0${highScore}` : highScore;
    SETTING.setConfig("high score", highScore);
    SETTING.setConfig("level", levelValue.textContent);
    window.onkeydown = (e) => {
      e.keyCode === 32 && !snake.alive ? newGame() : undefined;
    };
  };

  const update = () => {
    clearBoard();
    if (snake.alive) {
      timer = setTimeout(update, SNAKE_SPEED);
      drawGrid();
      SETTING.setContextLevel();
      if (isMeteorite) {
        ctx.fillStyle = "#FEE2C5";
        ctx.font = "bold 20px VT323";
        if (zoneTime >= 0) {
          ctx.fillText(`${zoneTime}ms`, meteorite.position.x, 20);
        }
        meteorite.update();
      }
      snake.update();
      food.draw();
      particles.forEach((p) => p.update());
      garbageCollector();
    } else {
      clearBoard();
      gameOver();
    }
  };
  // 0: game over
  // 1: game on
  // 2: menu
  // 3: setting
  const showScreen = (option) => {
    switch (option) {
      case 0:
        screenGame.style.display = "none";
        screenGameOver.style.display = "flex";
        screenGameMenu.style.display = "none";
        screenGameSetting.style.display = "none";
        break;
      case 1:
        screenGameMenu.style.display = "none";
        screenGame.style.display = "flex";
        screenGameOver.style.display = "none";
        screenGameSetting.style.display = "none";
        break;
      case 2:
        screenGameMenu.style.display = "flex";
        screenGame.style.display = "none";
        screenGameOver.style.display = "none";
        screenGameSetting.style.display = "none";
        break;
      case 3:
        screenGameSetting.style.display = "flex";
        screenGameMenu.style.display = "none";
        screenGame.style.display = "none";
        screenGameOver.style.display = "none";
        break;
    }
  };
  const newGame = () => {
    reset();
    showScreen(1);
  };
  const changeScreen = () => {
    const btnOkay = screenRules.lastElementChild;
    $(btnOkay).click(() => {
      screenRules.classList.remove("expand");
    });
    btnsSound.forEach((btn) => {
      isSoundOn ? btn.classList.remove("expand") : btn.classList.add("expand");
    });
    $(btnsSound).click(() => {
      isSoundOn = !isSoundOn;
      SETTING.setConfig("isSoundOn", isSoundOn);
      isSoundOn ? playSoundGame() : gameSound.pause();
      btnsSound.forEach((btn) => {
        isSoundOn
          ? btn.classList.remove("expand")
          : btn.classList.add("expand");
      });
    });
    btnsRules.forEach((btn) => {
      $(btn).click(() => {
        screenRules.classList.add("expand");
      });
    });
    btnsNewGame.forEach((btn) => {
      $(btn).click(() => newGame());
    });
    btnsSetting.forEach((btn) => {
      $(btn).click(() => showScreen(3));
    });
    $(btnHome).click(() => {
      showScreen(2);
    });
    $(btnNext).click(() => {
      $(".welcome").get(0).classList.add("expand");
      $("button:not(btn__next)").hover(
        () => {
          isSoundOn ? btnHoverEffect.play() : undefined;
        },
        () => {
          undefined;
        }
      );
      isSoundOn ? playSoundGame() : gameSound.pause();
    });
    $(btnRestart).click(() => {
      newGame();
    }),
      false;
    $(btnNextLevel).click(() => {
      $(`input[id=${levelNextId}]`).get(0).click();
      newGame();
    });
    $(btnPrevLevel).click(() => {
      $(`input[id=${levelPrevId}]`).get(0).click();
      newGame();
    });
  };
  const reset = () => {
    score = 0;
    scoreValue.textContent = "00";

    boomList = 10;
    blockList = 10;
    blocks.clear();
    booms.clear();
    ports.length = 0;

    currentDirection = undefined;
    snake = new Snake();
    meteorite = new Meteorite();
    food.spawn();

    clearTimeout(timer);
    update();
  };
  const playSoundGame = () => {
    gameSound.volume = 0.2;
    gameSound.play();
    gameSound.onended = () => {
      playSoundGame();
    };
  };

  const init = () => {
    $(".welcome").get(0).style.color = randomColor();
    SETTING.getConfig();
    snake = new Snake();
    meteorite = new Meteorite();
    food = new Food();
    SETTING.setContextLevel();

    levelValue.textContent = "newbie";
    scoreValue.textContent = "00";
    showScreen(2);
    changeScreen();
    control();
    update();
  };
  return {
    start() {
      init();
    },
  };
})();
