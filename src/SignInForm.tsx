"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Senha inválida. Tente novamente.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Não foi possível fazer login. Você quis dizer criar conta?"
                  : "Não foi possível criar conta. Você quis dizer fazer login?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:shadow-md text-slate-800 placeholder-slate-400"
            type="email"
            name="email"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Senha
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:shadow-md text-slate-800 placeholder-slate-400"
            type="password"
            name="password"
            placeholder="Sua senha"
            required
          />
        </div>
        <button 
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6" 
          type="submit" 
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : (
            flow === "signIn" ? "Entrar" : "Criar Conta"
          )}
        </button>
        <div className="text-center text-sm text-slate-600 mt-4">
          <span>
            {flow === "signIn"
              ? "Não tem uma conta? "
              : "Já tem uma conta? "}
          </span>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Criar conta" : "Fazer login"}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm font-semibold text-blue-800">Acesso Seguro</span>
        </div>
        <p className="text-xs text-blue-700">
          O login é obrigatório para garantir a segurança e privacidade do seu histórico de conversas.
        </p>
      </div>
    </div>
  );
}
