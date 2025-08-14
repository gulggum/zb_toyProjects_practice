(() => {
  "use strict";

  const get = (target) => document.querySelector(target);

  //사용자 웹캠,마이크 접근허용 요청여부
  const allowUser = {
    audio: true,
    video: true,
  };

  class WebRtc {
    constructor() {
      (this.media = new MediaSource()),
        (this.recorder = null),
        (this.blobs = []); //파일 다운을위한
      this.playedVideo = get("video.played");
      this.recordVideo = get("video.record");
      this.playBtn = get(".play_btn");
      this.downloadBtn = get(".download_btn");
      this.recordBtn = get(".record_btn");
      this.container = get(".webrtc");
      this.events();
      this.getMedia(); //사용자에게 웹캠/마이크 접근 허락 받을지 묻는것
    }

    async getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(allowUser);
        console.log("스트림객체:", stream);
        this.success(stream);
      } catch (error) {
        console.log("카메라/마이크 접근실패", error);
      }
    }
    //위에서 사용자 접근허락 성공시!
    success(audioVideo) {
      this.recordBtn.removeAttribute("disabled"); //녹화 버튼 활성화
      window.stream = audioVideo; //스트림을 전역에 저장

      //비디오 태그에 스트림 연결
      this.playedVideo.srcObject = audioVideo;
      this.playedVideo.play(); //재생시작
    }
    events() {
      this.recordBtn.addEventListener("click", this.toggleRecord.bind(this));
      this.playBtn.addEventListener("click", this.play.bind(this));
      this.playBtn.addEventListener("click", this.togglePlay.bind(this));
      this.downloadBtn.addEventListener("click", this.download.bind(this));
      //ㄴ>.bind(this) 클래스 메서드를 이벤트 리스너로 넘기면, js는 내부에서 this를 DOM요소로 바꿔버림,그래서 원래 클래스 인스턴스를 가리키도록 유지하려고 this고정
    }

    pushBlobData(e) {
      if (!e.data || e.data.size < 1) {
        return;
      }
      this.blobs.push(e.data);
    }

    togglePlay() {
      if (this.playBtn.textContent === "재생") {
        this.recordVideo.play();
        this.playBtn.textContent = "멈춤";
      } else {
        this.recordVideo.pause();
        this.playBtn.textContent = "재생";
      }
    }

    toggleRecord() {
      if (this.recordBtn.textContent === "녹화") {
        this.startRecord();
      } else {
        this.playBtn.removeAttribute("disabled");
        this.downloadBtn.removeAttribute("disabled");
        this.recordBtn.textContent = "녹화";
        this.stopRecord();
      }
    }

    startRecord() {
      let type = { mimeType: "video/webm;codecs=vp9" };
      this.blobs = [];
      //┌> 내 브라우저가 특정 형식 녹화 가능한지 검사
      if (!MediaRecorder.isTypeSupported(type.mimeType)) {
        type = { mimeType: "video/webm" };
      }
      this.recorder = new MediaRecorder(window.stream, type); //스트림 녹화용 객체 만들기
      this.recordBtn.textContent = "중지";
      this.playBtn.setAttribute("disabled", true);
      this.downloadBtn.setAttribute("disabled", true);
      this.recorder.ondataavailable = this.pushBlobData.bind(this); //녹화 데이터가 생길 때마다 실행되는 함수 연결
      this.recorder.start(20); //녹화 시작, 20ms마다 데이터 받음
    }

    stopRecord() {
      this.recorder.stop();
      this.recordVideo.setAttribute("controls", true);
    }

    play() {
      const blob = new Blob(this.blobs, { type: "video/webm" });
      //ㄴ>저장된 녹화 데이터(blob조각들)를 하나로 합쳐서 새로운 blob객체 생성
      this.recordVideo.src = URL.createObjectURL(blob);
      //ㄴ>blob객체를 브라우저가 재생 가능한 "임시URL"로 만들어줌
    }

    download() {
      //1. 녹화한 blob 데이터들을 하나의 비디오 파일로 묶음
      const videoFile = new Blob(this.blobs, { type: "video/webm" });
      //2. 해당 blob을 브라우저에서 사용할 수 있는 임시 URL로 만듦
      const url = URL.createObjectURL(videoFile);

      //3.a태그를 동적으로 생성해 다운로드 링크로 사용
      const downloader = document.createElement("a");
      downloader.style.display = "none";
      downloader.href = url; //다운로드 대상 파일 설정
      downloader.download = "recorded_video.webm"; //다운로드 파일 이름 설정

      //4. 문서에 a태그를 임시로 추가한 후 강제로 클릭(자동 다운로드)
      document.body.appendChild(downloader);
      downloader.click();

      //5.다운로드 후 a태그 제거 + 브라우저 메모리 해제
      setTimeout(() => {
        document.body.removeChild(downloader);
        URL.revokeObjectURL(url); //임시 URL제거해 메모리 누수 방지
      }, 100);
    }
  }
  new WebRtc();
})();
