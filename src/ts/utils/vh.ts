import { debounce } from "./debounce";

export function initVs() {
  setVh();
  window.addEventListener("resize", debounce(setVh, 300));

  function setVh() {
    const vh = window.innerHeight * 0.01;
    const vw = document.documentElement.offsetWidth * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--vw", `${vw}px`);
  }
}
