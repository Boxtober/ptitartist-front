import { api } from "../api/client";

export const login = (email: string, password: string) => {
  return api("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = (email: string, password: string) => {
  return api("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};