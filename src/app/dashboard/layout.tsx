import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    <SidebarProvider className="striped-dark">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">
        <SidebarTrigger className="text-white" />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayout;