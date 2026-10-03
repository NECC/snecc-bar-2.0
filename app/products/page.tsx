import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <div>
      <h1>Welcome to the Products page! {session.user?.email}</h1>

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
