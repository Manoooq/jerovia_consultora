import { cn, formatCurrency, formatDate, generateToken } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("handles conditional classes", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("merges tailwind classes properly", () => {
    expect(cn("p-4 px-2", "py-4", "p-8")).toBe("p-8");
  });
});

describe("formatCurrency", () => {
  it("formats positive amounts", () => {
    const formatted = formatCurrency(1234567);
    // Remove non-breaking spaces for testing, as Intl.NumberFormat might use them
    expect(formatted.replace(/\s+/g, ' ')).toMatch(/Gs\.\s*1\.234\.567/);
  });

  it("formats zero", () => {
    const formatted = formatCurrency(0);
    expect(formatted.replace(/\s+/g, ' ')).toMatch(/Gs\.\s*0/);
  });
});

describe("formatDate", () => {
  it("formats date strings from YYYY-MM-DD to DD/MM/YYYY", () => {
    expect(formatDate("2023-12-05")).toBe("05/12/2023");
    expect(formatDate("2024-01-01")).toBe("01/01/2024");
  });

  it("returns empty string if date is empty", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("generateToken", () => {
  it("generates a 32-character token by default", () => {
    const token = generateToken();
    expect(token).toHaveLength(32);
    expect(typeof token).toBe("string");
  });

  it("generates a token of specified length", () => {
    const token = generateToken(10);
    expect(token).toHaveLength(10);
  });

  it("contains only alphanumeric characters", () => {
    const token = generateToken(100);
    expect(token).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("generates unique tokens", () => {
    const token1 = generateToken();
    const token2 = generateToken();
    expect(token1).not.toBe(token2);
  });
});
