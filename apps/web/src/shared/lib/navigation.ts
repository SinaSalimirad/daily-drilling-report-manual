import { hasRole } from "@/features/auth/lib/roles";
import type { UserRole } from "@/features/auth/type";

type NavItem = {
  title: string;
  url: string;
  /** One line about the page, shown on the dashboard home. */
  description: string;
  /** Hidden from users below this role; leave out for a page everyone may open. */
  minimumRole?: UserRole;
};

export type NavGroup = { title: string; items: NavItem[] };

// The pages of the dashboard, used by the sidebar and by the dashboard home.
// Add a page here when its route exists; a link that leads nowhere does not belong in the menu.
const navGroups: NavGroup[] = [
  {
    title: "MANAGEMENT",
    items: [
      {
        title: "Projects",
        url: "/dashboard/projects",
        description: "Drilling projects, their operators, contractors, rig and currency.",
      },
      {
        title: "Wells",
        url: "/dashboard/wells",
        description: "The wells of each project, their designation, rig and spud date.",
      },
      {
        title: "Sections",
        url: "/dashboard/sections",
        description: "The hole sections of each well and the order they are drilled in.",
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        description: "Daily drilling reports of each well: mud type, status and depths.",
      },
      {
        title: "Inventories",
        url: "/dashboard/inventories",
        description: "Product stock of each daily report: initial, received, used and final.",
      },
      {
        title: "Products",
        url: "/dashboard/products",
        description: "Drilling fluid products and their specifications.",
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        description: "Accounts, their roles and whether they may log in.",
        minimumRole: "admin",
      },
    ],
  },
];

/** The groups and pages a user of this role may open; a group with no page left is dropped. */
export function navGroupsFor(role: UserRole): NavGroup[] {
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.minimumRole === undefined || hasRole(role, item.minimumRole),
      ),
    }))
    .filter((group) => group.items.length > 0);
}
