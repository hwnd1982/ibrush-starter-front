import type { ILazyLoadInstance } from "vanilla-lazyload";
import type { OpenCustomModalProps } from "../ui/modal";
import { Scrollbar, IStore } from "../utils";

export interface IWindowEndpoints {
  searchGlobalUrl: string;
  subscribeUrl: string;
  feedbackUrl: string;
  callbackUrl: string;
  careerUrl: string;
  verificationUrl: string;
}

declare global {
  interface Window {
    scrollbar: Scrollbar;
    yandexMapDidInit?: boolean;
    initExclusivesSlider?: () => void;
    setExclusivesCartCounts: (container?: HTMLElement) => void;
    openCustomModal?: (props: OpenCustomModalProps) => void;
    openModalById?: (id: string) => void;
    closeModalById?: (id: string) => void;
    initValidateFormById?: (id: string, hard?: boolean) => void;
    triggerValidateFormById?: (id: string) => void;
    initTextFieldsByFormId?: (id: string, hard?: boolean) => void;
    initRadiosByFormId?: (id: string, hard?: boolean) => void;
    fullReInitFormById?: (id: string, hard?: boolean) => void;
    setFavoriteProducts?: () => void;
    setPreloader?: (value: boolean) => void;
    addPreloader?: () => void;
    removePreloader?: () => void;
    resetForm?: (form: HTMLFormElement) => void;
    resetFormById?: (id: string) => void;
    assetsUrl?: string;
    endpoints: IWindowEndpoints;
    lazyload: ILazyLoadInstance;
    store: IStore;
  }
}
