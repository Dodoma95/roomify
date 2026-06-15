const API_BASE = process.env.ROOMIFY_API_URL ?? "https://roomify-api-1ik6.onrender.com";

type FetchOptions = RequestInit & { token?: string };

export async function apiFetch<T>(
  path: string,
  { token, ...init }: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    signal: init.signal ?? AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const text = await res.text();
      if (text) {
        try {
          const body = JSON.parse(text);
          if (body && typeof body === "object") {
            if (typeof body.message === "string") message = body.message;
            else if (typeof body.error === "string") message = body.error;
          } else {
            message = text;
          }
        } catch {
          message = text;
        }
      }
    } catch { /* keep default */ }
    const apiError = new Error(message) as Error & { status: number };
    apiError.status = res.status;
    throw apiError;
  }

  // 204 No Content ou body vide → pas de JSON à parser
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function graphqlFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GraphQL error ${res.status}: ${body}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}
