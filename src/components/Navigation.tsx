import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const tools = [
  { name: "Diff Tool", path: "/" },
  { name: "JSON Viewer", path: "/json-viewer" },
  { name: "JWT Viewer", path: "/jwt-viewer" },
  { name: "Crypto Tools", path: "/crypto-tools" },
  { name: "GUID Generator", path: "/guid-generator" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b border-primary/20 bg-card/50 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex h-14 items-center space-x-4 lg:space-x-6">
          <div className="mr-6">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Dev Tools</h1>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative group",
                  location.pathname === tool.path
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {tool.name}
                {location.pathname === tool.path && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}