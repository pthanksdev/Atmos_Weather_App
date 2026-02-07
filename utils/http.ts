export async function apiCall<T>(url: string): Promise<T> {
  const response = await fetch(url);

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      typeof data?.message === 'string'
        ? data.message
        : `Request failed with status ${response.status}`
    );
  }

  return data as T;
}
