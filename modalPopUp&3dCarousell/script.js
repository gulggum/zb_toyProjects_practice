(() => {
  "use strict";

  const get = (target) => document.querySelector(target);

  /*3d carousel*/
  const $carousel = get(".carousel");
  const $prevBtn = get(".prev_button");
  const $nextBtn = get(".next_button");
  const cellCount = 6;
  let selectedIndex = 0;

  const rotateCarousel = () => {
    const angle = (selectedIndex / cellCount) * -360;
    $carousel.style.transform = `translateZ(-346px) rotateY(${angle}deg)`;
  };

  $prevBtn.addEventListener("click", () => {
    selectedIndex--;
    rotateCarousel();
  });
  $nextBtn.addEventListener("click", () => {
    selectedIndex++;
    rotateCarousel();
  });

  /*modal_popUp*/
  const $modalBtn = get(".modal_OpenBtn");
  const $modalPage = get(".modal_page");
  const $cancelBtn = get(".modalBtn.cancel");
  const $confirmBtn = get(".modalBtn.confirm");
  const $body = get("body");

  $modalBtn.addEventListener("click", () => {
    $modalPage.classList.add("show");
    $body.classList.add("scroll_lock");
  });

  $cancelBtn.addEventListener("click", () => {
    $modalPage.classList.remove("show");
  });
  $confirmBtn.addEventListener("click", () => {
    $modalPage.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === $modalPage) {
      $modalPage.classList.remove("show");
    }
  });
})();
