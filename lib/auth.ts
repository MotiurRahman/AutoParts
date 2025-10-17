const TOKEN_KEY = "ap_token";

export const getToken = () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const isAuthed = () => !!getToken();

// in auth.ts
export const notifyAuthChange = () =>
    window.dispatchEvent(new Event("auth-change"));
export const setToken = (t: string) => {
    localStorage.setItem("ap_token", t);
    notifyAuthChange();
};
export const clearToken = () => {
    localStorage.removeItem("ap_token");
    notifyAuthChange();
};
