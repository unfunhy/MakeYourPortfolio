export const setToken = (token) => localStorage.setItem("access-token", token);

export const removeToken = (setUser, history = null, because=0) => {
  localStorage.removeItem("access-token");
  setUser({id: 0, name:""});
  if (history !== null) {
    if (because === 1) {
      alert("세션이 만료되었습니다.");
      because = 0;
    }
    history.push("/login");
  }
};

export const getToken = () => localStorage.getItem("access-token");
