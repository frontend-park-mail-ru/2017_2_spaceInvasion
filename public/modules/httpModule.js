(function httpModule() {
    const baseUrl = 'http://space-invasion-backend.herokuapp.com/v1';

    class Http {
        static Fetch(method, path, body = undefined) {
            const url = (Http.BaseUrl || baseUrl) + path;
            return fetch(url, {
                method,
                mode: 'cors',
                credentials: 'include',
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
        }
    }

    Http.BaseUrl = null;

    window.Http = Http;
}());