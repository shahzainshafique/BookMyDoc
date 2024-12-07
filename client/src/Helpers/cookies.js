export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const setCookie = (name, value, expiresInSeconds) => {
  const date = new Date();
  date.setTime(date.getTime() + expiresInSeconds);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure";
};

export const deleteCookie = (name) => {
  console.log('delete', name);
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure";
};
