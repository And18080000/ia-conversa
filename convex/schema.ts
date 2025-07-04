import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  conversations: defineTable({
    sessionId: v.string(),
    messages: v.array(v.object({
      id: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image"), v.literal("video")),
      timestamp: v.number(),
    })),
  }).index("by_session", ["sessionId"]),
};

export default defineSchema({
  ...applicationTables,
});
