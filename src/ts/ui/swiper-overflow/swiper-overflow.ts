import Swiper from "swiper";

export function initSwiperOverflow() {
  const swipers = document.querySelectorAll<HTMLElement>('.js-swiper-overflow');

  swipers.forEach(swiper => {

    new Swiper(swiper, {
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesProgress: true,
    })
  })
}
