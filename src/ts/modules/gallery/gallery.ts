import Swiper from "swiper";
import {
  EffectFade,
  FreeMode,
  Thumbs,
  Manipulation,
  Navigation,
} from "swiper/modules";
import { Modal, ModalElement } from "../../ui/modal";

class Gallery {
  element: ModalElement | null;
  modal: Modal | null;
  thumbs: Swiper;
  slider: Swiper;

  constructor() {
    this.element = document.querySelector<ModalElement>(
      '.js-modal[data-modal-id="gallery"]',
    );

    if (!this.element) return this;

    this.init();
  }

  static renderSlide = (scr: string) => {
    return `<div class="swiper-slide gallery-silde">
<img data-src="${scr}" alt="" class="gallery-silde-background lazy">
  <div class="gallery-silde-inner">
    <img data-src="${scr}" alt="" class="gallery-silde-img lazy">
  </div>
</div>`;
  };

  static renderThumb = (scr: string) => {
    return `<div class="swiper-slide gallery-thumb">
    <img data-src="${scr}" class="gallery-thumb-img lazy" alt="">
  </div>`;
  };

  private init = () => {
    if (!this.element) return;

    const mainSliderEl =
      this.element.querySelector<ModalElement>(".js-gallery-slider");
    const thumbsSliderEl =
      this.element.querySelector<ModalElement>(".js-gallery-thumbs");

    this.modal = this.element?.modal || null;

    this.thumbs = new Swiper(thumbsSliderEl, {
      freeMode: true,
      slidesPerView: "auto",
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      modules: [FreeMode, Manipulation],
    });

    this.slider = new Swiper(mainSliderEl, {
      modules: [Thumbs, EffectFade, Manipulation, Navigation],
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: ".js-slider-navigation-next",
        prevEl: ".js-slider-navigation-prev",
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      thumbs: { swiper: this.thumbs },
    });
  };

  open = (triggerIndex: number = 0) => {
    this.slider.slideTo(triggerIndex, 0);
    this.thumbs.slideTo(triggerIndex, 0);
    this.modal?.open();
  };

  replaceSlides = ({
    thumbs,
    slider,
  }: {
    thumbs: string[];
    slider: string[];
  }) => {
    this.slider.removeAllSlides();
    this.thumbs.removeAllSlides();

    this.slider.appendSlide(slider);
    this.thumbs.appendSlide(thumbs);

    window.lazyload.update();
  };
}

export type GalleryProps = {
  parentSelector?: string;
  triggerSelector: string;
  mutableSelector?: string;
};

export function initGallery(props: GalleryProps | GalleryProps[]) {
  let activeGaleryIndex: string | null = null;
  const gallery = new Gallery();
  const config = {
    childList: true,
    subtree: true,
  };

  if (!Array.isArray(props)) props = [props];

  props.forEach(
    ({ parentSelector, triggerSelector, mutableSelector }, galleryIndex) => {
      if (mutableSelector) {
        const reviewsList = document.querySelector(mutableSelector);
        if (!reviewsList) return;
        const observer = new MutationObserver(
          (mutationsList: MutationRecord[]) => {
            console.log(mutationsList);
            if (mutableSelector === parentSelector) {
              initTriggers(
                document.querySelector(parentSelector),
                triggerSelector,
                "",
              );
            } else {
              for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                  const items = [...mutation.addedNodes].filter(
                    (item) => item.nodeType === 1,
                  );

                  items.forEach((review) =>
                    initTriggers(review as HTMLElement, triggerSelector, ""),
                  );
                }
              }
            }
          },
        );

        observer.observe(reviewsList, config);
      }
      document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) {
          gallery.slider.slidePrev();
          //Left arrow pressed
        }
        if (e.keyCode == 39) {
          gallery.slider.slideNext();
          //Right arrow pressed
        }
      });
      const containers = parentSelector
        ? document.querySelectorAll<HTMLElement>(parentSelector)
        : [document.body];

      containers.forEach((container, index) =>
        initTriggers(container, triggerSelector, `id-${galleryIndex}-${index}`),
      );
    },
  );

  function initTriggers(
    container: HTMLElement,
    selector: string,
    galleryId: string,
  ) {
    const triggers = [
      ...(container.querySelectorAll<HTMLElement>(selector) || []),
    ];

    const sliderSrc =
      triggers.map((trigger) => {
        return trigger.classList.contains("lazy")
          ? trigger.dataset["big"] || trigger.getAttribute("data-src") || ""
          : trigger.dataset["big"] || trigger.getAttribute("src") || "";
      }) || [];

    const thumbsSrc =
      triggers.map((trigger) =>
        trigger.classList.contains("lazy")
          ? trigger.dataset["small"] || trigger.getAttribute("data-src") || ""
          : trigger.dataset["small"] || trigger.getAttribute("src") || "",
      ) || [];
    const slider = sliderSrc.map((src) => Gallery.renderSlide(src));
    const thumbs = thumbsSrc.map((src) => Gallery.renderThumb(src));

    triggers.forEach((trigger, triggerIndex) => {
      trigger.addEventListener("click", () => {
        if (!galleryId || activeGaleryIndex !== galleryId) {
          activeGaleryIndex = galleryId;
          gallery.replaceSlides({ slider, thumbs });
        }

        gallery.open(triggerIndex);
      });
    });
  }
}
