import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    if (req.nextUrl.pathname === "/") return;
    return Response.redirect(new URL("/", req.url));
  }

  if (req.auth.user?.type == "ADMIN" && (req.nextUrl.pathname.includes("/dashboard") == false || req.nextUrl.pathname == "/dashboard")) {
    return Response.redirect(new URL("/dashboard/transactions", req.url))
  }

  if (req.auth.user?.type != "ADMIN" && req.nextUrl.pathname.includes("/dashboard") == true) {
    return Response.redirect(new URL("/products", req.url))
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',],
};
