const AUTH_KEY = "auth_token";

export const loginFake = (user: string, pass: string): boolean => {
  if (user === "admin" && pass === "123456") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === "true";
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/";
};
