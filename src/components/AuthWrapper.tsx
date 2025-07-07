import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const user = useQuery(api.auth.loggedInUser);

  if (user === undefined) {
    // Loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <img 
              src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
              alt="A&M Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Carregando A&M Responde...</p>
        </div>
      </div>
    );
  }

  if (user === null) {
    // Not authenticated
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/60 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <img 
                  src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
                  alt="A&M Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">A&M Responde</h1>
              <p className="text-slate-600 font-medium">Sua assistente inteligente pessoal</p>
              <p className="text-sm text-slate-500 mt-2">Faça login para acessar seu histórico privado</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Sign In Form */}
            <SignInForm />

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
              <p className="text-xs text-slate-500">
                Desenvolvido por <span className="font-semibold text-slate-700">A&M Produções</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Tecnologia e inovação para o futuro
              </p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated
  return <>{children}</>;
}
