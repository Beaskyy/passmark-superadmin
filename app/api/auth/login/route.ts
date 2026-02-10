import { NextResponse } from "next/server";

const getApiUrl = () => {
  const raw = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = raw.trim().replace(/\/+$/, "");
  if (!url) throw new Error("API_URL or NEXT_PUBLIC_API_URL is not set");
  return url;
};

/** Normalize login API response (handles various shapes: snake_case, nested data, etc.). */
function normalizeLoginResponse(data: Record<string, unknown>): { user: { id: string; email: string; name: string }; accessToken: string } | null {
  // Unwrap nested { data: { ... } } or { result: { ... } } if present
  const root = (data.data ?? data.result ?? data) as Record<string, unknown>;
  const userRaw = (root.user ?? root ?? data.user ?? data) as Record<string, unknown>;
  const tokens = (root.tokens ?? data.tokens) as Record<string, unknown> | undefined;
  const accessToken = (
    (tokens?.access ?? tokens?.access_token ?? tokens?.token) ??
    root.access ?? root.access_token ?? root.token ??
    data.access ?? data.access_token ?? data.token
  ) as string | undefined;

  const email = (userRaw.email ?? userRaw.username) as string | undefined;
  if (!email || !accessToken) return null;

  const firstName = (userRaw.firstname ?? userRaw.first_name) as string | undefined;
  const lastName = (userRaw.lastname ?? userRaw.last_name) as string | undefined;
  const id = userRaw.id != null ? String(userRaw.id) : "1";
  const name =
    [firstName, lastName].filter(Boolean).join(" ") ||
    (userRaw.name as string) ||
    email;

  return {
    user: { id, email, name },
    accessToken,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl();
    const loginUrl = `${apiUrl}/admin-api/auth/login/`;

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type");
    const rawBody = await res.text();

    if (!contentType?.includes("application/json")) {
      console.error("[Login API] Non-JSON response:", res.status, rawBody.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid response from login server" },
        { status: 502 }
      );
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      console.error("[Login API] Invalid JSON:", rawBody.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid response from login server" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      const message = (data.detail as string) ?? (data.message as string) ?? "Invalid credentials";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const normalized = normalizeLoginResponse(data);
    if (!normalized) {
      // Log so you can see the actual shape from dev.passmark.ai (e.g. in terminal)
      console.error("[Login API] Response shape not recognized. Top-level keys:", Object.keys(data));
      console.error("[Login API] Response preview (no secrets):", JSON.stringify(data).slice(0, 500));
      return NextResponse.json(
        { error: "Invalid response from login server" },
        { status: 502 }
      );
    }

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[Login API] Request failed:", err);
    return NextResponse.json(
      { error: "Login request failed" },
      { status: 500 }
    );
  }
}
