import { detectMob, initScrollbar, initVs } from "./";
import {} from "../modules";
import { initClickSmoothScroll, initDefineScrollDirection } from "../utils";
import PerfectScrollbar from "perfect-scrollbar";

import {
  initTextFields,
  initRadios,
  initModals,
  initDropdowns,
  initDroplists,
} from "../ui";

export function initBase() {
  initVs();
  initScrollbar();
  initClickSmoothScroll();
  initCustomScrollbars();
  initDefineScrollDirection();

  initDropdowns();
  initDroplists();

  initRadios();
  initTextFields();
  initModals();

  window.addEventListener("resize", initCustomScrollbars);
}

export type PerfectScrollbarElement = HTMLElement & {
  ps?: PerfectScrollbar;
};

function initCustomScrollbars() {
  if (detectMob()) {
    window.store.customScrollbars.forEach((s: PerfectScrollbar) => s.destroy());
  } else {
    if (window.store.customScrollbars.length) {
      window.store.customScrollbars.forEach((s: PerfectScrollbar) =>
        s.update(),
      );
    } else if (document.querySelector(`.custom-scroll`)) {
      document
        .querySelectorAll<PerfectScrollbarElement>(`.custom-scroll`)
        .forEach((s) => {
          s.ps = new PerfectScrollbar(s, { scrollYMarginOffset: 5 });
          window.store.customScrollbars.push(s.ps);
        });
    }
  }
}
