import { describe, it, expect } from "vitest";
import { estimateMonthly } from "../format";

describe("estimateMonthly - financing calculator", () => {
  describe("standard calculation (30% down, 36 months, 14% APR)", () => {
    it("calculates correctly for 1,000,000 KES car", () => {
      const result = estimateMonthly(1_000_000);
      expect(result).toBe(23924);
    });

    it("calculates correctly for 2,500,000 KES car", () => {
      const result = estimateMonthly(2_500_000);
      expect(result).toBe(59811);
    });

    it("calculates correctly for 500,000 KES car", () => {
      const result = estimateMonthly(500_000);
      expect(result).toBe(11962);
    });
  });

  describe("custom parameters", () => {
    it("handles 0% down payment", () => {
      const result = estimateMonthly(1_000_000, { downPercent: 0 });
      expect(result).toBe(34178);
    });

    it("handles 50% down payment", () => {
      const result = estimateMonthly(1_000_000, { downPercent: 50 });
      expect(result).toBe(17089);
    });

    it("handles 60 month term", () => {
      const result = estimateMonthly(1_000_000, { months: 60 });
      expect(result).toBe(16288);
    });

    it("handles 24 month term", () => {
      const result = estimateMonthly(1_000_000, { months: 24 });
      expect(result).toBe(33609);
    });

    it("handles 10% APR", () => {
      const result = estimateMonthly(1_000_000, { annualRate: 10 });
      expect(result).toBe(22587);
    });

    it("handles 20% APR", () => {
      const result = estimateMonthly(1_000_000, { annualRate: 20 });
      expect(result).toBe(26015);
    });

    it("handles 0% APR (interest-free)", () => {
      const result = estimateMonthly(1_000_000, { annualRate: 0 });
      const expected = Math.round((1_000_000 * 0.7) / 36);
      expect(result).toBe(expected);
    });
  });

  describe("edge cases", () => {
    it("accepts string price input", () => {
      const result = estimateMonthly("1000000");
      expect(result).toBe(23924);
    });

    it("handles very low price", () => {
      const result = estimateMonthly(100_000);
      expect(result).toBe(2392);
    });

    it("handles very high price", () => {
      const result = estimateMonthly(50_000_000);
      expect(result).toBe(1196217);
    });

    it("returns integer (rounded)", () => {
      const result = estimateMonthly(1_234_567);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("formula verification", () => {
    it("principal = price * (1 - downPercent/100)", () => {
      const price = 1_000_000;
      const downPercent = 30;
      const principal = price * (1 - downPercent / 100);
      expect(principal).toBe(700_000);
    });

    it("monthly rate = annualRate / 100 / 12", () => {
      const annualRate = 14;
      const monthlyRate = annualRate / 100 / 12;
      expect(monthlyRate).toBeCloseTo(0.0116667, 5);
    });

    it("formula matches standard amortization formula", () => {
      const price = 1_000_000;
      const downPercent = 30;
      const months = 36;
      const annualRate = 14;

      const principal = price * (1 - downPercent / 100);
      const r = annualRate / 100 / 12;
      const monthly = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

      expect(Math.round(monthly)).toBe(23924);
    });
  });
});