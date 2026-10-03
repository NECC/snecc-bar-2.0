import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/products"],
};
