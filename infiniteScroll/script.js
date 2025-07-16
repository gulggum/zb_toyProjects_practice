(() => {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };
  const API_URL = "https://jsonplaceholder.typicode.com/posts";
  const $posts = get(".posts");
  const $loader = get(".loader");

  let currentPage = 1;
  const limit = 10;
  const end = 100; //총 데이터 개수 -마지막에선 더이상 불러오지않게

  //json서버에서 포스트데이터 불러오기
  const getPostData = async (page) => {
    try {
      const res = await fetch(`${API_URL}?_page=${page}&_limit=${limit}`);
      const postsData = await res.json();
      return postsData;
    } catch (error) {
      throw new Error(error + "데이터를 불러오지 못했습니다.");
    }
  };
  //포스트 데이터 돔화면에 보여주기
  const showPosts = async (page) => {
    showLoader(); //로딩 시작..

    const posts = await getPostData(page);

    posts.forEach((post) => {
      const { id, body, title } = post;

      const $post = document.createElement("div");
      $post.classList.add("post");
      $post.innerHTML = `
              <div class="header">
        <div class="id">${id}</div>
        <div class="title">${title}</div>
      </div>
      <div class="body">${body}</div>
        `;
      $posts.appendChild($post);
    });
    hideLoader(); //로딩 끝.
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //스크롤 위치 확인(끝까지 내려간 위치에서 -5로 조금 여유를 줌)
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      currentPage++; //페이지 1씩 증가
      showPosts(currentPage); //해당 페이지 불러오기
    }
    if (currentPage * limit >= end) {
      window.removeEventListener("scroll", handleScroll);
      return;
    }
  };

  //css 로딩 애니메이션(loader) 보여주기
  const showLoader = () => {
    $loader.classList.add("show");
  };

  const hideLoader = () => {
    $loader.classList.remove("show");
  };
  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      window.addEventListener("scroll", handleScroll);
      showPosts();
    });
  };

  init();
})();
