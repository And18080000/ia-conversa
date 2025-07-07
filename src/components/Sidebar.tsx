import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

interface SidebarProps {
  conversations: Doc<"conversations">[];
  currentConversationId: Id<"conversations"> | null;
  onNewConversation: () => void;
  onSelectConversation: (id: Id<"conversations">) => void;
  onDeleteConversation: (id: Id<"conversations">) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}: SidebarProps) {
  const user = useQuery(api.auth.loggedInUser);
  const userName = user?.name || "Usuário";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-md border-r border-slate-200/60 transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
                alt="A&M Logo" 
                className="w-8 h-8 object-contain"
              />
              <h2 className="text-lg font-bold text-slate-800">A&M Responde</h2>
            </div>
            
            {/* User greeting */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60">
              <p className="text-sm text-slate-600">
                Olá, <span className="font-semibold text-slate-800">{userName}</span>!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Suas conversas estão seguras e privadas
              </p>
            </div>

            <button
              onClick={onNewConversation}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nova Conversa</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4">
            {conversations.length === 0 ? (
              <div className="text-center text-slate-500 mt-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Nenhuma conversa ainda</p>
                <p className="text-xs mt-2 text-slate-400">Comece uma nova conversa com A&M!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      currentConversationId === conversation._id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm"
                        : "hover:bg-slate-50/80 border border-transparent"
                    }`}
                    onClick={() => onSelectConversation(conversation._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-800 truncate mb-2">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>
                            {new Date(conversation.lastUpdated).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {conversation.messages.length}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Excluir conversa"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200/60">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img 
                  src="https://res.cloudinary.com/dae7br7lb/image/upload/v1751763247/A_M_-_logo_rvjgqb.png" 
                  alt="A&M Logo" 
                  className="w-5 h-5 object-contain"
                />
                <p className="text-sm font-semibold text-slate-700">A&M Produções</p>
              </div>
              <p className="text-xs text-slate-500">Tecnologia e inovação para o futuro</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
