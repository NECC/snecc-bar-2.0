import { auth } from "@/auth";
import SignIn from "@/components/signIn";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/products");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-slate-900 flex flex-col md:flex-row">
      
      {/* SEÇÃO DA ESQUERDA: Texto e Formulário */}
      <section className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 md:px-8 lg:px-16">
        <div className="w-full max-w-md mx-auto md:mx-0">
          
          <h1 className="font-mono text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            BEM-VINDO
          </h1>
          
          <p className=" italic text-base sm:text-sm text-slate-600 mb-10 font-medium pt-5">
            Entra com a tua conta de sócio do NECC para acederes ao Snecc Bar.
          </p>

          {/* O componente SignIn deve conter o input de email e o botão azul como na imagem */}
          <div className="w-full">
            <SignIn />
          </div>
          
        </div>
      </section>

      {/* SEÇÃO DA DIREITA: Logo em destaque */}
      <section className="hidden md:flex w-full md:w-1/2 items-center justify-center relative overflow-hidden bg-slate-100/50">
        
        {/* Efeito Glow Suave de Fundo */}
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center p-8">
          <Image
            src="/logo.png"
            alt="Logo NECC"
            width={400}
            height={400}
            priority
            className="w-72 md:w-96 lg:w-[450px] h-auto object-contain drop-shadow-2xl transition-all duration-500 ease-out origin-center -rotate-12 hover:scale-110 hover:rotate-0 hover:drop-shadow-[0_0_25px_rgba(0,140,202,0.7)]"
          />
        </div>
        
      </section>

    </main>
  );
}