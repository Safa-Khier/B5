import { atom } from "recoil";

export const cryptoNews = atom({
  key: "cryptoNews",
  default: {
    data: [],
    filterdData: [],
    updatedTime: null,
  },
});
