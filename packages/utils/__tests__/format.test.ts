import { describe, it, expect } from "vitest";
import { formatDate, slugify, readingTime } from "../src/format";

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2025-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2025-06-01"));
    expect(result).toContain("2025");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify(" Hello World ")).toBe("hello-world");
  });
});

describe("readingTime", () => {
  it("calculates reading time", () => {
    const text = "word ".repeat(400);
    expect(readingTime(text)).toBe("2 min read");
  });

  it("returns 1 min for short text", () => {
    expect(readingTime("short text")).toBe("1 min read");
  });
});
