import { states } from "../../utils";

const cookieMessage = (): void => {
  const COOKIE_KEY = "isConfirmCookie";

  const cookieMessage =
    document.querySelector<HTMLDivElement>(".js-cookie-message");
  const cookieSuccess = document.querySelector<HTMLDivElement>(
    ".js-cookie-message-success",
  );

  if (!cookieMessage || !cookieSuccess) return;

  let isConfirmCookie: boolean = false;

  try {
    isConfirmCookie = Boolean(localStorage.getItem(COOKIE_KEY));
  } catch (error) {
    console.error("Error getting localStorage:", error);
  }

  if (!isConfirmCookie) {
    cookieMessage.classList.add(states.show);
  }

  cookieSuccess.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "true");
    cookieMessage.classList.remove("_show");
  });
};

export default function initCookiesMessage() {
  cookieMessage();
}
