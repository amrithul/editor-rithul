import { createFileRoute, Navigate, useRouter } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AdminLoginForm } from "@/components/admin-login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const router = useRouter();
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="relative grid min-h-screen place-items-center bg-canvas">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>
        <div className="h-40 w-full max-w-sm animate-pulse rounded-3xl bg-surface" />
      </main>
    );
  }
  if (user) return <Navigate to="/admin" />;
  return (
    <main className="relative grid min-h-screen place-items-center bg-canvas px-5 py-16">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <AdminLoginForm onSignedIn={() => void router.invalidate()} />
    </main>
  );
}
