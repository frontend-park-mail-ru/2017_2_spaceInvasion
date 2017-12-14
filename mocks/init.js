let store = {};
const sessionStorageMock = {
  getItem: key => store[key],
  setItem: (key, value) => {
    store[key] = value.toString();
  },
  clear: () => {
    store = {};
  },
  removeItem: (key) => {
    delete store[key];
  },
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// require('../public/main.ts');
