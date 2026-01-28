export const loginFake = (user: string, pass: string) => {
  if (user === "admin" && pass === "123456") {
    localStorage.setItem("auth", "true");
    return true;
  }
  return false;
};

export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export const logout = () => {
  localStorage.removeItem("auth");
};
