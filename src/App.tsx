import { ChatWidget } from "./components/ChatWidget";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Página simples apenas com o chat widget */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Use o chat A&M Responde no canto inferior direito
          </p>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-md mx-auto">
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">A&M Responde</h2>
            <p className="text-sm text-blue-600">
              Sua IA assistente está pronta para ajudar!
            </p>
            <div className="mt-4 text-xs text-blue-500">
              <p>💬 Conversas inteligentes</p>
              <p>🎨 Geração de imagens</p>
              <p>🎬 Geração de vídeos</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Widget de Chat Flutuante */}
      <ChatWidget />
      
      <Toaster />
    </div>
  );
}
