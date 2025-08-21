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
    <nav className="border-b bg-background">
      <div className="container">
        <div className="flex h-14 items-center space-x-4 lg:space-x-6">
          <div className="mr-6">
            <h1 className="text-lg font-semibold">Text Tools</h1>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === tool.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}