function  registerServiceWorker(): void {
    console.log("Try register service worker");
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/services/SW.js", { scope: "/services/" })
            .then(function(reg) {
            if (reg.installing) {
                console.log("Service worker installing");
            } else if (reg.waiting) {
                console.log("Service worker installed");
            } else if (reg.active) {
                console.log("Service worker active");
            }
        }).catch((error) => {
            console.log("Registration failed with " + error);
        });
    }
}

export {registerServiceWorker};
