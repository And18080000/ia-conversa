import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const askAI = action({
  args: {
    message: v.string(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Get conversation history if exists
    let conversation = null;
    if (args.conversationId) {
      conversation = await ctx.runQuery(internal.ai.getConversation, {
        conversationId: args.conversationId,
        userId,
      });
    }

    // Prepare messages for OpenAI
    const messages = [];
    
    // Add system message
    messages.push({
      role: "system" as const,
      content: "Você é A&M Responde, uma assistente de IA inteligente, útil e amigável da A&M Produções. Responda de forma clara, precisa e informativa. Sempre forneça respostas em português brasileiro, a menos que especificamente solicitado em outro idioma. Seja prestativa e mantenha um tom profissional mas acessível."
    });

    // Add conversation history
    if (conversation) {
      conversation.messages.forEach((msg: { role: "user" | "assistant"; content: string }) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user" as const,
      content: args.message,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content || "Desculpe, não consegui gerar uma resposta no momento.";

      // Save or update conversation
      const conversationId: string = await ctx.runMutation(internal.ai.saveConversation, {
        conversationId: args.conversationId,
        userMessage: args.message,
        aiResponse,
        userId,
      });

      return {
        response: aiResponse,
        conversationId,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Erro ao processar sua pergunta. Tente novamente em alguns instantes.");
    }
  },
});

export const saveConversation = internalMutation({
  args: {
    conversationId: v.optional(v.id("conversations")),
    userMessage: v.string(),
    aiResponse: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const userMessageId = `user_${timestamp}`;
    const aiMessageId = `ai_${timestamp + 1}`;

    const userMessage = {
      id: userMessageId,
      role: "user" as const,
      content: args.userMessage,
      timestamp,
    };

    const aiMessage = {
      id: aiMessageId,
      role: "assistant" as const,
      content: args.aiResponse,
      timestamp: timestamp + 1,
    };

    if (args.conversationId) {
      // Update existing conversation
      const conversation = await ctx.db.get(args.conversationId);
      if (conversation && conversation.userId === args.userId) {
        const updatedMessages = [...conversation.messages, userMessage, aiMessage];
        await ctx.db.patch(args.conversationId, {
          messages: updatedMessages,
          lastUpdated: timestamp,
        });
        return args.conversationId;
      }
    }

    // Create new conversation
    const title = args.userMessage.length > 50 
      ? args.userMessage.substring(0, 50) + "..."
      : args.userMessage;

    return await ctx.db.insert("conversations", {
      userId: args.userId,
      messages: [userMessage, aiMessage],
      title,
      lastUpdated: timestamp,
    });
  },
});

export const getConversation = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation && conversation.userId === args.userId) {
      return conversation;
    }
    return null;
  },
});

export const getConversationPublic = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (conversation && conversation.userId === userId) {
      return conversation;
    }
    return null;
  },
});

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("conversations")
      .withIndex("by_user_and_last_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (conversation && conversation.userId === userId) {
      await ctx.db.delete(args.conversationId);
    } else {
      throw new Error("Conversa não encontrada ou sem permissão");
    }
  },
});
