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
  CirclePlus,
  ClipboardList,
  Flag,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
};

const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { id: "seeker-dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "seeker-find-jobs", name: "Find Jobs", url: "/dashboard/seeker/jobs", icon: Search },
    { id: "seeker-applications", name: "My Applications", url: "/dashboard/seeker/applications", icon: ClipboardList },
    { id: "seeker-saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { id: "seeker-messages", name: "Messages", url: "/dashboard/seeker/messages", icon: MessageSquare },
    { id: "seeker-interviews", name: "Interviews", url: "/dashboard/seeker/interviews", icon: Calendar },
    { id: "seeker-profile", name: "Profile", url: "/dashboard/seeker/profile", icon: User },
    { id: "seeker-settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "recruiter-dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "recruiter-post-job", name: "Post a Job", url: "/dashboard/recruiter/post-job", icon: CirclePlus },
    { id: "recruiter-job-postings", name: "Job Postings", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { id: "recruiter-applicants", name: "Applicants", url: "/dashboard/recruiter/applicants", icon: Users },
    { id: "recruiter-messages", name: "Messages", url: "/dashboard/recruiter/messages", icon: MessageSquare },
    { id: "recruiter-company-profile", name: "Company Profile", url: "/dashboard/recruiter/company", icon: Building },
    { id: "recruiter-settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
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
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {!isPending && menuItemByRole[role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<a href={item.url} />}>
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
