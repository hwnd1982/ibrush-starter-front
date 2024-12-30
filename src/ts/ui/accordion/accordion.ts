import { getTransitionDuration, states } from "../../utils";

export type AccordionElement = HTMLElement & { accordion?: Accordion };

class Accordion {
  element: AccordionElement;
  trigger: HTMLElement;
  content: HTMLElement;
  isActive: boolean;

  constructor(element: HTMLElement) {
    this.element = element;

    this.init();
  }

  private init = () => {
    this.trigger = this.element.querySelector(".js-accordion-trigger");
    this.content = this.element.querySelector(".js-accordion-content");

    this.trigger.addEventListener("click", this.handleTriggerClick);

    if (this.element.classList.contains(states.active)) {
      this.open();
    } else {
      this.close();
    }

    this.element.accordion = this;
    this.element.classList.add(states.init);
  };

  private handleTriggerClick = () => {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  };

  public open = () => {
    this.showContent();

    this.element.classList.add(states.active);
    this.isActive = true;
  };

  public close = () => {
    this.hideContent();

    this.element.classList.remove(states.active);
    this.isActive = false;
  };

  public showContent = () => {
    this.content.style.maxHeight = this.content.scrollHeight + "px";

    setTimeout(() => {
      this.content.style.maxHeight = "9999px";
    }, getTransitionDuration(this.content));
  };

  public hideContent = () => {
    if (this.isActive) {
      this.content.style.transitionDuration = "0ms";
      this.content.style.maxHeight = this.content.scrollHeight + "px";
    }

    setTimeout(() => {
      this.content.style.transitionDuration = "";
      this.content.style.maxHeight = "0px";
    });
  };
}

export function initAccordions() {
  const accordions = document.querySelectorAll<HTMLElement>(
    `.js-accordion:not(.${states.init})`,
  );

  accordions.forEach((accordion) => {
    new Accordion(accordion);
  });
}
