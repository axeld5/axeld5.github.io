
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const navItems = [
    { path: "/", label: "About" },
    { path: "/papers", label: "Papers" },
    { path: "/blog", label: "Blog" },
    ...(isLocalhost ? [{ path: "/dev", label: "Dev Mode" }] : [])
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
            Your Name
          </Link>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path 
                    ? "text-primary" 
                    : "text-muted-foreground",
                  item.path === "/dev" && "text-orange-600 dark:text-orange-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
