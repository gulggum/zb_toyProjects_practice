(() => {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  class PhotoEditor {
    constructor() {
      this.container = get("main");
      this.canvas = get(".canvas");
      this.ctx = this.canvas.getContext("2d"); //그림을 그릴수 있는 도구 꺼내기
      //ㄴ>context축약(canvas관련)
      this.width = 700;
      this.height = 450;
      this.minSize = 20;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx.lineWidth = 4; //선두께
      this.ctx.strokeStyle = "#ff0000"; //캔버스에 선 그릴때 사용할 색상
      //---수정후 결과 canvas ---
      this.targetImage = get(".img_wrap");
      this.targetCanvas = document.createElement("canvas");
      this.targetCtx = this.targetCanvas.getContext("2d");
      this.targetWidth;
      this.targetHeight;
      this.sourceX; //공식용어로 원본 이미지에서 잘라낼 위치
      this.sourceY;
      this.sourceWidth; //자를 영역의 너비
      this.img = new Image(); //작업중인 사진을 담는 변수!
      this.btnFlip = get(".btn_flip");
      this.btnSepia = get(".btn_sepia");
      this.btnGray = get(".btn_gray");
      this.btnBlur = get(".btn_blur");
      this.btnSave = get(".btn_save");
      this.fileDrag = get(".drag_area");
      this.fileInput = get(".drag_area input");
      this.fileImage = get(".fileImage");
      this.clickEvent();
      this.fileEvent();
      this.drawEvent();
    }

    clickEvent() {
      this.btnFlip.addEventListener("click", this.flipEvent.bind(this));
      this.btnSepia.addEventListener("click", this.sepiaEvent.bind(this));
      this.btnGray.addEventListener("click", this.grayEvent.bind(this));
      this.btnBlur.addEventListener("click", this.blurEvent.bind(this));
      this.btnSave.addEventListener("click", this.saveEvent.bind(this));
    }

    flipEvent() {
      this.targetCtx.translate(this.targetWidth, 0);
      this.targetCtx.scale(-1, 1);
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      );
    }
    sepiaEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.targetCtx.filter = `sepia(1)`;
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      );
    }
    grayEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.targetCtx.filter = `grayscale(1)`;
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      );
    }
    blurEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.targetCtx.filter = `blur(5px)`;
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      );
    }

    saveEvent() {
      const url = this.targetCanvas.toDataURL(); //타겟이미지를 데이터 url로 바꿔줌
      const downloader = document.createElement("a");
      downloader.style.display = "none";
      downloader.setAttribute("href", url);
      downloader.setAttribute("download", "canvas.png");
      this.container.appendChild(downloader);
      downloader.click(); //자동 클릭 발생시킴(save버튼만 눌러도 a링크가 클릭되도록)

      setTimeout(() => {
        this.container.removeChild(downloader);
      }, 100);
    }
    fileEvent() {
      this.fileInput.addEventListener("change", (event) => {
        const fileName = URL.createObjectURL(event.target.files[0]);
        //한개만 선택해도 파일 목록은 배열처럼 저장되기때문에 일관적인 처리기능을위해 항상 첫번째 파일[0] 꺼내기
        //URL.createObjectURL()=>사용자 컴터에 있는 파일을 브라우저가 입시 URL로 변환해주는 함수(img.src나 setAttri..("src")에 이 임시URL을 넣어야 화면에 로드됨)
        const img = new Image();
        img.addEventListener("load", (e) => {
          this.width = e.target.naturalWidth; //이미지 본래크기
          this.height = e.target.naturalHeight;
        });
        this.fileImage.setAttribute("src", fileName);
        img.setAttribute("src", fileName);
      });
    }

    drawEvent() {
      let sX, sY, eX, eY;
      let drawStart = false;

      //시작 좌표 저장(sX,sY)
      this.canvas.addEventListener("mousedown", (e) => {
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / canvasRect.width;
        const scaleY = this.canvas.height / canvasRect.height;
        sX = (e.clientX - canvasRect.left) * scaleX;
        sY = (e.clientY - canvasRect.top) * scaleY;

        drawStart = true;
      });

      //드래그 중일 때 실시간으로 사각형 그리기(끝 좌표는 eX,eY)
      this.canvas.addEventListener("mousemove", (e) => {
        if (!drawStart) return; //드로잉 시작 안했으면 실행x
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / canvasRect.width;
        const scaleY = this.canvas.height / canvasRect.height;

        eX = (e.clientX - canvasRect.left) * scaleX;
        eY = (e.clientY - canvasRect.top) * scaleY;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(sX, sY, eX - sX, eY - sY);
      });

      //마우스를 떼면 그 좌표를 기준으로 자르기 실행
      this.canvas.addEventListener("mouseup", () => {
        drawStart = false;

        if (
          Math.abs(eX - sX) < this.minSize ||
          Math.abs(eY - sY) < this.minSize
        ) {
          return;
        }
        this.drawOutput(sX, sY, eX - sX, eY - sY);
      });
    }

    drawOutput(x, y, width, height) {
      this.targetImage.innerHTML = "";

      if (Math.abs(width) <= Math.abs(height)) {
        this.targetHeight = this.height;
        this.targetWidth = (this.targetHeight * width) / height;
      } else {
        this.targetWidth = this.width;
        this.targetHeight = (this.targetWidth * height) / width;
      }
      this.targetCanvas.width = this.targetWidth;
      this.targetCanvas.height = this.targetHeight;

      this.img.addEventListener("load", () => {
        //캔버스랑 실제 이미지 사이의 비율 차이 계산(캔버스는 화면에 작게 그려지나,원본 이미지는 더 크니까!)
        const bufferX = this.img.naturalWidth / this.canvas.width;
        const bufferY = this.img.naturalHeight / this.canvas.height;
        this.sourceX = x * bufferX;
        this.sourceY = y * bufferY;
        this.sourceWidth = width * bufferX;
        this.sourceHeight = height * bufferY;

        this.targetCtx.drawImage(
          this.img,
          this.sourceX,
          this.sourceY,
          this.sourceWidth,
          this.sourceHeight,
          0,
          0,
          this.targetWidth,
          this.targetHeight
        );
      });
      this.img.src = this.fileImage.getAttribute("src");
      this.targetImage.appendChild(this.targetCanvas);
    }
  }

  new PhotoEditor();
})();
