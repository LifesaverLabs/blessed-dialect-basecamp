import { NavLink } from "@/components/NavLink";
import { DialectToggle } from "@/components/DialectToggle";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, MessageSquare, Info, Keyboard, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const { user, isKalmiteeMember, signOut } = useAuth();

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
                to="/kb"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                activeClassName="text-primary font-medium"
              >
                <Keyboard className="w-4 h-4" />
                <span>KB</span>
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

              {isKalmiteeMember && (
                <span className="flex items-center gap-1 text-xs text-kalmitee font-medium">
                  <Shield className="w-3 h-3" /> BDLK
                </span>
              )}

              {user ? (
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <NavLink
                  to="/auth"
                  className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
