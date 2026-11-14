"use client";

import { GalleryVerticalEndIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavUser } from "@/features/auth/components/nav-user";
import { useMe } from "@/features/auth/hooks/use-auth";
import { navGroupsFor } from "@/shared/lib/navigation";

// A page is also active on its sub-routes (e.g. /dashboard/wells/123).
const isActiveLink = (pathname: string, url: string) =>
  pathname === url || pathname.startsWith(`${url}/`);

export function MenuSidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // AuthGuard renders this only with a logged-in user; until then there is nothing to list.
  const { data: user } = useMe();
  const navGroups = user ? navGroupsFor(user.role) : [];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Daily Mud Fluid Report</span>
                  <span className="text-xs text-muted-foreground">Savaenergy</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  render={<Link href="/dashboard" className="font-medium" />}
                >
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              {navGroups.map((group) => (
                <SidebarMenuItem key={group.title}>
                  {/* A heading, not a link: a group has no page of its own. */}
                  <p className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70">
                    {group.title}
                  </p>
                  <SidebarMenuSub>
                    {group.items.map((item) => (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton
                          isActive={isActiveLink(pathname, item.url)}
                          render={<Link href={item.url} />}
                        >
                          {item.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
