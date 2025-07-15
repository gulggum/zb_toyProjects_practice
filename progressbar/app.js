(() => {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const $progressBar = get(".progress_bar");

  const onScroll = () => {
    //페이지 전체높이(화면안 안보이는 부분까지 포함한 총 높이)
    const htmlHeight = document.documentElement.scrollHeight;
    //현재 화면에 보이는 높이
    const clientHeight = document.documentElement.clientHeight;
    //얼마나 스크롤했는지 0부터 내릴수록 점점커짐
    const scrollTop = document.documentElement.scrollTop;

    const height = htmlHeight - clientHeight;
    const scrollWidth = (scrollTop / height) * 100;
    $progressBar.style.width = `${scrollWidth}%`;
  };

  const init = () => {
    window.addEventListener("scroll", onScroll);
  };
  init();
})();
