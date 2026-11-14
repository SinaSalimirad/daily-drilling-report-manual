/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import { hasRole } from "./roles";

describe("hasRole", () => {
  it("accepts the same role", () => {
    expect(hasRole("manager", "manager")).toBe(true);
  });

  it("accepts a higher role", () => {
    expect(hasRole("admin", "viewer")).toBe(true);
    expect(hasRole("manager", "reporter")).toBe(true);
  });

  it("rejects a lower role", () => {
    expect(hasRole("viewer", "reporter")).toBe(false);
    expect(hasRole("reporter", "manager")).toBe(false);
    expect(hasRole("manager", "admin")).toBe(false);
  });
});
