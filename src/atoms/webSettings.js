import { atom } from "recoil";
import Usa from "../assets/icons/usa.png";

export const webSettings = atom({
  key: "webSettings",
  default: {
    theme: "light",
    selectedTab: "coins",
  },
});
