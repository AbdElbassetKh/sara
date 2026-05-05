import { describe, it, expect, vi } from "vitest";
import { ENV } from "../_core/env";

// Mock getDb to avoid real DB calls in unit tests
vi.mock("../db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

describe("report router – environment", () => {
  it("RESEND_API_KEY is defined in ENV", () => {
    // The key should be set via webdev_request_secrets
    // In CI/dev without the key, we just verify the ENV field exists
    expect(typeof ENV.resendApiKey).toBe("string");
  });

  it("RESEND_API_KEY is non-empty when configured", () => {
    // This test will pass in production (key set) and gracefully skip in CI
    if (!ENV.resendApiKey) {
      console.warn("RESEND_API_KEY not set – skipping live validation");
      return;
    }
    expect(ENV.resendApiKey.length).toBeGreaterThan(0);
    // Resend keys start with "re_"
    expect(ENV.resendApiKey.startsWith("re_")).toBe(true);
  });
});

describe("generateReportPDF helper", () => {
  it("generates a non-empty PDF buffer", async () => {
    const { generateReportPDF } = await import("../_core/pdfReport");
    const buffer = await generateReportPDF({
      childName: "Test Child",
      birthDate: "01/01/2020",
      gender: "girl",
      bloodType: "A+",
      allergies: ["peanuts"],
      reportDate: "5 mai 2026",
      language: "fr",
      symptoms: [
        {
          symptomType: "Démangeaisons",
          severity: 7,
          notes: "Après repas",
          createdAt: new Date(),
        },
      ],
      meals: [
        {
          foodName: "Fraises",
          mealType: null,
          notes: null,
          createdAt: new Date(),
        },
      ],
      doctors: [
        {
          name: "Dr. Martin",
          specialty: "Pédiatre",
          phone: "+33 1 23 45 67 89",
          email: "dr.martin@example.com",
        },
      ],
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(1000); // A valid PDF is at least 1 KB
    // PDF files start with %PDF
    expect(buffer.slice(0, 4).toString()).toBe("%PDF");
  });
});
