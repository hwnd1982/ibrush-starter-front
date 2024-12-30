import { getTransitionDuration, states, store } from "../../utils";

export type ModalElement = HTMLDivElement & { modal?: Modal };
export type ModalEvent = CustomEvent & { trigger?: Modal };

export class Modal {
  element: ModalElement;
  window: HTMLElement;
  id: string;
  isActive: boolean;

  constructor(element: HTMLDivElement) {
    if (element.classList.contains(states.init)) return;

    this.element = element;

    this.init();
  }

  private init = () => {
    this.id = this.element.getAttribute("data-modal-id");
    this.window = this.element.querySelector(".js-modal-window");

    this.initTriggers();

    this.element.addEventListener("click", this.handleModalClick);

    if (this.element.classList.contains(states.active)) {
      this.open();
    }

    this.element.modal = this;
    this.element.classList.add(states.init);
  };

  public initTriggers = () => {
    const triggers = document.querySelectorAll<HTMLElement>(
      `[data-modal-id="${this.id}"].js-modal-trigger:not(.${states.init})`,
    );

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleTriggerClick);
    });
  };

  public open = (
    props: { onAfterTransition?: () => void; target?: Element | null } = {},
  ) => {
    const { onAfterTransition = undefined } = props;

    this.element.dispatchEvent(
      new CustomEvent("beforeOpen", { detail: { trigger: props.target } }),
    );

    document.addEventListener("keydown", this.handleDocumentKeyDown);

    this.element.setAttribute("aria-hidden", "false");
    this.element.classList.add(states.active);
    this.isActive = true;

    if (onAfterTransition) {
      setTimeout(() => {
        onAfterTransition();
      }, getTransitionDuration(this.element));
    }

    this.element.dispatchEvent(
      new CustomEvent("open", { detail: { trigger: props.target } }),
    );
  };

  public close = (props: { onAfterTransition?: () => void } = {}) => {
    const { onAfterTransition = undefined } = props;

    document.removeEventListener("keydown", this.handleDocumentKeyDown);

    this.element.setAttribute("aria-hidden", "true");
    this.element.classList.remove(states.active);
    this.isActive = false;

    if (onAfterTransition) {
      setTimeout(() => {
        onAfterTransition();
      }, getTransitionDuration(this.element));
    }

    setTimeout(() => {
      this.element.dispatchEvent(new CustomEvent("close"));
    }, getTransitionDuration(this.element));
  };

  private handleTriggerClick = (e: Event) => {
    const target = (e.target as HTMLElement).closest(".js-modal-trigger");

    e.preventDefault();

    if (this.isActive) {
      this.close();
    } else {
      this.open({ target });
    }
  };

  private handleModalClick = (e: Event) => {
    const target = e.target as HTMLElement;

    if (
      target.closest(".js-modal-window") &&
      !target.closest(".js-modal-close")
    )
      return;

    e.preventDefault();

    this.close();
  };

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };
}

export const initModals = () => {
  let stack: Modal[] = [];

  const modals = document.querySelectorAll<HTMLDivElement>(
    `.js-modal:not(.${states.init})`,
  );

  modals.forEach((modal) => {
    const modalInstance = new Modal(modal);

    modalInstance.element.addEventListener("open", () => {
      stack.push(modalInstance);

      if (stack.length > 0) {
        window.store.scrollbar?.hide();
      }
    });
    modalInstance.element.addEventListener("close", () => {
      stack = stack.filter((instance) => instance.id !== modalInstance.id);

      if (stack.length === 0) {
        window.store.scrollbar?.show();
      }
    });
  });
};

export type OpenCustomModalProps = {
  title?: string;
  description?: string;
  button?: string;
  html?: string;
};

export function openCustomModal(props: OpenCustomModalProps) {
  const { title, description, button, html } = props;

  const customModal = document.querySelector<ModalElement>(
    `[data-modal-id="custom-modal"].js-modal`,
  );

  console.log(customModal.modal);
  if (!customModal) return;

  const contentCustomModal = customModal.querySelector<HTMLElement>(
    ".js-custom-modal-content",
  );

  console.log(contentCustomModal);
  if (!contentCustomModal) return;

  if (html) {
    contentCustomModal.innerHTML = html;
  } else {
    contentCustomModal.innerHTML = `
      ${title ? `<h2 class="modal__header">${title}</h2>` : ""}
      ${description ? `<p class="modal__description">${description}</p>` : ""}
      ${
        button
          ? `
        <button class="button button-size--m button-type--primary modal__button js-modal-close">
          <span>${button}</span>
        </button>
      `
          : ""
      }
    `;
  }

  console.log(title, customModal.modal);

  customModal.modal.open();
}

export function openModalById(id: string) {
  if (!id) return;

  const modal = document.querySelector<ModalElement>(
    `[data-modal-id=${id}].js-modal`,
  );

  if (!modal) return;

  modal.modal.open();
}

export function closeModalById(id: string) {
  if (!id) return;

  const modal = document.querySelector<ModalElement>(
    `[data-modal-id=${id}].js-modal`,
  );

  if (!modal) return;

  modal.modal.close();
}
