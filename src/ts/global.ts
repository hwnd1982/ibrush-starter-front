import LazyLoad from "vanilla-lazyload";
import { openCustomModal, openModalById, closeModalById } from "./ui/modal";
import { config } from "./utils/config";
import { initBase } from "./utils/init";
import {
  addPreloader,
  removePreloader,
  setPreloader,
  resetForm,
  resetFormById,
  store,
} from "./utils";
import {
  initValidateFormById,
  triggerValidateFormById,
  fullReInitFormById,
} from "./modules";
import { initTextFieldsByFormId } from "./ui/text-field";
import { initRadiosByFormId } from "./ui/radio";

if (!window.endpoints) {
  window.endpoints = {
    searchGlobalUrl: "/local/ajax/search.php",
    callbackUrl: window.assetsUrl
      ? "/local/ajax/callback.php"
      : config.BASE_API_URL + "/subscribe.json",
    subscribeUrl: window.assetsUrl
      ? "/local/ajax/subscribe.php"
      : config.BASE_API_URL + "/subscribe.json",
    feedbackUrl: "/local/ajax/webform.php",
    careerUrl: window.assetsUrl
      ? "/local/ajax/career.php"
      : config.BASE_API_URL + "/subscribe.json",
    verificationUrl: "/local/ajax/pbi_auth.php",
  };
}

document.addEventListener("DOMContentLoaded", initGlobal);

function initGlobal() {
  store.lazyload = new LazyLoad();
  window.lazyload = store.lazyload;
  window.store = store;

  document.addEventListener("modal-subscribe-success", (e) => {
    if (window.openCustomModal) {
      window.openCustomModal({
        title: "Спасибо за подписку!",
      });
    }

    const subscribeInput = document.querySelector(
      "[data-subscribe-btn]",
    ) as HTMLButtonElement;
    if (subscribeInput) subscribeInput.value = "";
  });

  initBase();

  window.openCustomModal = openCustomModal;
  window.openModalById = openModalById;
  window.closeModalById = closeModalById;
  window.initValidateFormById = initValidateFormById;
  window.triggerValidateFormById = triggerValidateFormById;
  window.initTextFieldsByFormId = initTextFieldsByFormId;
  window.initRadiosByFormId = initRadiosByFormId;
  window.fullReInitFormById = fullReInitFormById;
  window.setPreloader = setPreloader;
  window.addPreloader = addPreloader;
  window.removePreloader = removePreloader;
  window.resetForm = resetForm;
  window.resetFormById = resetFormById;
}
