import { atom } from "recoil";

export const userData = atom({
  key: "userData",
  default: {
    uid: "",
    email: "",
    phone: "",
    displayName: "",
    photoURL: "",
    createdAt: "",
    wallet: {
      transactions: [],
      currencies: [],
    },
  },
});
