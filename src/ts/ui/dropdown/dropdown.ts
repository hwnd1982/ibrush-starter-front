import { states, afterTransition } from "../../utils";

export type DropdownPosition = "tl" | "t" | "tr" | "bl" | "b" | "br";

export interface IDropdownOptions {
  readonly position?: DropdownPosition;
  readonly contentClass?: string;
  readonly modalClass?: string;
  readonly itemClass?: string;
  readonly offset?: number;
}

export type DropdownElement = HTMLDivElement & { dropdown?: Dropdown };

export class Dropdown {
  element: DropdownElement;
  options: IDropdownOptions;
  content: HTMLDivElement;
  modal: HTMLDivElement;
  isActive: boolean;

  private closeTransitionTimerId: NodeJS.Timeout;

  constructor(element: HTMLDivElement) {
    if (element.classList.contains(states.init)) return;

    this.element = element;
    this.element.dropdown = this;
    this.options = this.defineOptions();
    this.content = this.element.querySelector(`.${this.options.contentClass}`);
    this.modal = this.element.querySelector(`.${this.options.modalClass}`);
    this.init();
  }

  private init = () => {
    if (this.content) {
      this.content.addEventListener("click", this.handleContentClick);
    }

    if (this.modal) {
      this.modal.addEventListener("click", this.handleModalClick);
    }

    this.element.classList.add(states.init);
  };

  public setPosition = () => {
    const { top, left } = this.calcElementPosition(
      this.content,
      this.modal,
      this.options.position,
    );

    this.modal.setAttribute("style", `top: ${top}px; left: ${left}px;`);
  };

  public open() {
    this.setPosition();

    document.addEventListener("click", this.handleDocumentClick);

    if (this.closeTransitionTimerId) {
      clearTimeout(this.closeTransitionTimerId);
    }

    setTimeout(() => {
      this.element.classList.add(states.active);
      this.isActive = true;
    });
  }

  public close() {
    document.removeEventListener("click", this.handleDocumentClick);

    this.element.classList.remove(states.active);
    this.isActive = false;

    this.closeTransitionTimerId = afterTransition(this.modal, () => {
      this.modal.removeAttribute("style");
    });
  }

  private handleModalClick = (e: Event) => {
    const target = e.target;

    console.log(target);

    if (target instanceof HTMLElement) {
      const item = target.closest(`.${this.options.itemClass}`);

      if (item) {
        this.close();
      }
    }
  };

  private handleContentClick = (e: Event) => {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  };

  private handleDocumentClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const dropdown = target.closest<DropdownElement>(`.js-dropdown`);
    const active = document.querySelector<DropdownElement>(
      `.js-dropdown.${states.active}`,
    );

    if (active && dropdown !== active) {
      active.dropdown.close();
    }

    if (
      !target.closest(`.${this.options.modalClass}`) &&
      !target.closest(`.${this.options.contentClass}`)
    ) {
      this.close();
    }
  };

  private calcElementPosition = (
    element: HTMLElement,
    target: HTMLElement,
    expectedPosition: DropdownPosition,
  ) => {
    let position: { top: number; left: number } = { top: 0, left: 0 };
    const coordsElement = element.getBoundingClientRect();
    const coordsTarget = target.getBoundingClientRect();

    switch (expectedPosition) {
      case "tl": {
        break;
      }
      case "tl": {
        break;
      }
      case "tr": {
        break;
      }
      case "b": {
        const middleDiffWidth = (coordsTarget.width - coordsElement.width) / 2;

        position = {
          left: -middleDiffWidth,
          top: coordsElement.height + this.options.offset,
        };

        break;
      }
      case "bl": {
        position = {
          left: 0,
          top: coordsElement.height + this.options.offset,
        };

        break;
      }
      case "br": {
        position = {
          left: coordsElement.width - coordsTarget.width,
          top: coordsElement.height + this.options.offset,
        };
        break;
      }
    }

    return position;
  };

  private defineOptions = (): IDropdownOptions => {
    const dataset = this.element.dataset;
    const userOptions: IDropdownOptions = {};

    for (let key in dataset) {
      if (key.startsWith("dropdown")) {
        let clearKey = key.replace("dropdown", "");
        clearKey = clearKey[0].toLowerCase() + clearKey.slice(1);

        (userOptions as any)[clearKey] = dataset[key];
      }
    }

    return {
      position: "bl",
      contentClass: "js-dropdown-title",
      modalClass: "js-dropdown-content",
      itemClass: "js-dropdown-item",
      offset: 10,
      ...userOptions,
    };
  };
}

export function initDropdowns() {
  const dropdowns = document.querySelectorAll<HTMLDivElement>(
    `.js-dropdown:not(.${states.init})`,
  );

  dropdowns.forEach((dropdown) => {
    new Dropdown(dropdown);
  });
}
