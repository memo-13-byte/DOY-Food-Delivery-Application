import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles = [],
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return (
      <Route path={path}>
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Erişim Reddedildi</h1>
          <p>Bu sayfayı görüntülemek için gerekli izinlere sahip değilsiniz.</p>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}