import { atom } from "recoil";

export const webSettings = atom({
  key: "webSettings",
  default: {
    theme: "light",
    selectedTab: "coins",
  },
});
