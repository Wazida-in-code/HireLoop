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
import { Plus } from "lucide-react";

const menuItemByRole = {
    seeker: [],
    reqruiter: [],
    admin: []
}

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
            {
            // menuItemByRole[role].map((item) => (
            //   <SidebarMenuItem key={item.id}>
            //     <SidebarMenuButton render={<a href={item.url} />}>
            //       <item.icon />
            //       <span>{item.name}</span>
            //     </SidebarMenuButton>
            //   </SidebarMenuItem>
            // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default DashboardSidebar;
