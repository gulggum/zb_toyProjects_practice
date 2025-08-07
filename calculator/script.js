(() => {
  //즉시 실행함수(IIFE)=>전역 변수 충동 방지
  "use strict"; //안전한게 js를 작성하게 도와줌

  const get = (target) => {
    return document.querySelector(target);
  };

  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  class Calculator {
    //계산기의 상태를 관리하는 클래스
    constructor(element) {
      this.element = element; //표시할 화면 Input
      this.currentValue = "";
      this.preValue = "";
      this.operation = null; //선택된 연산자
    }

    //화면 업데이트 기능
    updateDisplay() {
      if (this.currentValue) {
        this.element.value = this.currentValue;
        return;
      }
      if (this.preValue) {
        this.element.value = this.preValue;
        return;
      }
      this.element.value = 0;
    }

    //숫자 입력기능
    appendNumber(number) {
      if (number === "." && this.currentValue.includes(".")) return; //"."중복 방지기능
      this.currentValue = this.currentValue.toString() + number.toString(); //입력된 숫자를 문자열로 이어붙임 ("1"+"2"="12")
    }

    //연산자 입력 기능
    setOperation(operation) {
      console.log(operation);
      // this.resetOperation();
      this.operation = operation; //현재 클릭한 연산자 저장
      this.preValue = this.currentValue; //현재 입력중인숫자를 이전값으로 저장
      this.currentValue = ""; //다음숫자를 입력받기위해 현재 값 비워줌

      const elements = Array.from(getAll(".operation"));
      const element = elements.filter((element) =>
        element.innerText.includes(operation)
      )[0];
      element.classList.add("active");
    }

    //계산기능(답 구하는 과정)
    compute() {
      let computation;
      const prev = parseFloat(this.preValue);
      const current = parseFloat(this.currentValue);
      //ㄴ>parseFloat로 문자열값을 숫자로 바꿔줌
      if (isNaN(prev) || isNaN(current)) return;

      switch (this.operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "*":
          computation = prev * current;
          break;
        case "÷":
          computation = prev / current;
          break;
        default:
          return;
      }

      this.currentValue = computation.toString();
      this.preValue = "";
      this.resetOperation();
    }

    clear() {
      if (this.currentValue) {
        this.currentValue = "";
        return;
      }
      if (this.operation) {
        this.resetOperation();
        this.currentValue = this.preValue;
        return;
      }
      if (this.preValue) {
        this.preValue = "";
        return;
      }
    }

    reset() {
      this.currentValue = "";
      this.preValue = "";
      this.resetOperation();
    }

    resetOperation() {
      this.operation = null;
      const elements = Array.from(getAll(".operation"));
      elements.forEach((element) => {
        element.classList.remove("active");
      });
    }
  }

  const numberBtns = getAll(".cell_button.number");
  const operationBtns = getAll(".cell_button.operation");
  const allClearBtn = get(".cell_button.all_clear");
  const clearBtn = get(".cell_button.clear");
  const computeBtn = get(".cell_button.compute");
  const display = get(".display"); //input요소

  const calculator = new Calculator(display);

  numberBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      calculator.appendNumber(btn.innerText);
      calculator.updateDisplay();
    });
  });

  operationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      calculator.setOperation(btn.innerText);
      calculator.updateDisplay();
    });
  });

  computeBtn.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
  });

  clearBtn.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
  });

  allClearBtn.addEventListener("click", () => {
    calculator.reset();
    calculator.updateDisplay();
  });
})();
