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

const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "find-jobs", name: "Find Jobs", url: "/dashboard/seeker/jobs", icon: Search },
    { id: "applications", name: "My Applications", url: "/dashboard/seeker/applications", icon: ClipboardList },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { id: "messages", name: "Messages", url: "/dashboard/seeker/messages", icon: MessageSquare },
    { id: "interviews", name: "Interviews", url: "/dashboard/seeker/interviews", icon: Calendar },
    { id: "profile", name: "Profile", url: "/dashboard/seeker/profile", icon: User },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/manage-jobs", icon: Briefcase },
    { id: "add-jobs", name: "Add Jobs", url: "/dashboard/recruiter/jobs", icon: PlusCircle },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
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
    const role = (session?.user as { role?: keyof typeof menuItemByRole } | undefined)?.role ?? "seeker";
  return (
    <Sidebar>
      <SidebarHeader />
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
