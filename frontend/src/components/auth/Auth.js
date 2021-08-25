export const setToken = (token) => localStorage.setItem("access-token", token);

export const removeToken = (history = null, because=0) => {
  localStorage.removeItem("access-token");
  if (history !== null) {
    if (because == 1)
      alert("세션이 만료되었습니다.");
    history.push("/login");
  }
};

export const getToken = () => localStorage.getItem("access-token");
