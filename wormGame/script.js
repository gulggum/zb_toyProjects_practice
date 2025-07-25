(() => {
  ("use strict");
  const get = (target) => document.querySelector(target);

  const $canvas = get(".canvas");
  const ctx = $canvas.getContext("2d"); //2D그림그리기

  const $score = get(".score");
  const $highScore = get(".highScore");
  const $play = get(".startBtn");

  // 색상 모음
  const colorSet = {
    board: "rgb(100, 164, 4)",
    snakeHead: "rgba(234, 2, 255, 0.5)",
    snakeBody: "rgba(20, 130, 240, 0.5)",
    food: "rgb(255, 192, 1)",
  };

  // 게임상태 저장할 변수
  let start = 0;
  let lastTime = 0; //마지막 프레임 시간
  const TILE_SIZE = 20;
  const CANVAS_SIZE = 400;

  let option = {
    highScore: localStorage.getItem("score") || 0,
    gameEnd: true, //게임이 끝났는지
    direction: 6, //현재 방향(6은 오른쪽(임의로 설정해준 숫자임))
    snake: [
      { x: TILE_SIZE, y: TILE_SIZE, direction: 6 }, //머리
      { x: TILE_SIZE, y: TILE_SIZE * 2, direction: 6 }, //몸통
      { x: TILE_SIZE, y: TILE_SIZE * 3, direction: 6 }, //꼬리
    ],
    food: { x: 0, y: 0 },
    score: 0,
    speed: 10, // 처음속도(프레임/초)
  };

  // 방향키->숫자 변환(보기쉽게 키보드에 있는 숫자로 적용함)
  const getDirection = (key) => {
    switch (key) {
      case "ArrowDown":
        return 2;
      case "ArrowUp":
        return 8;
      case "ArrowLeft":
        return 4;
      case "ArrowRight":
        return 6;
      default:
        return 0;
    }
  };

  // 반대 방향 못가게 막기(왼쪽에서 갑자기 오른쪽으로는 못감)
  // 반대방향이 아닐때!! 이 함수(방향변경함수)를 적용
  const isDirectionCorrect = (direction) => {
    const current = option.direction; //현재 진행 방향
    return (
      current === option.snake[0].direction && //뱀 머리와 방향 같아야 하고..
      !(
        (current === 2 && direction === 8) || //아래->위(반대)
        (current === 8 && direction === 2) ||
        (current === 4 && direction === 6) ||
        (current === 6 && direction === 4)
      )
    );
  };

  //캔버스 판 배경 그리기
  const buildBoard = () => {
    ctx.fillStyle = colorSet.board; //보드색 가져와서 채워줌
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); //(x,y,width,height) 해당 영역 채우기(사각형 칠하기)
  };
  //뱀 한칸 그리기
  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); //한 칸크기 ex(10x10)
  };
  //뱀 전체 그리기(원형)
  const setSnake = () => {
    for (let i = 0; i < option.snake.length; i++) {
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i === 0);
      console.log(
        `index:${i},x:${option.snake[i].x},y:${option.snake[i].y},isHead:${
          i == 0
        }`
      );
    }
  };

  //먹이 그리기
  const buildFood = (ctx, x, y) => {
    ctx.beginPath(); //새로운 경로 시작
    ctx.fillStyle = colorSet.food;
    ctx.arc(
      x + TILE_SIZE / 2,
      y + TILE_SIZE / 2,
      TILE_SIZE / 2,
      0,
      2 * Math.PI
    ); //원 그리는 함수(x + 5, y + 5)->정가운데 좌표로 옮겨주기
    ctx.fill(); //색 채우기(중요)
  };

  //뱀 한 칸씩 이동시키기
  const playSnake = () => {
    let x = option.snake[0].x;
    let y = option.snake[0].y;

    //뱀 이동방향 계산
    switch (option.direction) {
      case 4:
        x -= TILE_SIZE;
        break;
      case 6:
        x += TILE_SIZE;
        break;
      case 2:
        y += TILE_SIZE;
        break;
      case 8:
        y -= TILE_SIZE;
    }

    const snake = [{ x, y, direction: option.direction }]; //새로운 머리

    for (let i = 1; i < option.snake.length; ++i) {
      snake.push({ ...option.snake[i - 1] });
    }

    option.snake = snake;
  };

  // //뱀이 벽 밖으로 나가지 않게, 자동으로 반대편으로 튕겨주기
  // const setDirection = (num, value) => {
  //   while (value < 0) {
  //     value += num;
  //   }
  //   return value % num;
  // };

  //벽에 부딪히면 게임오버(벽통과x)
  const setDirection = (value) => value;

  // 먹이 먹기
  const getFood = () => {
    const snakeX = option.snake[0].x; //snake[0](뱀머리) x위치
    const snakeY = option.snake[0].y;
    const foodX = option.food.x;
    const foodY = option.food.y;

    if (snakeX === foodX && snakeY === foodY) {
      option.score++;
      option.speed = Math.min(option.speed + 1, 30); //최대 30프레임제한
      $score.innerHTML = `점수 : ${option.score}점`;
      setBody(); //뱀 몸통 늘리기
      randomFood(); //먹이 랜덤배치
    }
  };

  //뱀 몸통 늘리기
  const setBody = () => {
    const tail = option.snake[option.snake.length - 1];
    const direction = tail.direction;

    let x = tail.x;
    let y = tail.y;

    switch (direction) {
      case 4: //4번키 왼쪽으로 움직이면 꼬리가 반대쪽에 붙도록
        x += TILE_SIZE;
        break;
      case 6:
        x -= TILE_SIZE;
        break;
      case 8:
        y -= TILE_SIZE;
        break;
      case 2:
        y += TILE_SIZE;
        break;
    }
    option.snake.push({ x, y, direction }); //새로운 꼬리 추가
  };

  //먹이 위치 랜덤
  const randomFood = () => {
    let x = Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE;
    let y = Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE;

    //뱀 몸통이랑 겹치면 다시 생성
    while (option.snake.some((part) => part.x === x && part.y === y)) {
      x = Math.floor(Math.random() * 40) * 10;
      y = Math.floor(Math.random() * 40) * 10;
    }
    option.food = { x, y };
  };

  const setHighScore = () => {
    const currentScore = option.score;
    const savedScore = localStorage.getItem("score") || 0;

    if (currentScore > savedScore) {
      localStorage.setItem("score", currentScore); //점수 갱신!
      alert(`🎉 최고 기록 갱신! ${currentScore}점 `);
    }
  };

  const isGameOver = () => {
    const head = option.snake[0];

    //벽에 부딪히면 게임오버
    if (
      head.x < 0 ||
      head.x >= CANVAS_SIZE ||
      head.y < 0 ||
      head.y >= CANVAS_SIZE
    ) {
      return true;
    }
    //자기 몸에 부딪히면 게임오버
    return option.snake.some(
      (part, index) => index !== 0 && head.x === part.x && head.y === part.y
    );
  };

  const play = (timestamp) => {
    if (option.gameEnd) return;

    //게임 속도 조절(초당10프레임)
    if (timestamp - lastTime > 1000 / option.speed) {
      if (isGameOver()) {
        option.gameEnd = true;
        setHighScore();
        alert("게임 오버!");
        return;
      }

      playSnake();
      buildBoard();
      buildFood(ctx, option.food.x, option.food.y);
      setSnake();
      getFood();

      lastTime = timestamp; //타이밍 초기화
    }

    window.requestAnimationFrame(play); //무한루프
  };

  const init = () => {
    buildBoard();
    setSnake();
    buildFood(ctx, option.food.x, option.food.y);
    //1.방향키 입력처리
    document.addEventListener("keydown", (e) => {
      if (!/Arrow/gi.test(e.key)) return; //방향키 아니면 무시
      e.preventDefault();

      const direction = getDirection(e.key); //방향 얻기

      if (!isDirectionCorrect(direction)) return; //반대방향으로는 못감

      option.direction = direction; //방향 저장
    });

    // 게임 시작버튼
    $play.addEventListener("click", () => {
      randomFood();
      if (option.gameEnd) {
        option = {
          highScore: localStorage.getItem("score") || 0,
          gameEnd: false,
          direction: 6, //시작방향 : 오른쪽
          speed: 10,
          snake: [
            { x: TILE_SIZE, y: TILE_SIZE, direction: 6 },
            { x: TILE_SIZE, y: TILE_SIZE * 2, direction: 6 },
            { x: TILE_SIZE, y: TILE_SIZE * 3, direction: 6 },
          ],
          food: { x: 0, y: 0 },
          score: 0,
        };
        $score.innerHTML = `점수 : 0점`;
        $highScore.innerHTML = `최고점수 : ${option.highScore}점`;
        lastTime = 0; //속도 초기화
        randomFood(); //먹이 위치 랜덤 생성
        window.requestAnimationFrame(play); //게임 루프 시작
      }
    });
  };
  init();
})();
