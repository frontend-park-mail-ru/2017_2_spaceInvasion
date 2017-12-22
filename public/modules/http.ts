import {showError} from '../utils/notifications';
import {BASE_URL} from '../utils/constants';

class Http {
  static BaseUrl: string = BASE_URL;

  static Fetch(method: string, path: string, body: any = undefined): Promise<Response | null> {
    const url = (Http.BaseUrl || BASE_URL) + path;
    return fetch(url, {
      method,
      mode: 'cors',
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    }).catch(() => {
      showError('Server is unreachable. Check your internet connection');
      return null;
    }).then((r: Response | null) => {
      if (r && r.status >= 500) {
        throw Error('Internal Server Error');
      }
      return r;
    }).catch((e: Error) => {
      showError(e.message);
      return null;
    });
  }
}

export default Http;
