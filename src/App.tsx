import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";
import { ChatInterface } from "./components/ChatInterface";
import { Sidebar } from "./components/Sidebar";
import { AuthWrapper } from "./components/AuthWrapper";
import { UserProfile } from "./components/UserProfile";

function AppContent() {
  const [currentConversationId, setCurrentConversationId] = useState<Id<"conversations"> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const conversations = useQuery(api.ai.listConversations) || [];
  const currentConversation = useQuery(
    api.ai.getConversationPublic,
    currentConversationId ? { conversationId: currentConversationId } : "skip"
  );

  const askAI = useAction(api.ai.askAI);
  const deleteConversation = useMutation(api.ai.deleteConversation);

  const handleSendMessage = async (message: string) => {
    try {
      const result = await askAI({
        message,
        conversationId: currentConversationId || undefined,
      });
      
      if (!currentConversationId) {
        setCurrentConversationId(result.conversationId as Id<"conversations">);
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error("Error sending message:", error);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversationId: Id<"conversations">) => {
    setCurrentConversationId(conversationId);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: Id<"conversations">) => {
    try {
      await deleteConversation({ conversationId });
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
      toast.success("Conversa excluída com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir conversa");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <img 
                src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
                alt="A&M Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">A&M Responde</h1>
                <p className="text-sm text-slate-500 font-medium">Sua assistente inteligente</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Online</span>
            </div>
            <UserProfile />
          </div>
        </header>

        {/* Chat Interface */}
        <ChatInterface
          conversation={currentConversation}
          onSendMessage={handleSendMessage}
        />
      </div>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#334155',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
}
