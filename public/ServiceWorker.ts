function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/public/SW.js", {scope: "/public/"})
  }
}

export default registerServiceWorker;