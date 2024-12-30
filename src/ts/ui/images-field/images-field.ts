import { getBase64, states } from "../../utils";

export type ImageFile = File & { imageEl?: HTMLElement };
export type ImagesFieldElement = HTMLElement & { imageField?: ImagesField };

export class ImagesField {
  el: ImagesFieldElement;
  field: HTMLInputElement | null;
  previewListEl: HTMLInputElement | null;
  files: ImageFile[];

  constructor(element: HTMLElement) {
    this.el = element;

    if (!this.el) return this;

    this.init();
  }

  get value() {
    return this.files.map((file) => file.imageEl?.getAttribute("src") || "");
  }

  private init = () => {
    this.field = this.el.querySelector<HTMLInputElement>(
      ".js-images-field-input",
    );
    this.previewListEl =
      this.el.querySelector<HTMLInputElement>(".js-images-items");

    if (this.field) {
      this.files = [];
      this.field.addEventListener("change", ({ target }) =>
        this.addFiles([...((target as HTMLInputElement).files || [])]),
      );

      this.el.classList.add(states.init);
      this.el.imageField = this;
    }

    if (this.previewListEl) {
      this.previewListEl.addEventListener("click", (e) => {
        const { target } = e;
        const remove = (target as HTMLElement).closest<HTMLElement>(
          ".js-image-remove",
        );

        e.stopPropagation();

        if (remove && remove.dataset["name"]) {
          const index = this.files.findIndex(
            (file) => file.name === remove.dataset["name"],
          );

          this.files[index].imageEl?.remove();
          this.files.splice(index, 1);

          this.field.dispatchEvent(new Event("input"));

          if (!this.files.length) {
            this.el.classList.add("is-empty");
          }
        }
      });
    }
  };

  addFiles = (files: File[]) => {
    files.forEach((file) => {
      if (
        /\.(jpg|jpeg|png)$/.test(file.name) &&
        !this.files.find(({ name }) => file.name === name)
      ) {
        getBase64(file, (data) => {
          if (this.previewListEl) {
            this.previewListEl.append(this.renderPreview(file, data));
          }

          if (this.files.length) {
            this.el.classList.remove("is-empty");
          }
        });
      }
    });
  };

  renderPreview = (file: File, data: string) => {
    const el = document.createElement("div");

    el.classList.add("images-field__item");
    el.innerHTML = `<button type="button" class="group button button-size--xxs button-type--primary button--icon images-field__item-remove js-image-remove" data-name="${file.name}">
  <svg width="20" height="20" class="icon">
    <use href="${window.assetsUrl || "/"}img/sprite/sprite.svg#close"></use>
  </svg>
</button>
<img class="images-field__item-img lazy" src="${data}" alt="${file.name}">`;

    (file as ImageFile)["imageEl"] = el;
    this.files.push(file);

    return el;
  };
}

export function initImagesFields() {
  const imagesFields = document.querySelectorAll<HTMLElement>(
    `.js-images-field:not(.${states.init})`,
  );

  imagesFields.forEach((imagesField) => {
    new ImagesField(imagesField);
  });
}
