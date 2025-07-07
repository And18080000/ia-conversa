import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface ChatInterfaceProps {
  conversation: Doc<"conversations"> | null | undefined;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatInterface({ conversation, onSendMessage }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useQuery(api.auth.loggedInUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      await onSendMessage(currentMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const userName = user?.name || "Usuário";

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!conversation?.messages?.length ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <img 
                  src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
                  alt="A&M Logo" 
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Olá, {userName}! Sou a A&M Responde
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Estou aqui para ajudar com suas dúvidas e fornecer informações precisas. 
                Faça qualquer pergunta e receba respostas detalhadas e úteis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <strong className="text-slate-700">Histórico Pessoal</strong>
                  </div>
                  <p className="text-slate-600">Suas conversas são salvas de forma segura e privada, acessíveis apenas por você</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <strong className="text-slate-700">Resposta Inteligente</strong>
                  </div>
                  <p className="text-slate-600">Receba respostas instantâneas e precisas para qualquer tipo de pergunta</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/60">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">A&M Produções</span> - Tecnologia e inovação para o futuro
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-white border border-slate-200/60 text-slate-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
                  <div
                    className={`text-xs mt-3 ${
                      msg.role === "user" ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-sm text-slate-600 font-medium">A&M está pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-6">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta para A&M..."
              className="w-full px-6 py-4 border border-slate-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[56px] max-h-[120px] bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 placeholder-slate-400"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl font-medium"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
