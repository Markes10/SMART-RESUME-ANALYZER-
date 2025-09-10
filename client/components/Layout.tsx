import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Brain, 
  TrendingDown, 
  MessageSquare, 
  GraduationCap, 
  FileText, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  Users,
  Menu,
  Sparkles
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Brain,
  },
  {
    name: "Résumé-Job Fit Engine",
    href: "/resume-fit",
    icon: FileText,
  },
  {
    name: "Turnover & Retention",
    href: "/turnover-retention",
    icon: TrendingDown,
  },
  {
    name: "Interview Co-pilot",
    href: "/interview-copilot",
    icon: MessageSquare,
  },
  {
    name: "Onboarding Journey",
    href: "/onboarding",
    icon: GraduationCap,
  },
  {
    name: "Performance Feedback",
    href: "/performance",
    icon: FileText,
  },
  {
    name: "Compensation Analysis",
    href: "/compensation",
    icon: DollarSign,
  },
  {
    name: "Learning Paths",
    href: "/learning-paths",
    icon: BookOpen,
  },
  {
    name: "Attendance Analytics",
    href: "/attendance",
    icon: Calendar,
  },
  {
    name: "Diversity & Inclusion",
    href: "/diversity-inclusion",
    icon: Users,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

function Navigation() {
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-secondary ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col h-full bg-card border-r">
          <div className="flex items-center gap-2 h-16 px-6 border-b">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">HRGenius</h1>
              <p className="text-xs text-muted-foreground">AI-Powered HR</p>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <Navigation />
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 h-16 px-4 border-b bg-background">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex items-center gap-2 h-16 px-6 border-b">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">HRGenius</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered HR</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <Navigation />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">HRGenius</h1>
              <p className="text-xs text-muted-foreground">AI-Powered HR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
