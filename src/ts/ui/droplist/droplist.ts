import { states } from "../../utils";

export class Droplist {
  element: HTMLElement;
  
  constructor(element: HTMLElement) {
    this.element = element;

    this.init();
  }

  init() {
    this.element?.addEventListener("click", this.toggle);
  }

  toggle = ({target}: Event) => {
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      const trigger = target.closest<HTMLElement>(".js-droplist-trigger");

      if (trigger) {
        this.element.classList.toggle(states.open);
      }
    }
  }
}

export function initDroplists() {
  document.querySelectorAll<HTMLElement>(".js-droplist").forEach(item => new Droplist(item));
}
