import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, BarChart3, ScanLine, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/scanner", label: "Scanner", icon: ScanLine },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/10">
        <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          <span className="text-accent">INV</span>
          <span>CTRL</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">INDUSTRIAL SYSTEMS</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/10">
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="shadow-lg">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-background border-r border-border/50">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen border-r border-border bg-card fixed left-0 top-0 z-30">
        <NavContent />
      </aside>
    </>
  );
}
