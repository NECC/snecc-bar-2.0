import { signIn } from "@/auth";
import { Mail, ArrowRight } from "lucide-react";

export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("resend", formData);
      }}
      className="flex flex-col gap-4 w-full"
    >
      {/* Campo de Entrada de Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-bold text-slate-700 tracking-wide"
        >
          Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="a1111@alunos.uminho.com"
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition shadow-sm"
          />
        </div>
      </div>

      {/* Botão de Enviar Link de Acesso */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer"
      >
        <span>Entrar com Email</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}