import { NavLink } from "@/components/NavLink";
import { DialectToggle } from "@/components/DialectToggle";
import { BookOpen, MessageSquare, Info } from "lucide-react";

export const Navigation = () => {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
        🚧 Work in Progress — Blesséd Dialect is experimental, evolving, and incompletely documented (incalmpleatly
        documentéd)
      </div>
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="font-serif">Blesséd Dialect</span>
            </NavLink>

            <div className="flex items-center gap-6">
              <NavLink
                to="/dictionary"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                activeClassName="text-primary font-medium"
              >
                <BookOpen className="w-4 h-4" />
                <span>Dictionary</span>
              </NavLink>

              <NavLink
                to="/forum"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                activeClassName="text-primary font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Forum</span>
              </NavLink>

              <NavLink
                to="/about"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                activeClassName="text-primary font-medium"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </NavLink>

              <DialectToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
