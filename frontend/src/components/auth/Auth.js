export const set_token = (token) => localStorage.setItem("access-token", token);

export const remove_token = () => localStorage.removeItem("access-token");

export const get_token = () => localStorage.getItem("access-token");
