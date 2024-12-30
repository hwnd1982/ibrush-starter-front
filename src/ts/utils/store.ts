import { Scrollbar } from "./scrollbar";
import type { ILazyLoadInstance } from "vanilla-lazyload";
import PerfectScrollbar from "perfect-scrollbar";

export interface IStore {
  scrollbar?: Scrollbar;
  lazyload?: ILazyLoadInstance;
  customScrollbars: PerfectScrollbar[];
  scrollDirection: "down" | "up";
}

export const store: IStore = {
  customScrollbars: [],
  scrollDirection: "down"
};
