import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  conversations: defineTable({
    userId: v.id("users"),
    messages: v.array(v.object({
      id: v.string(),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
    })),
    title: v.string(),
    lastUpdated: v.number(),
  })
    .index("by_user_and_last_updated", ["userId", "lastUpdated"])
    .index("by_last_updated", ["lastUpdated"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
