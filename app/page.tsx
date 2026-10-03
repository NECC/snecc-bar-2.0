import { auth } from "@/auth";
import SignIn from "@/components/signIn";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect("/products");
  }

  return (
    <main className="min-h-screen bg-[#161E2E] text-[#92B4D4]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        {/* Login */}
        <section className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 md:px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="font-orbitron text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                BEM-VINDO
              </h1>

              <p className="mt-3 text-base text-[#92B4D4]">
                Entra na tua conta de sócio do NECC.
              </p>
            </div>

            <SignIn />
          </div>
        </section>

        <section className="hidden md:flex flex-1 items-center justify-center px-6 py-8 md:px-8 lg:px-16 lg:py-16">
          <div className="relative flex w-full max-w-lg items-center justify-center">
            <div className="absolute rounded-full bg-[#3B9EFF]/10 blur-3xl -inset-12" />

            <Image
              src="/logo.png"
              alt="Logo NECC"
              width={400}
              height={400}
              priority
              className="h-auto w-100"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
