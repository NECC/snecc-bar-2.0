import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.url));
  }

  if (req.auth.user?.type == "ADMIN" && req.nextUrl.pathname != "/dashboard") {
    return Response.redirect(new URL("/dashboard", req.url))
  }
});

export const config = {
  matcher: ["/products", "/orders", "/dashboard"],
};
