import { useState, type FormEvent } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useAdminAccess } from "@/state/adminAccess";

export function AdminAccessPage() {
  const { login } = useAdminAccess();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = login(passcode);

    if (isValid) {
      setError("");
      setPasscode("");
      return;
    }

    setError("The passcode is not correct.");
  }

  return (
    <main className="page-shell flex min-h-[calc(100vh-4.5rem)] items-center py-8">
      <section className="surface-panel mx-auto w-full max-w-md rounded-[2rem] px-5 py-6 sm:px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand/80">
          Private admin
        </p>
        <h1 className="editorial-text mt-2 text-[2rem] font-black leading-[0.94] text-brand-ink">
          Owner access only.
        </h1>
        <p className="mt-3 text-sm leading-7 text-secondary">
          Enter your admin passcode to manage stock, products, and orders. This keeps the dashboard out of the public
          storefront flow.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-secondary">Passcode</span>
            <div className="flex items-center gap-3 rounded-[1.25rem] border border-outline-soft bg-white/85 px-4 py-3">
              <LockKeyhole className="h-4 w-4 text-brand" />
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Enter admin passcode"
                className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-secondary"
              />
            </div>
          </label>

          {error ? <p className="text-sm font-semibold text-brand">{error}</p> : null}

          <button
            type="submit"
            className="cta-gradient flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white"
          >
            Unlock dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
