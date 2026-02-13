import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/forum");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName || undefined);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Chek your email to konfirm your akcount!");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welkome back!");
        navigate("/forum");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{isSignUp ? "Join the Kalmunity⁵" : "Welkome Back"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Kreate an akcount to author proposals and serve on the BDLK"
              : "Sign in to your Blesséd akcount"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name (optional)</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="kalmunity_member"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait…" : isSignUp ? "Kreate Akcount" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {isSignUp ? "Already have an akcount? Sign in" : "Need an akcount? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
