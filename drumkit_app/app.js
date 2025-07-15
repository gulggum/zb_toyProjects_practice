(() => {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  const soundsRoot = "assets/sounds/";
  const drumSounds = [
    { key: 81, sound: "clap.wav" },
    { key: 87, sound: "crash.wav" },
    { key: 69, sound: "hihat.wav" },
    { key: 65, sound: "kick.wav" },
    { key: 83, sound: "openhat.wav" },
    { key: 68, sound: "ride.wav" },
    { key: 90, sound: "shaker.wav" },
    { key: 88, sound: "snare.wav" },
    { key: 67, sound: "tom.wav" },
  ];

  const $keys = Array.from(getAll(".key")); //유사배열을 Array.from으로 배열로 변환

  const getAudioElement = (index) => {
    const audio = document.createElement("audio"); //오디오 요소 만들기
    audio.dataset.key = drumSounds[index].key; //data-key속성 추가
    audio.src = soundsRoot + drumSounds[index].sound; //소리파일 연결
    return audio;
  };

  const ontransitionEnd = (e) => {
    if (e.propertyName === "transform") {
      e.target.classList.remove("playing");
    }
  };
  const onKeyDown = (e) => {
    const keycode = e.keyCode;
    const $audio = get(`audio[data-key="${keycode}"]`);
    const $key = get(`div[data-key="${keycode}"]`);

    if (!$audio) return;

    $audio.currentTime = 0;
    $audio.play();
    $key.classList.add("playing");
    console.log($audio);
  };

  //마우스클릭으로도 소리재생
  const onMouseDown = (e) => {
    const keycode = e.currentTarget.dataset.key; //클릭한 key의 data-key값 가져오기
    playSound(keycode);
  };

  const playSound = (keycode) => {
    const $audio = get(`audio[data-key="${keycode}"]`);
    const $key = get(`div[data-key="${keycode}"]`);

    if (!$audio) return;

    $audio.currentTime = 0;
    $audio.play();
    $key.classList.add("playing");
  };
  const init = () => {
    //1. 키 하나하나 순회하면서 오디오 붙이기+세팅
    $keys.forEach((key, index) => {
      const audio = getAudioElement(index); //오디오 만들기
      key.appendChild(audio);
      key.addEventListener("transitionend", ontransitionEnd); //애니끝나면 효과제거
      key.dataset.key = drumSounds[index].key; //data - key추가;
      key.addEventListener("mousedown", onMouseDown);
      key.addEventListener("touchstart", onMouseDown);
    });
    window.addEventListener("keydown", onKeyDown);
  };

  init();
})();
