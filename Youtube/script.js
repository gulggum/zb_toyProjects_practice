(function () {
  "use strict";

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const $search = get("#search");
  const $searchBtn = get(".search_btn");
  const $contentLists = getAll(".contents.list figure");

  // controls요소 불러오기!
  const $video = get(".contents.view video");
  const $progress = get(".video_progress");
  const $replayBtn = get(".video_replay");
  const $playBtn = get(".video_play");
  const $stopBtn = get(".video_stop");
  const $volume = get(".video_volume");
  const $muteBtn = get(".video_muteBtn");
  const $fullScreenBtn = get(".video_fullScreen");

  //검색창기능
  const onSearch = () => {
    let searchText = $search.value.toLowerCase();

    for (let i = 0; i < $contentLists.length; i++) {
      const $target = $contentLists[i].querySelector("strong");
      const text = $target.textContent.toLowerCase();

      //indexOf로 검색값이 위치해있는지 확인
      if (text.includes(searchText)) {
        $contentLists[i].style.display = "block";
      } else {
        $contentLists[i].style.display = "none";
      }
    }
  };

  //썸네일 마우스오버시 기능
  const onMouseOver = (e) => {
    const webpPlay = e.currentTarget.querySelector("source");
    webpPlay.setAttribute("srcset", "./assets/sample.webp");
  };
  const onMouseOut = (e) => {
    const webpPlay = e.currentTarget.querySelector("source");
    webpPlay.setAttribute("srcset", "./assets/sample.jpg");
  };

  const onHashChange = (e) => {
    e.preventDefault(); //  a 태그의 기본 링크 동작 막기!!-> 생략했더니 strong클릭해야 이벤트발생됨
    const target = e.currentTarget.closest("figure");
    const movieTitle = target.querySelector("strong").textContent;
    window.location.hash = `view&${movieTitle}`; //해시값 바꾸기->이름보고 이벤트발생
  };

  const getViewPage = () => {
    const viewTitle = get(".view strong");
    const urlTitle = decodeURI(window.location.hash.split("&")[1]);
    console.log(urlTitle);
    viewTitle.innerText = urlTitle;

    get(".list").style.display = "none";
    get(".view").style.display = "grid";
  };

  const getListPage = () => {
    get(".view").style.display = "none";
    get(".list").style.display = "grid";
  };

  //Controls 이벤트 기능들
  const onControls = () => {
    $playBtn.addEventListener("click", playVideo);
    $stopBtn.addEventListener("click", stopVideo);
    $replayBtn.addEventListener("click", replayVideo);
    $volume.addEventListener("input", volumeVideo);
    $muteBtn.addEventListener("click", toggleMute);
    $fullScreenBtn.addEventListener("click", fullScreenVideo);
    $video.addEventListener("timeupdate", setProgress);
    $progress.addEventListener("input", onHandleProgress);
  };

  //중복되는 버튼텍스트 값 변경 함수
  const btnTextChange = (btn, value) => {
    btn.innerText = value;
  };

  const onHandleProgress = (e) => {
    const value = e.target.value;
    const newTime = ($video.duration * value) / 100;
    $video.currentTime = newTime;
  };

  const setProgress = () => {
    const percent = ($video.currentTime / $video.duration) * 100;
    $progress.value = percent;
  };

  const fullScreenVideo = () => {
    //전체화면 상태인경우 ->전체화면 종료
    if (
      //브라우저별 fullscreen지원 호환성
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      //전체화면 종료
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        document.mozCancelFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      //전체화면 진입
      if ($video.requestFullscreen) {
        $video.webkitRequestFullscreen();
      } else if ($video.mozRequestFullscreen) {
        $video.mozRequestFullscreen();
      } else if ($video.msRequestFullscreen) {
        $video.msRequestFullscreen();
      } else {
        alert("전체화면을 지원하지 않는 브라우저입니다..");
      }
    }
  };
  const toggleMute = () => {
    if ($video.muted) {
      $video.muted = false;
      btnTextChange($muteBtn, "Mute");
    } else {
      $video.muted = true;
      btnTextChange($muteBtn, "Unmute");
    }
  };

  const volumeVideo = (e) => {
    $video.volume = e.target.value;
    console.log($video.volume);
  };

  const replayVideo = () => {
    $video.currentTime = 0; //영상 처음으로
    $video.play();
    btnTextChange($playBtn, "Pause");
  };

  const stopVideo = () => {
    $video.pause();
    $video.currentTime = 0;
    btnTextChange($playBtn, "Play");
  };

  const playVideo = () => {
    if ($video.paused || $video.ended) {
      $video.play();
      btnTextChange($playBtn, "Pause");
    } else {
      $video.pause();
      btnTextChange($playBtn, "Play");
    }
  };
  const init = () => {
    window.location.hash = "";
    $search.addEventListener("input", onSearch); //실시간 검색
    $searchBtn.addEventListener("click", onSearch);

    //썸네일에 마우스 오버시 영상재생이벤트 설정
    for (let i = 0; i < $contentLists.length; i++) {
      const $target = $contentLists[i].querySelector("picture");
      $target.addEventListener("mouseover", onMouseOver);
      $target.addEventListener("mouseout", onMouseOut);
      $contentLists[i].addEventListener("click", onHashChange);
    }

    //해쉬 이용하여 원하는화면에 있는지 확인(hashchange)
    window.addEventListener("hashchange", () => {
      const isView = -1 < window.location.hash.indexOf("view");
      if (isView) {
        getViewPage();
      } else {
        getListPage();
      }
    });
    onControls();
  };

  init();
})();
