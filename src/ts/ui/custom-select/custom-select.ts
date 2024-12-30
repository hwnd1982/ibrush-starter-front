import { states } from "../../utils";
import { TextFieldElement } from "../text-field";

export type CustomSelectElement = TextFieldElement & {
  customSelect?: CustomSelect;
};

export type CustomSelectOptionElement = HTMLElement & {
  dataset: {
    value: string;
    text: string;
  };
};

export class CustomSelect {
  el: CustomSelectElement;
  title: HTMLInputElement;

  constructor(el: CustomSelectElement) {
    this.el = el;
    this.el.customSelect = this;
    this.title = this.el.querySelector<HTMLInputElement>(
      ".js-custom-select-title",
    );

    this.init();
  }

  init = () => {
    this.el.addEventListener("click", this.handleClick);
  };

  open = () => {
    this.el.classList.add(states.open);
    document.addEventListener("click", this.handleDocumentClick);
  };

  close = () => {
    this.el.classList.remove(states.open);
    document.removeEventListener("click", this.handleDocumentClick);
  };

  handleClick = ({ target }: Event) => {
    if (target instanceof HTMLElement) {
      const trigger = target.closest<HTMLElement>(".js-custom-select-title");
      const option = target.closest<CustomSelectOptionElement>(
        ".js-custom-select-option",
      );

      if (trigger) {
        if (this.el.classList.contains(states.open)) {
          this.close();
        } else {
          this.open();
        }
      }

      if (option) {
        const [selectOption] =
          this.el.querySelectorAll<CustomSelectOptionElement>(
            `.${states.select}`,
          );

        this.title.focus();
        this.el.textField.field.value = option.dataset.value;
        this.title.value = option.dataset.text;
        option.classList.add(states.select);
        this.close();

        if (selectOption) {
          selectOption.classList.remove(states.select);
        }
      }
    }
  };

  handleDocumentClick = ({ target }: Event) => {
    if (target instanceof HTMLElement) {
      const select = target.closest<HTMLElement>(".js-custom-select");

      if (select && select === this.el) return;

      this.close();
    }
  };
}
