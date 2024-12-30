import { initGallery } from "./modules";

document.addEventListener("DOMContentLoaded", initMainPage);

function initMainPage() {
  initGallery({ triggerSelector: ".js-gallery-slide" });
}
