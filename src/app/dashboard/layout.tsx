import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    <SidebarProvider className="bg-blue-950">
      <DashboardSidebar />
      <main>
        <SidebarTrigger className="text-white" />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayout;