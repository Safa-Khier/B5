import { atom } from "recoil";

export const cryptoData = atom({
  key: "cryptoData",
  default: {
    data: [],
    filterdData: [],
  },
});
