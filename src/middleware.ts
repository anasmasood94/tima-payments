import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const CSRF_COOKIE = "csrf_secret";
const CSRF_SECRET_LENGTH = 32;

function generateCsrfSecret(): string {
  const bytes = new Uint8Array(CSRF_SECRET_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

export async function middleware(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { error: "Server misconfiguration: SESSION_SECRET is missing or too short." },
      { status: 500 },
    );
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    const role = payload.role as string | undefined;

    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
    }

    const response = NextResponse.next();

    const existingCsrf = request.cookies.get(CSRF_COOKIE)?.value;
    if (!existingCsrf || existingCsrf.length < CSRF_SECRET_LENGTH) {
      response.cookies.set(CSRF_COOKIE, generateCsrfSecret(), {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
