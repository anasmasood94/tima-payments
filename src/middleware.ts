import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/constants";

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

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
