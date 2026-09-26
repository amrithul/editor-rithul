import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "admin@rithul.studio";
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";
const BEARER_KEY = "grok-auth.bearer-token";

function rememberToken(token: unknown) {
  if (typeof token !== "string" || !token) return;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

async function signInAdmin() {
  const signed = await authClient.signIn.email({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  rememberToken(
    signed.data && typeof signed.data === "object"
      ? (signed.data as { token?: string }).token
      : undefined,
  );
  return signed;
}

async function signUpAdmin() {
  const created = await authClient.signUp.email({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: "Admin",
  });
  rememberToken(
    created.data && typeof created.data === "object"
      ? (created.data as { token?: string }).token
      : undefined,
  );
  return created;
}

export function AdminLoginForm({ onSignedIn }: { onSignedIn?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const user = username.trim().toLowerCase();
    if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      setError("Those credentials don’t match the desk.");
      return;
    }
    setPending(true);
    try {
      const signed = await signInAdmin();
      if (signed.error) {
        const created = await signUpAdmin();
        if (created.error) {
          const retry = await signInAdmin();
          if (retry.error) {
            setError(retry.error.message || "Could not sign in.");
            return;
          }
        }
      }
      await authClient.getSession();
      onSignedIn?.();
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="cursor-native grid w-full max-w-sm gap-4 rounded-3xl border border-line bg-canvas p-8 shadow-[var(--shadow-soft)]"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] text-stone uppercase">
        Desk
      </p>
      <h1 className="font-display text-3xl text-ink italic">Sign in to add cuts.</h1>
      <label className="grid gap-2">
        <span className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
          Username
        </span>
        <input
          required
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
          Password
        </span>
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>
      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "mt-2 min-h-11 rounded-full bg-ink px-6 py-3 font-mono text-[11px] tracking-[0.18em] text-accent-fg uppercase",
          pending && "opacity-60",
        )}
      >
        {pending ? "Signing in…" : "Enter desk"}
      </button>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-ink outline-none focus:border-accent";
