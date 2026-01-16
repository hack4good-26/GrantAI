"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  History,
  Library,
  Menu,
  ChevronLeft,
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

  // Helper to handle expansion when clicking the sidebar
  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden">
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed ? (
          <>
            <Image
              src="/GrantAI__3_-removebg-preview.png"
              alt="GrantAI Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
            {/* The Chevron only shows when NOT collapsed */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the parent 'expand' logic from firing
                setIsCollapsed(true);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Image
            src="/grant-ai-logo-removebg-preview.png"
            alt="GrantAI Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-hidden">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              // e.stopPropagation ensures that clicking the link doesn't trigger the sidebar expansion logic
              onClick={(e) => e.stopPropagation()} 
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
      </div>
      
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
      <div 
        onClick={handleSidebarClick}
        className={cn(
          "hidden md:block h-screen sticky top-0 transition-all duration-300 group cursor-pointer", 
          isCollapsed ? "w-16" : "w-64 cursor-default"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}