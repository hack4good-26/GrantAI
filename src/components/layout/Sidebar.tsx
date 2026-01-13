"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  History, 
  Library, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  Search
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "History",
      icon: History,
      href: "/history",
      active: pathname === "/history",
    },
    {
      label: "View Grants",
      icon: Library,
      href: "/grants",
      active: pathname === "/grants" || pathname.startsWith("/grants/"),
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            GrantAdvisor
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                route.active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? route.label : undefined}
            >
              <route.icon className="h-5 w-5" />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
         {!isCollapsed ? (
           <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
               U
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-medium">User</span>
             </div>
           </div>
         ) : (
            <div className="h-8 w-8 mx-auto rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
              U
            </div>
         )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block h-screen sticky top-0 transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
        <SidebarContent />
      </div>
    </>
  );
}
