import { Routes } from '@/services/helpers/routes';
import { redirect } from 'next/navigation';

export function useFetch(authToken?: string, redirectOn401 = true) {
  const request = (method: string) => {
    return (url: string, body?: any) => {
      const requestOptions: any = {
        method,
        headers: {}
      };
      if (authToken) {
        requestOptions.headers['Authorization'] = `Bearer ${authToken}`;
      }
      if (body instanceof FormData) {
        requestOptions.body = body;
      } else if (body) {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(body);
      }

      return fetch(url, requestOptions).then(handleResponse);
    };
  };

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
  };

  async function handleResponse(response: any) {
    const isJson = response.headers
      ?.get('content-type')
      ?.includes('application/json');

    const data = isJson ? await response.json() : response;
    // check for error response
    if (!response.ok) {
      if (response.status === 401 && redirectOn401) {
        redirect(Routes.login);
      }
      // get errors array from body or default message from response status
      const error = data || response.statusText;
      return Promise.reject(error);
    }

    return data;
  }
}
