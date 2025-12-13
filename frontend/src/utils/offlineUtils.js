export const isOnline = () => navigator.onLine;

export const onOffline = (callback) => {
  window.addEventListener("offline", callback);
};

export const onOnline = (callback) => {
  window.addEventListener("online", callback);
};
