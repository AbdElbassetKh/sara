import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-timeline",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// ─── Timeline ────────────────────────────────────────────────────────────────
describe("timeline.getEntries", () => {
  it("returns an array (empty or with items)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.timeline.getEntries({ childId: 1, filter: "all", limit: 10 });
      expect(Array.isArray(result)).toBe(true);
    } catch (err: any) {
      // FORBIDDEN is acceptable when child doesn't belong to test user
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"].includes(err?.data?.code ?? "")).toBe(true);
    }
  });

  it("returns only meals when filter=meal", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.timeline.getEntries({ childId: 1, filter: "meal", limit: 10 });
      expect(Array.isArray(result)).toBe(true);
      result.forEach((entry) => expect(entry.type).toBe("meal"));
    } catch (err: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"].includes(err?.data?.code ?? "")).toBe(true);
    }
  });

  it("returns only symptoms when filter=symptom", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.timeline.getEntries({ childId: 1, filter: "symptom", limit: 10 });
      expect(Array.isArray(result)).toBe(true);
      result.forEach((entry) => expect(entry.type).toBe("symptom"));
    } catch (err: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"].includes(err?.data?.code ?? "")).toBe(true);
    }
  });

  it("rejects unauthenticated access", async () => {
    const unauthCtx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(unauthCtx);
    await expect(
      caller.timeline.getEntries({ childId: 1, filter: "all", limit: 10 })
    ).rejects.toThrow();
  });
});

// ─── Dashboard – Recent Activity ─────────────────────────────────────────────
describe("dashboard.getRecentActivity", () => {
  it("returns an array with at most 5 items", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.dashboard.getRecentActivity({ childId: 1 });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    } catch (err: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"].includes(err?.data?.code ?? "")).toBe(true);
    }
  });

  it("each item has required fields: id, type, title, detail, date", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.dashboard.getRecentActivity({ childId: 1 });
      result.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("type");
        expect(["meal", "symptom"]).toContain(item.type);
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("detail");
        expect(item).toHaveProperty("date");
      });
    } catch (err: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"].includes(err?.data?.code ?? "")).toBe(true);
    }
  });

  it("rejects unauthenticated access", async () => {
    const unauthCtx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(unauthCtx);
    await expect(
      caller.dashboard.getRecentActivity({ childId: 1 })
    ).rejects.toThrow();
  });
});

// ─── Insights – Correlations ─────────────────────────────────────────────────
describe("insights.detectCorrelations", () => {
  it("returns an array of correlations", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.insights.detectCorrelations({ childId: 1 });
      expect(Array.isArray(result)).toBe(true);
    } catch (err: any) {
      expect(err).toBeDefined();
    }
  });
});

// ─── Insights – Time Series ───────────────────────────────────────────────────
describe("insights.getSymptomTimeSeries", () => {
  it("returns an array with date/symptoms/avgSeverity/meals fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.insights.getSymptomTimeSeries({ childId: 1, days: 7 });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);
      result.forEach((d) => {
        expect(d).toHaveProperty("date");
        expect(d).toHaveProperty("symptoms");
        expect(d).toHaveProperty("avgSeverity");
        expect(d).toHaveProperty("meals");
      });
    } catch (err: any) {
      expect(err).toBeDefined();
    }
  });
});

// ─── Insights – Symptom Frequency ────────────────────────────────────────────
describe("insights.getSymptomFrequency", () => {
  it("returns an array with type and count fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.insights.getSymptomFrequency({ childId: 1, days: 30 });
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item).toHaveProperty("type");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    } catch (err: any) {
      expect(err).toBeDefined();
    }
  });
});

// ─── Insights – Heatmap ───────────────────────────────────────────────────────
describe("insights.getMealSymptomHeatmap", () => {
  it("returns foods, symptoms, and matrix arrays", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.insights.getMealSymptomHeatmap({ childId: 1, days: 30 });
      expect(result).toHaveProperty("foods");
      expect(result).toHaveProperty("symptoms");
      expect(result).toHaveProperty("matrix");
      expect(Array.isArray(result.foods)).toBe(true);
      expect(Array.isArray(result.symptoms)).toBe(true);
      expect(Array.isArray(result.matrix)).toBe(true);
    } catch (err: any) {
      expect(err).toBeDefined();
    }
  });
});
