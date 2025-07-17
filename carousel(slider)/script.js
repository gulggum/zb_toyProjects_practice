(() => {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  class Carousel {
    constructor(carouselEl) {
      this.carouselEl = carouselEl; //전달받은 캐러셀 dom
      this.itemClassName = "carousel_item"; //클래스명 가져오기
      this.items = this.carouselEl.querySelectorAll(".carousel_item");
      this.totalItems = this.items.length; //슬라이드 총개수(끝,첫번째 판단시 사용)
      this.current = 0; //현재 보여지는 슬라이드 인덱스 번호
      this.isMoving = false; //이동 중인지 확인하는 플래그
    }
    //초기 상태 세팅(슬라이드 처음시작시 어떤걸 보여줄지)
    initCarousel() {
      this.items[this.totalItems - 1].classList.add("prev");
      this.items[0].classList.add("active"); //첫번째 슬라이드에 부여
      this.items[1].classList.add("next");
    }

    movePrev() {
      if (this.current === 0) {
        this.current = this.totalItems - 1; //맨앞이면->맨뒤로
      } else {
        this.current--;
      }
      this.moveCarouselTo();
    }

    moveNext() {
      if (this.current === this.totalItems - 1) {
        this.current = 0; //맨 뒤면->처음으로
      } else {
        this.current++;
      }
      this.moveCarouselTo();
    }

    moveCarouselTo() {
      if (this.isMoving) return; //이동 중이면 무시
      this.isMoving = true;

      let prev = this.current - 1; //이전 인덱스
      let next = this.current + 1; //다음 인덱스

      //index가 음수가 되면 안되니..첫번째 슬라이드[0]일 때
      if (this.current === 0) {
        prev = this.totalItems - 1;
      }
      //마지막 슬라이드[4]일 때
      else if (this.current === this.totalItems - 1) {
        next = 0; //첫번째 인덱스를 next로 설정
      }

      //모든 슬라이드 순회하면서 CSS className 업데이트
      for (let i = 0; i < this.totalItems; i++) {
        if (i === this.current) {
          this.items[i].className = this.itemClassName + " active";
        } else if (i === prev) {
          this.items[i].className = this.itemClassName + " prev";
        } else if (i === next) {
          this.items[i].className = this.itemClassName + " next";
        } else {
          this.items[i].className = this.itemClassName;
        }
      }
      //transition 시간뒤에 플래그 초기화
      setTimeout(() => {
        this.isMoving = false;
      }, 500); //->css transition시간과 맞춰야함 현재0.5s
    }
    //버튼 연결하기
    setEventListeners() {
      this.prevBtn = this.carouselEl.querySelector(".carousel_button--prev");
      this.nextBtn = this.carouselEl.querySelector(".carousel_button--next");

      this.prevBtn.addEventListener("click", () => {
        this.movePrev();
      });
      this.nextBtn.addEventListener("click", () => {
        this.moveNext();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const carouselEl = get(".carousel");
    const carousel = new Carousel(carouselEl);
    carousel.initCarousel(); //처음상태 셋업
    carousel.setEventListeners(); //버튼연결
  });
})();
