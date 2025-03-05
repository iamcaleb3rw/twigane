import { AppSidebar } from "@/components/app-sidebar";
import DynamicBreadcrumbs from "@/components/DynamicCrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          {/* Move the navigation inside SidebarInset and change fixed to sticky */}
          <nav className="p-3 bg-emerald-600 sticky top-0 z-10 bg-muted border-b flex items-center justify-between">
            <div className="flex items-center border bg-background px-2 max-w-[315px] w-full rounded-sm">
              <Search strokeWidth={1.4} className="h-6 w-6 " />
              <Input
                placeholder="Search courses..."
                className=" focus-visible:ring-0 text-lg focus-visible:ring-offset-0 border-none rounded-none bg-transparent"
              />
            </div>
            <div>
              <UserButton />
            </div>
          </nav>
          <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-1 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumbs />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
