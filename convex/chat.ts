import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getConversation = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    
    return conversation?.messages || [];
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.string(),
    message: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("image"), v.literal("video"))),
  },
  handler: async (ctx, args) => {
    const messageType = args.type || "text";
    
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: args.message,
      type: messageType,
      timestamp: Date.now(),
    };

    let conversation = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!conversation) {
      await ctx.db.insert("conversations", {
        sessionId: args.sessionId,
        messages: [userMessage],
      });
    } else {
      await ctx.db.patch(conversation._id, {
        messages: [...conversation.messages, userMessage],
      });
    }

    return userMessage;
  },
});

export const getConversationDoc = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const addMessageToConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    message: v.object({
      id: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image"), v.literal("video")),
      timestamp: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return;

    await ctx.db.patch(args.conversationId, {
      messages: [...conversation.messages, args.message],
    });
  },
});

export const generateAIResponse = action({
  args: {
    sessionId: v.string(),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Detectar se o usuário quer gerar imagem ou vídeo
      const isImageRequest = /gerar|criar|fazer.*imagem|desenh|ilustr|foto/i.test(args.userMessage);
      const isVideoRequest = /gerar|criar|fazer.*v[íi]deo|film|anima/i.test(args.userMessage);

      let responseContent = "";
      let responseType: "text" | "image" | "video" = "text";

      if (isImageRequest) {
        responseContent = "🎨 Gerando imagem... (Funcionalidade em desenvolvimento)\n\nPor enquanto, posso ajudar com conversas de texto. Em breve terei a capacidade de gerar imagens reais!";
        responseType = "image";
      } else if (isVideoRequest) {
        responseContent = "🎬 Gerando vídeo... (Funcionalidade em desenvolvimento)\n\nPor enquanto, posso ajudar com conversas de texto. Em breve terei a capacidade de gerar vídeos!";
        responseType = "video";
      } else {
        // Resposta de texto normal usando IA
        const response = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content: "Você é A&M Responde, uma IA assistente amigável e prestativa. Responda de forma clara, útil e conversacional. Você pode ajudar com diversas tarefas e responder perguntas sobre vários tópicos."
            },
            {
              role: "user",
              content: args.userMessage
            }
          ],
          max_tokens: 500,
        });

        responseContent = response.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
      }

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: responseContent,
        type: responseType,
        timestamp: Date.now(),
      };

      // Adicionar resposta da IA à conversa
      const conversationDoc = await ctx.runQuery(api.chat.getConversationDoc, {
        sessionId: args.sessionId
      });

      if (conversationDoc) {
        await ctx.runMutation(api.chat.addMessageToConversation, {
          conversationId: conversationDoc._id,
          message: aiMessage,
        });
      }

      return aiMessage;
    } catch (error) {
      console.error("Erro ao gerar resposta da IA:", error);
      
      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        type: "text" as const,
        timestamp: Date.now(),
      };

      return errorMessage;
    }
  },
});
