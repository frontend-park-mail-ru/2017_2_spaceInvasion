import { showError } from "../utils/htmlUtils";
import { baseUrl } from "../utils/constants";

class Http {
  static BaseUrl : string = baseUrl;

  static Fetch(method : string, path : string, body : any = undefined): Promise<Response|null> {
    const url = (Http.BaseUrl || baseUrl) + path;
    return fetch(url, {
      method,
      mode: 'cors',
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).catch(() => {
      showError('Network is unreachable. Check your internet connection');
      return null;
    }).then((r : Response) => {
      if (r && r.status >= 500) {
        throw Error('Internal Server Error');
      }
      return r;
    }).catch((e : Error) => {
      showError(e.message);
      return null;
    });
  }
}

export default Http;
