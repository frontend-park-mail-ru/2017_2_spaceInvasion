(function httpModule() {
  const baseUrl = 'http://space-invasion-backend.herokuapp.com/v1';

  class Http {
    static Fetch(method = 'GET', address, body = {}) {
      const url = (Http.BaseUrl || baseUrl) + address;
      return fetch(url, {
        method,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
        .then((response) => {
          if (response.status >= 400) {
            throw response;
          }

          return response.json();
        });
    }
  }

  Http.BaseUrl = null;

  window.Http = Http;
}());
