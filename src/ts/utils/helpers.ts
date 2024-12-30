export function setPreloader(value: boolean) {
  if (value) addPreloader();
  else removePreloader();
}

export function addPreloader(container: HTMLElement = document.body) {
  const className =
    container === document.body ? "preloader-fixed" : "preloader";
  const preloader = container.querySelector(".js-preloader");

  if (!preloader) {
    container.insertAdjacentHTML(
      className === "preloader-fixed" ? "beforeend" : "afterbegin",
      className === "preloader-fixed"
        ? `<div class="${className} js-preloader"><div class="preloader-fixed-square"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`
        : `<span class="${className} js-preloader"><svg viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 11.4477 3.55228 11 3 11C2.44772 11 2 11.4477 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4Z" fill="currentColor"/></svg></span>`,
    );

    if (className !== "preloader-fixed") {
      container.style.position = "relative";
    }
  }
}

export function removePreloader(container: HTMLElement = document.body) {
  const preloader = container.querySelector<HTMLElement>("& > .js-preloader");

  if (!preloader.classList.contains(".preloader-fixed")) {
    container.style.position = "";
  }

  preloader?.remove();
}

export function resetForm(form: HTMLFormElement) {
  if (!form) return;

  const submitBtn = form.querySelector(".js-form-submit");

  submitBtn && submitBtn.setAttribute("disabled", "");
  form.reset();
}

export function resetFormById(id: string) {
  resetForm(document.getElementById(id) as HTMLFormElement);
}

export function initClickSmoothScroll() {
  document.addEventListener("click", async (e) => {
    const link = (e.target as HTMLElement).closest(".js-smooth-scroll");

    if (!link) return;

    e.preventDefault();

    const el = document.querySelector<HTMLElement>(link.getAttribute("href"));

    if (el) {
      smoothScrollToElement(el, true);
    }
  });
}

function smoothScrollToElement(element: HTMLElement, repeat: boolean) {
  let offset = 0;

  const header = document.querySelector<HTMLElement>(".js-header");

  if (header) {
    offset = header.offsetHeight;
  }

  // @ts-ignore
  window.lazyload.loadAll();

  window.scrollBy({
    top: element.getBoundingClientRect().top - 25 - offset,
    behavior: "smooth",
  });

  //костыли из-за lazy картинок на случай, если не загрузились сразу
  if (repeat) {
    if ("onscrollend" in window) {
      document.addEventListener(
        "scrollend",
        (e) => {
          smoothScrollToElement(element, false);
        },
        { once: true },
      );
    }
  }
}
