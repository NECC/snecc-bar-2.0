import { auth } from "@/auth";
import SignIn from "@/components/signIn";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, UserCheck } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    if (session.user.email === "afonso.martins8282@gmail.com") {
      redirect("/dashboard");
    }
    redirect("/products");
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* SEÇÃO DA ESQUERDA: Formulário de Login */}
        <section className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 md:px-10 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            
            {/* BRANDING EXCLUSIVO PARA MOBILE (CENTRALIZADO) */}
            <div className="flex md:hidden flex-col items-center justify-center bg-slate-900 dark:bg-slate-800/90 text-white p-6 rounded-2xl mb-6 shadow-lg border border-slate-800 relative overflow-hidden">
              {/* Efeito Glow Azul de Fundo */}
              <div className="absolute w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

              <Image
                src="/logo.png"
                alt="Logo NECC"
                width={80}
                height={80}
                priority
                className="h-16 w-auto object-contain drop-shadow-md z-10 transition-transform hover:scale-105 duration-200"
              />

            </div>

            {/* Badge de Identificação */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Autenticação</span>
            </div>

            <div className="mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                BEM-VINDO AO SNECC-BAR
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Entra com o teu email de sócio para aceder ao catálogo.
              </p>
            </div>

            {/* Componente de Login */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-inner">
              <SignIn />
            </div>

            <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
              Problemas no acesso? Contacta o apoio do NECC.
            </p>
          </div>
        </section>

        {/* SEÇÃO DA DIREITA: Painel de Destaque / Branding (PC) */}
        <section className="hidden md:flex bg-slate-900 dark:bg-slate-950 text-white p-10 flex-col justify-between relative overflow-hidden">
          
          {/* Efeito Glow Azul de Fundo */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        
          {/* Imagem Central e Efeito */}
          <div className="relative my-auto flex w-full items-center justify-center py-6 z-10">
            <div className="absolute rounded-full bg-blue-500/10 blur-2xl -inset-4" />
            <Image
              src="/logo.png"
              alt="Logo NECC"
              width={320}
              height={320}
              priority
              className="h-auto w-72 object-contain drop-shadow-xl transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Vantagem/Destaque no Canto Inferior */}
          <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3.5 z-10">
            <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-200">Descontos Exclusivos</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Validação automática de sócio para aplicar preços especiais.
              </div>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}