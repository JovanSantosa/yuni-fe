import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("auth_token", token, { expires: 7, path: "/" });
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

export const removeToken = () => {
  Cookies.remove("auth_token", { path: "/" });
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

export const getToken = () => {
  const cookieToken = Cookies.get("auth_token");
  if (cookieToken) return cookieToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return undefined;
};
