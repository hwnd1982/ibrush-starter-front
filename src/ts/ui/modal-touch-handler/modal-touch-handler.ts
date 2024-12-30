export type TouchHandlerElement = HTMLElement & {
  touchHandler?: TouchHandler;
};

export class TouchHandler {
  start: number = 0;
  el: TouchHandlerElement;
  modal: HTMLElement;
  timerId: ReturnType<typeof setTimeout>;
  callback: () => void;

  constructor(el: TouchHandlerElement) {
    this.el = el;
    this.el.touchHandler = this;
    this.modal = el.parentElement;
    this.init();
  }

  init() {
    this.el.addEventListener(
      "touchstart",
      (e) => (this.start = e.changedTouches[0].clientY),
      false,
    );

    this.el.addEventListener(
      "touchmove",
      (e) => {
        let deltaY = e.changedTouches[0].clientY - this.start;
        const { height } = this.modal.getBoundingClientRect();

        deltaY < 0 && (deltaY = 0);
        deltaY >= height - 10 && (deltaY = height);

        this.modal.style.cssText = `transform: translate(-50%, ${deltaY}px);`;

        clearTimeout(this.timerId);
        if (deltaY < height * 0.3) {
          this.timerId = setTimeout(
            () =>
              (this.modal.animate(
                [
                  { transform: `translate(-50%, ${deltaY}px)` },
                  { transform: "translate(-50%, 0%)" },
                ],
                { duration: 300 },
              ).onfinish = () => (this.modal.style.cssText = "")),
            300,
          );

          return;
        }

        this.modal.animate(
          [
            { transform: `translate(-50%, ${deltaY}px)` },
            { transform: "translate(-50%, 100%)" },
          ],
          { duration: 300 },
        ).onfinish = () => {
          this.modal.style.cssText = "";

          if (this.callback) {
            return this.callback();
          }
        };
      },
      false,
    );
  }

  set onswipe(callback: () => void) {
    if (!callback) return;

    this.callback = callback;
  }
}
