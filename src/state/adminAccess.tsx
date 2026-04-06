import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminAccessContextValue {
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "studionail-admin-session";
const FALLBACK_PASSCODE = "Admin@123";
const ADMIN_PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE ?? FALLBACK_PASSCODE).trim();

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

function readInitialSession() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(STORAGE_KEY) === "granted";
}

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readInitialSession());

  function login(passcode: string) {
    const isValid = passcode.trim() === ADMIN_PASSCODE;

    if (!isValid) {
      return false;
    }

    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "granted");
    }

    return true;
  }

  function logout() {
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <AdminAccessContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAccessContext.Provider>
  );
}

export function useAdminAccess() {
  const context = useContext(AdminAccessContext);

  if (!context) {
    throw new Error("useAdminAccess must be used within an AdminAccessProvider");
  }

  return context;
}
