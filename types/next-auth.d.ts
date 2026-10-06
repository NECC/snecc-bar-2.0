import type { DefaultSession } from "next-auth"
import type { Roles } from "../generated/prisma/client"

declare module "next-auth" {
  interface User {
    type: Roles
  }
  interface Session {
    user: {
      type: Roles
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    type: Roles
  }
}