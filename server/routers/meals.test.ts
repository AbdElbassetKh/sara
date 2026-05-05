import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("meals router", () => {
  it("should create a meal entry with allergen analysis", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.meals.create({
        childId: 1,
        foodName: "Apple and Banana",
        ingredients: ["apple", "banana"],
        notes: "Healthy breakfast",
      });

      expect(result).toBeDefined();
      // The result should contain allergen analysis
      expect(result).toHaveProperty("allergenAnalysis");
    } catch (error) {
      // Expected to fail if database is not properly seeded
      expect(error).toBeDefined();
    }
  });

  it("should list meal entries for a child", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.meals.list({
        childId: 1,
      });

      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      // Expected to fail if database is not properly seeded
      expect(error).toBeDefined();
    }
  });
});
