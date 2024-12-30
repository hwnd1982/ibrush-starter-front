import { states } from "../../utils";
import Cleave from "cleave.js";
import { CustomSelect } from "../";

export type TextFieldElement = HTMLElement & { textField?: TextField };

export type TextFieldValidate =
  | "phone"
  | "required"
  | "email"
  | "name"
  | "message"
  | "select"
  | "cv";

export interface TextFieldValidateResult {
  isValid: boolean;
  error: TextFieldValidate | null;
}

export type TextFieldInput = HTMLInputElement & {
  cleave?: Cleave;
};

export class TextField {
  el: TextFieldElement;
  field: TextFieldInput;
  validate: TextFieldValidate[];

  constructor(element: HTMLElement) {
    this.el = element;

    this.init();
  }

  private init = () => {
    this.field = this.el.querySelector<HTMLInputElement>(
      ".js-text-field-input",
    );

    this.defineValidate();
    this.initValidate();

    this.el.classList.add(states.init);
    this.el.textField = this;
  };

  public defineValidate = () => {
    const validateString = this.field.getAttribute("data-validate");

    if (!validateString) {
      this.validate = [];

      return;
    }

    const validateArray = validateString
      .replace(/\s/g, "")
      .split(",") as TextFieldValidate[];

    this.validate = validateArray;
  };

  public initValidate = () => {
    this.validate.forEach((setting) => {
      switch (setting) {
        case "phone": {
          this.field.addEventListener("input", (e) => {
            const target = e.target as TextFieldInput;
            const rawValue = target.value.replace(/\D/g, "");
            const lastValue = (target.cleave as any).lastInputValue.replace(
              /\D/g,
              "",
            );

            if (rawValue.length === 0) {
              this.field.cleave?.setRawValue("+7");
            } else if (rawValue.length <= 10) {
              this.field.cleave?.setRawValue("+7" + rawValue);
            } else if (rawValue.length === 11) {
              if (["7", "8"].includes(rawValue[0])) {
                this.field.cleave?.setRawValue("+7" + rawValue.slice(1));
              }
            } else if (rawValue.length === 12) {
              if (["7", "8"].includes(rawValue[1]) && lastValue.length < 10) {
                this.field.cleave?.setRawValue("+7" + rawValue.slice(2));
              }
            }
          });

          this.field.cleave = new Cleave(this.field, {
            blocks: [2, 0, 3, 3, 2, 2],
            delimiters: [" ", "(", ") ", " ", " "],
            delimiterLazyShow: true,
            numericOnly: true,
            noImmediatePrefix: true,
            prefix: "+7",
          });

          break;
        }
        case "select": {
          new CustomSelect(this.el);
          break;
        }
        case "cv": {
          const fileName = this.el.querySelector<HTMLElement>(
            ".js-text-field-file-name",
          );

          this.el.addEventListener("click", () => {
            this.el.classList.add(states.target);
          });

          this.el.addEventListener("change", (e: Event) => {
            const target = e.target;

            if (target instanceof HTMLInputElement) {
              const [file] = target.files;

              setTimeout(() => this.el.classList.remove(states.target), 50);
              if (file && /.pdf$/.test(file.name)) {
                return (fileName.textContent = file.name);
              }

              fileName.textContent = "";
              target.value = "";
            }
          });
          break;
        }
      }
    });
  };

  public setDisabled = () => {
    this.el.classList.add(states.disabled);
    this.field.setAttribute("disabled", "");
  };

  public removeDisabled = () => {
    this.el.classList.remove(states.disabled);
    this.field.removeAttribute("disabled");
  };

  public checkValid = (): TextFieldValidateResult => {
    const validation: TextFieldValidateResult = {
      isValid: true,
      error: null,
    };

    if (this.validate.includes("required")) {
      if (this.validate.find((v) => v === "phone")) {
        if (
          this.field.cleave?.getRawValue() === "+7" ||
          this.field.cleave?.getRawValue() === ""
        ) {
          validation.isValid = false;
          validation.error = "required";
        }
      } else {
        if (!this.field.value.trim().length) {
          validation.isValid = false;
          validation.error = "required";
        }
      }
    }

    if (validation.isValid) {
      for (let setting of this.validate.filter((v) => v !== "required")) {
        switch (setting) {
          case "phone": {
            if (
              this.field.cleave?.getRawValue().trim() !== "+7" &&
              this.field.cleave?.getRawValue().length !== 12
            ) {
              validation.isValid = false;
              validation.error = "phone";
            }

            break;
          }
          case "email": {
            if (
              this.field.value &&
              !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(
                this.field.value,
              )
            ) {
              validation.isValid = false;
              validation.error = "email";
            }

            break;
          }
          case "name": {
            if (
              this.field.value &&
              !/^[а-яА-Яa-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
                this.field.value,
              )
            ) {
              validation.isValid = false;
              validation.error = "name";
            }

            break;
          }
        }
      }
    }

    return validation;
  };
}

export function initTextFields() {
  const textFields = document.querySelectorAll<HTMLElement>(
    `.js-text-field:not(.${states.init})`,
  );

  textFields.forEach((textField) => {
    new TextField(textField);
  });
}

export function initTextFieldsByFormId(id: string, hard: boolean = false) {
  const textFields = document.querySelectorAll<HTMLElement>(
    `#${id}.js-form .js-text-field${!hard ? `:not(.${states.init})` : ""}`,
  );

  textFields.forEach((textField) => {
    new TextField(textField);
  });
}
