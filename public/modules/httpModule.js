(function () {
    'use strict';

    const baseUrl = 'http://space-invasion-backend.herokuapp.com/v1';

    class Http {

        static FetchGet(address) {
            const url = (Http.BaseUrl || baseUrl) + address;
            return fetch(url, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.status >= 400) {
                        throw response;
                    }

                    return response.json();
                });
        }

        static FetchPost(address, body) {
            const url = (Http.BaseUrl || baseUrl) + address;
            return fetch(url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(function (response) {
                    if (response.status >= 400) {
                        throw response;
                    }

                    return response.json();
                });
        }
    }

    Http.BaseUrl = null;

    window.Http = Http;

})();