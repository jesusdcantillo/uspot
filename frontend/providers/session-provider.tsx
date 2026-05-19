"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { setAuthAccessToken } from "@/lib/session-token";

export type SessionStatus = "loading" | "guest" | "authenticated";

export interface SessionContextValue {
  status: SessionStatus;
  session: Session | null;
  accessToken: string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>(
    supabase ? "loading" : "guest",
  );
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const applySession = useCallback((nextSession: Session | null) => {
    setAuthAccessToken(nextSession?.access_token ?? null);

    setSession((currentSession) => {
      if (currentSession?.access_token === nextSession?.access_token) {
        return currentSession;
      }

      return nextSession;
    });

    setAccessToken((currentToken) => {
      const nextToken = nextSession?.access_token ?? null;

      if (currentToken === nextToken) {
        return currentToken;
      }

      return nextToken;
    });

    setStatus((currentStatus) => {
      const nextStatus: SessionStatus = nextSession ? "authenticated" : "guest";

      return currentStatus === nextStatus ? currentStatus : nextStatus;
    });
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    void (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      const currentSession = error ? null : (data.session ?? null);

      applySession(currentSession);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      session,
      accessToken,
    }),
    [accessToken, session, status],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }

  return context;
}
