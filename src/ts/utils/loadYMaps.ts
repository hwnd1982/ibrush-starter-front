import { states } from "./states";

export const loadYMaps = (
  src: string,
  async: boolean = false,
  id: string,
  callback?: () => void,
): Promise<typeof ymaps3> => {
  const script =
    document.querySelector<HTMLScriptElement>(`#${id}`) ||
    document.createElement("script");

  if (!script.id) {
    script.src = src;
    script.async = async;
    script.id = id;
    document.body.append(script);
  }

  return new Promise((resolve) => {
    const initMap = () => {
      ymaps3.ready.then(() => {
        document.dispatchEvent(new CustomEvent(`script.load.${id}`));
        callback?.();
        resolve(ymaps3);
      });
    };

    if (script.classList.contains(states.init)) {
      resolve(ymaps3);
    }

    script.classList.add(states.init);
    script.addEventListener("load", initMap);
  });
};
