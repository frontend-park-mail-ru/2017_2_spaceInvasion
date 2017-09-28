(function () {
    'use strict';

    const baseUrl = 'http://space-invasion-backend.herokuapp.com/v1';

    class Http {

        static Get(address, callback) {
            const url = (Http.BaseUrl || baseUrl) + address;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.withCredentials = true;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (+xhr.status >= 400) {
                    return callback(xhr, null);
                }

                const response = JSON.parse(xhr.responseText);
                callback(null, response);
            };

            xhr.send();
        }

        static Post(address, body, callback) {
            const url = (Http.BaseUrl || baseUrl) + address;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (+xhr.status >= 400) {
                    return callback(xhr, null);
                }

                const response = JSON.parse(xhr.responseText);
                callback(null, response);
            };

            xhr.send(JSON.stringify(body));
        }

        static PromiseGet(address) {
            return new Promise(function (resolve, reject) {
                const url = (Http.BaseUrl || baseUrl) + address;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.withCredentials = true;

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;
                    if (+xhr.status >= 400) {
                        reject(xhr);
                        return;
                    }

                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                };

                xhr.send();
            });
        }

        static PromisePost(address, body) {
            return new Promise(function (resolve, reject) {
                const url = (Http.BaseUrl || baseUrl) + address;
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.withCredentials = true;
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;
                    if (+xhr.status >= 400) {
                        reject(xhr);
                        return;
                    }

                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                };

                xhr.send(JSON.stringify(body));
            });
        }

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