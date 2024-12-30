import { store } from "./store";

export class Scrollbar {
  isHidden: boolean;
  scrollPosition: number;
  header: HTMLElement;
  headerNav: HTMLElement;

  constructor() {
    this.isHidden = false;
    this.scrollPosition = 0;
    this.header = document.querySelector<HTMLElement>(".js-header");
    this.headerNav = this.header.querySelector<HTMLElement>(".js-header-nav");
  }

  hide() {
    if (!document.body.hasAttribute("data-body-scroll-fix")) {
      this.scrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      const maxWidth = document.body.offsetWidth;
      const scrollPosition = window.scrollY;
      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const bodyPaddingRight = getComputedStyle(document.body)["paddingRight"];
      const headerPaddingRight = getComputedStyle(this.header)["paddingRight"];

      // console.log(bodyPaddingRight, scrollWidth);

      document.body.setAttribute(
        "data-body-scroll-fix",
        String(scrollPosition),
      );

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach(
          (block) =>
            (block.style.paddingRight = `calc(${bodyPaddingRight} + ${scrollWidth}px)`),
        );

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "-" + scrollPosition + "px";
      document.body.style.left = `${(window.innerWidth - maxWidth - scrollWidth) / 2}px`;
      document.body.style.width = `100%`;
      document.body.style.paddingRight = `calc(${bodyPaddingRight} + ${scrollWidth}px)`;
      this.header.style.paddingRight = `calc(${headerPaddingRight} + ${scrollWidth}px)`;
      this.headerNav.style.paddingRight = `calc(${headerPaddingRight} + ${scrollWidth}px)`;

      this.isHidden = true;

      return { scrollWidth };
    }
  }

  show() {
    if (document.body.hasAttribute("data-body-scroll-fix")) {
      document.body.removeAttribute("data-body-scroll-fix");

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach((block) => (block.style.paddingRight = ``));

      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.width = "";
      this.header.style.paddingRight = "";
      this.headerNav.style.paddingRight = "";

      window.scroll(0, +this.scrollPosition);

      this.isHidden = false;
    }
  }
}

export function initScrollbar() {
  store.scrollbar = new Scrollbar();
}
