

import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  } else if (session.user.type != 'ADMIN') {
    redirect("/products")
  }
  return (
    <div>
      <h1>Welcome to the Dashboard page! {session.user?.email}</h1>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-black "
        >
          Terminar sessão
        </button>
      </form>
    </div>
  );
}