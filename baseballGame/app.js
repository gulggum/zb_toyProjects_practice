(() => {
  "use strict";

  const get = (target) => document.querySelector(target);
  const $form = get("form");
  const $input = get("input");
  const $result = get(".result");
  const $answer = get(".ball_answer");
  const $resetBtn = get(".resetBtn");

  const baseball = {
    password: "",
    trial: 0,
    gameOver: false,
  };
  const maxTrial = 10; // 기회 10회

  const resetGame = () => {
    baseball.trial = 0;
    baseball.gameOver = false;
    $result.innerHTML = "";
    $answer.textContent = "정답은?";
    $input.value = "";
    $input.focus();
    setPassword(); //새 비밀번호 생성
  };
  //결과를 묶어주는 함수
  const getResult = (input, answer) => {
    const strike = getStrikes(input, answer);
    const ball = getBalls(input, answer);
    return `Strike : ${strike} , Ball : ${ball}`;
  };

  //판별함수(ball) - 숫자는 일치 위치 불일치일 경우
  const getBalls = (input, answer) => {
    let ball = 0;
    for (let i = 0; i < input.length; i++) {
      //숫자는 포함되어 있지만, 위치는 다를때
      if (input[i] !== answer[i] && answer.includes(input[i])) {
        ball++;
      }
    }
    return ball;
  };
  //판별함수(strike) - 숫자와 위치일치할경우
  const getStrikes = (input, answer) => {
    let strike = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === answer[i]) {
        strike++;
      }
    }
    return strike;
  };

  //4자리 랜덤숫자 만들어놓기
  const setPassword = () => {
    const gameLimit = Array(10).fill(false);
    let password = "";
    while (password.length < 4) {
      //0~9까지 숫자중 무작위로 하나 뽑기
      const random = Math.floor(Math.random() * 10);

      // 이미 뽑힌 숫자면 건너뛰고 다시 뽑기
      if (gameLimit[random]) {
        continue;
      }
      //아직 안 뽑힌 숫자면 password에 추가
      password += random;
      //뽑았다는 걸 체크해서 다음에 중복되지 않게
      gameLimit[random] = true;
      baseball.password = password;
      console.log(random, gameLimit[random]); //랜덤숫자 콘솔출력
    }
  };

  const startGame = (e) => {
    e.preventDefault();
    if (baseball.gameOver) return;
    const input = $input.value;
    if (input.length !== 4) {
      alert("4자리 숫자를 입력해주세요!");
      return;
    }
    baseball.trial++; //시도횟수
    const result = getResult(input, baseball.password);

    //결과 출력
    const $em = document.createElement("em");
    $em.textContent = `${baseball.trial}차 시도 `;

    const $text = document.createElement("span");
    $text.textContent = `: ${input} -> ${result}`;

    const $line = document.createElement("div");
    $line.appendChild($em);
    $line.appendChild($text);

    $result.appendChild($line);

    //홈런체크
    if (result.includes("Strike : 4")) {
      alert("🎉 홈런! 정답입니다!");
      $input.value = "";
      $answer.textContent = `🎉홈런! 정답: ${baseball.password}`;
      $resetBtn.style.display = "block";
    }
    //10회 초과시 게임 종료
    if (baseball.trial >= maxTrial) {
      alert(`💥 Game Over! 정답은: ${baseball.password}`);
      baseball.gameOver = true;
      $resetBtn.style.display = "block";
      if (baseball.gameOver) {
        $answer.textContent = `✔️정답: ${baseball.password}`;
      }

      return;
    }

    $input.value = "";
    $input.focus();
  };
  const init = () => {
    $form.addEventListener("submit", startGame);
    setPassword(); //4자리 먼저생성
    $resetBtn.addEventListener("click", resetGame);
  };

  init();
})();
