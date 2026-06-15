// AegisOps DeployGuard AI — Routing and Authentication Middleware
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
const isRealSupabaseAvailable = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/reset", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isStaticFile = pathname.includes(".") || pathname.startsWith("/_next");

  if (isStaticFile) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  let user = null;

  if (isRealSupabaseAvailable) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const mockSession = request.cookies.get("deployguard_session");
  const isAuthenticated = !!user || !!mockSession;

  if (!isAuthenticated && !isAuthPage && !isApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPage && PUBLIC_PATHS.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated) {
    if (user) {
      const role = (user.user_metadata?.role as string) || "developer";
      response.headers.set("x-user-id", user.id);
      response.headers.set("x-user-email", user.email || "");
      response.headers.set("x-user-role", role);
    } else {
      const storedRole = request.cookies.get("deployguard_role")?.value || "developer";
      const storedUserId = request.cookies.get("deployguard_user_id")?.value || "mock-user-id";
      const storedEmail = request.cookies.get("deployguard_user_email")?.value || "";
      response.headers.set("x-user-id", storedUserId);
      response.headers.set("x-user-email", storedEmail);
      response.headers.set("x-user-role", storedRole);
    }
  }

  return response;
}
