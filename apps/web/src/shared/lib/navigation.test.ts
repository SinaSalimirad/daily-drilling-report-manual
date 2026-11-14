/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import { navGroupsFor } from "./navigation";

const titlesFor = (role: Parameters<typeof navGroupsFor>[0]) =>
  navGroupsFor(role).flatMap((group) => group.items.map((item) => item.title));

describe("navGroupsFor", () => {
  it("shows the Users page to an admin", () => {
    expect(titlesFor("admin")).toContain("Users");
  });

  it("hides the Users page and its empty group from a manager", () => {
    expect(titlesFor("manager")).not.toContain("Users");
    expect(navGroupsFor("manager").map((group) => group.title)).toEqual(["MANAGEMENT"]);
  });

  it("shows the same pages to a viewer as to a manager", () => {
    expect(titlesFor("viewer")).toEqual(titlesFor("manager"));
  });
});
