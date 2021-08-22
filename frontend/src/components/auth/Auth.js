import { useHistory } from "react-router-dom";

export const setToken = (token) => localStorage.setItem("access-token", token);

export const removeToken = () => localStorage.removeItem("access-token");

export const getToken = () => localStorage.getItem("access-token");