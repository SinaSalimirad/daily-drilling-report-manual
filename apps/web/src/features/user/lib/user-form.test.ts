/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { User } from "../type";
import {
  defaultValues,
  toCreatePayload,
  toFormValues,
  toUpdatePayload,
  type UserFormValues,
  validateCreate,
  validateEdit,
} from "./user-form";

const filled: UserFormValues = {
  email: "driller@example.com",
  displayName: "New Driller",
  role: "reporter",
  status: "active",
  password: "a-good-password",
};

const user: User = {
  id: "0199a1b2-0000-7000-8000-000000000001",
  email: "driller@example.com",
  displayName: "New Driller",
  role: "reporter",
  isActive: true,
  emailVerifiedAt: "2026-11-01T08:00:00.000Z",
  createdAt: "2026-11-01T08:00:00.000Z",
  updatedAt: "2026-11-01T08:00:00.000Z",
};

describe("validateCreate", () => {
  it("accepts a filled form", () => {
    expect(validateCreate({ value: filled })).toBeUndefined();
  });

  it("requires email, name and password on an empty form", () => {
    expect(validateCreate({ value: defaultValues })?.fields).toEqual({
      email: "Email is required",
      displayName: "Name is required",
      password: "Password is required",
    });
  });

  it("rejects text that is not an email", () => {
    const fields = validateCreate({ value: { ...filled, email: "driller@example" } })?.fields;

    expect(fields?.email).toBe("Enter a valid email address");
  });

  it("rejects a password shorter than 8 or longer than 128 characters", () => {
    const short = validateCreate({ value: { ...filled, password: "1234567" } })?.fields;
    const long = validateCreate({ value: { ...filled, password: "x".repeat(129) } })?.fields;

    expect(short?.password).toBe("Must be at least 8 characters");
    expect(long?.password).toBe("Must be at most 128 characters");
  });

  it("accepts a password of exactly 8 and exactly 128 characters", () => {
    expect(validateCreate({ value: { ...filled, password: "12345678" } })).toBeUndefined();
    expect(validateCreate({ value: { ...filled, password: "x".repeat(128) } })).toBeUndefined();
  });
});

describe("validateEdit", () => {
  it("accepts a blank password, which keeps the current one", () => {
    expect(validateEdit({ value: { ...filled, password: "" } })).toBeUndefined();
  });

  it("still checks the length of a new password", () => {
    const fields = validateEdit({ value: { ...filled, password: "short" } })?.fields;

    expect(fields?.password).toBe("Must be at least 8 characters");
  });

  it("requires a name", () => {
    expect(validateEdit({ value: { ...filled, displayName: "  " } })?.fields).toEqual({
      displayName: "Name is required",
    });
  });
});

describe("toCreatePayload", () => {
  it("trims email and name, sends the password as typed and leaves out the status", () => {
    const payload = toCreatePayload({
      ...filled,
      email: " driller@example.com ",
      displayName: " New Driller ",
      password: " pass word ",
    });

    expect(payload).toEqual({
      email: "driller@example.com",
      displayName: "New Driller",
      password: " pass word ",
      role: "reporter",
    });
  });
});

describe("toFormValues", () => {
  it("starts with a blank password and maps isActive to the status", () => {
    expect(toFormValues(user)).toEqual({ ...filled, password: "" });
    expect(toFormValues({ ...user, isActive: false }).status).toBe("inactive");
  });
});

describe("toUpdatePayload", () => {
  it("is empty when nothing changed", () => {
    expect(toUpdatePayload(toFormValues(user), user)).toEqual({});
  });

  it("sends only the name when only the name changed, so an admin can rename themselves", () => {
    const values = { ...toFormValues(user), displayName: " Renamed " };

    expect(toUpdatePayload(values, user)).toEqual({ displayName: "Renamed" });
  });

  it("sends role, isActive and password when they changed", () => {
    const values: UserFormValues = {
      ...toFormValues(user),
      role: "manager",
      status: "inactive",
      password: "a-brand-new-password",
    };

    expect(toUpdatePayload(values, user)).toEqual({
      role: "manager",
      isActive: false,
      password: "a-brand-new-password",
    });
  });

  it("reactivates a deactivated user", () => {
    const deactivated = { ...user, isActive: false };
    const values: UserFormValues = { ...toFormValues(deactivated), status: "active" };

    expect(toUpdatePayload(values, deactivated)).toEqual({ isActive: true });
  });
});
