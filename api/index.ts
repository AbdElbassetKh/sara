import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

// Body parsing — Vercel hard-limits request body to 4.5 MB by default.
// We keep 10 MB here (covers most image uploads); larger uploads must use presigned URLs.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Storage proxy: /manus-storage/*  →  307 redirect to S3 presigned URL
registerStorageProxy(app);

// OAuth callback: /api/oauth/callback
registerOAuthRoutes(app);

// Digital Asset Links for Android TWA (Trusted Web Activity)
app.get("/.well-known/assetlinks.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.allenest.childsafety",
        sha256_cert_fingerprints: [
          "97:63:24:DD:5E:57:E5:14:C1:CC:AE:BA:98:62:08:5E:C9:76:3E:0E:5B:35:78:BB:6C:65:A2:F0:D9:FF:F3:F1",
        ],
      },
    },
  ]);
});

// tRPC API: /api/trpc/*
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export the Express app as the default Vercel handler.
// Vercel calls this as a standard Node.js (req, res) handler.
export default app;
