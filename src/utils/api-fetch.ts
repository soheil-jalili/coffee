// utils/apiFetch.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.status === 200) {
      res = await fetch(url, {
        ...options,
        credentials: "include",
      });
    }
  }

  return res;
}
