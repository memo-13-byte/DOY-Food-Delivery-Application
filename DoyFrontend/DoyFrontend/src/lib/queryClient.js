import { QueryClient } from '@tanstack/react-query';

async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch (e) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res;
}

export async function apiRequest(
  method,
  url,
  data
) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  return throwIfResNotOk(res);
}

export const getQueryFn = ({ on401: unauthorizedBehavior }) => 
  async ({ queryKey }) => {
    const url = queryKey[0];
    try {
      const res = await fetch(url, { credentials: 'include' });
      
      if (res.status === 401 && unauthorizedBehavior === 'returnNull') {
        return null;
      }

      await throwIfResNotOk(res);
      return res.json();
    } catch (e) {
      if (e.message.includes('401') && unauthorizedBehavior === 'returnNull') {
        return null;
      }
      throw e;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});