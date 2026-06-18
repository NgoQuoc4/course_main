import { STORAGE } from "@/constants/storage";
import Cookies from "js-cookie";

// Cookie Token (AccessToken only)
export const cookieToken = {
  get: () => Cookies.get(STORAGE.token) || null,
  set: (token) => Cookies.set(STORAGE.token, token, { secure: true, sameSite: "strict" }),
  remove: () => Cookies.remove(STORAGE.token),
};

const tokenMethod = {
  get: () => {
    return cookieToken.get();
  },
  set: (token) => {
    return cookieToken.set(token);
  },
  remove: () => {
    return cookieToken.remove();
  },
};

export default tokenMethod;
