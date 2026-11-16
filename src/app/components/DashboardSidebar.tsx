"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import type { Role } from "@/lib/roles";
import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  ChartBar,
  ClipboardList,
  FileText,
  Flag,
  House,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
};

// "Home" is the same link for every role, so it goes in all three lists.
const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "find-jobs", name: "Find Jobs", url: "/dashboard/seeker/jobs", icon: Search },
    { id: "applications", name: "My Applications", url: "/dashboard/seeker/my-applications", icon: ClipboardList },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { id: "messages", name: "Messages", url: "/dashboard/seeker/messages", icon: MessageSquare },
    { id: "interviews", name: "Interviews", url: "/dashboard/seeker/interviews", icon: Calendar },
    { id: "profile", name: "Profile", url: "/dashboard/seeker/profile", icon: User },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/manage-jobs", icon: Briefcase },
    { id: "add-jobs", name: "Add Jobs", url: "/dashboard/recruiter/jobs", icon: PlusCircle },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "admin-dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "admin-users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { id: "admin-jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { id: "admin-companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building },
    { id: "admin-reports", name: "Reports", url: "/dashboard/admin/reports", icon: Flag },
    { id: "admin-analytics", name: "Analytics", url: "/dashboard/admin/analytics", icon: ChartBar },
    { id: "admin-settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
};

const DashboardSidebar = () => {
    const {data: session, isPending} = useSession();
    const role = (session?.user as { userRole?: keyof typeof menuItemByRole } | undefined)?.userRole ?? "seeker";
  return (
    <Sidebar>
      {/* Header: shows the signed-in user's name and role */}
      <SidebarHeader className="bg-blue-950">
        <div className="px-3 py-2">
          <p className="truncate text-base font-bold text-white">
            {session?.user.name ?? "…"}
          </p>
          <p className="text-sm capitalize text-white/60">
            {session ? role : "…"}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-blue-950 text-white">
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {!isPending && menuItemByRole[role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default DashboardSidebar;
