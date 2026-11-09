import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DashboardSidebar from "../components/DashboardSidebar";
import { Toaster } from "@/components/ui/toast";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    <SidebarProvider>
      <DashboardSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  )
};

export default DashboardLayout;