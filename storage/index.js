export const setStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}

export const getStorage = (key) => {
  const data = localStorage.getItem(key);
  return JSON.parse(data);
}