export function copyTextToClipboard(
  text: string,
  successCallback?: () => void,
  unsuccessCallback?: () => void,
) {
  const textArea = document.createElement("textarea") as HTMLTextAreaElement;

  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";

  textArea.style.width = "2em";
  textArea.style.height = "2em";

  textArea.style.padding = "0";

  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";

  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");

    if (successful) {
      successCallback?.();
    } else {
      unsuccessCallback?.();
    }
  } catch (err) {
    unsuccessCallback?.();
  }

  document.body.removeChild(textArea);
}
