"use client";

import { useEffect, useId, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

export type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onContinueAsGuest?: () => void;
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Field({
  label,
  type,
  placeholder,
  icon,
  inputProps,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="block space-y-1">
      <span className="ml-1 text-sm font-medium text-[#6a7080]">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8a90a0]">
          {icon}
        </span>
        <input
          {...inputProps}
          type={type}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[#d7deea] bg-white/80 pl-10 pr-3 text-[15px] text-[#191c1e] outline-none transition placeholder:text-[#a0a8b8] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
        />
      </div>
    </label>
  );
}

export function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
  onContinueAsGuest,
}: AuthModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(open);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = useCallback(async () => {
    if (!supabase) {
      setError("El servicio de autenticación no está disponible.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar con Google",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (open) {
      const frame = window.requestAnimationFrame(() => {
        setIsMounted(true);
        setIsVisible(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(false);
      timeoutId = window.setTimeout(() => {
        setIsMounted(false);
      }, 180);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [open]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose]);

  if (!isMounted) {
    return null;
  }

  const isLogin = mode === "login";
  const title = isLogin ? "Inicia sesión" : "Crea tu cuenta";
  const subtitle = isLogin
    ? "Inicia sesión para guardar favoritos y participar en la comunidad."
    : "Únete para guardar favoritos, crear spots y participar en tu comunidad.";
  const primaryLabel = isLogin ? "Iniciar sesión" : "Crear cuenta";
  const footerCopy = isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?";
  const footerAction = isLogin ? "Crear cuenta" : "Inicia sesión";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#191c1e]/35 p-4 backdrop-blur-md transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[30rem] overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/75 px-6 py-7 text-[#191c1e] shadow-[0_32px_72px_rgba(0,0,0,0.24)] backdrop-blur-[22px] transition-all duration-200 sm:px-8 sm:py-8 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[#6a7080] transition hover:bg-white hover:text-[#191c1e]"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[1.2rem] font-extrabold tracking-tighter text-[#004ac6]">
            USpot
          </span>
          <h2
            id={titleId}
            className="mt-4 text-[1.9rem] font-bold tracking-tight text-[#191c1e]"
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="mt-2 max-w-[22rem] text-sm leading-6 text-[#6a7080]"
          >
            {subtitle}
          </p>
        </div>

        <form
          className="mt-7 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            if (!supabase) {
              setError("El servicio de autenticación no está disponible.");
              return;
            }

            setLoading(true);
            try {
              if (isLogin) {
                const { error: signInError } =
                  await supabase.auth.signInWithPassword({
                    email,
                    password,
                  });

                if (signInError) {
                  setError(signInError.message);
                } else {
                  onClose();
                }
              } else {
                const { error: signUpError } = await supabase.auth.signUp({
                  email,
                  password,
                  options: { data: { username } },
                });

                if (signUpError) {
                  setError(signUpError.message);
                } else {
                  onClose();
                }
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {isLogin ? (
            <>
              <Field
                label="Email"
                type="email"
                placeholder="email@dominio.com"
                icon="✉"
                inputProps={{
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  autoComplete: "email",
                }}
              />
              <label className="block space-y-1">
                <div className="ml-1 flex items-center justify-between gap-3 text-sm font-medium text-[#6a7080]">
                  <span>Contraseña</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#004ac6] transition hover:text-[#2563eb]"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8a90a0]">
                    🔒
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 w-full rounded-xl border border-[#d7deea] bg-white/80 pl-10 pr-3 text-[15px] text-[#191c1e] outline-none transition placeholder:text-[#a0a8b8] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                  />
                </div>
              </label>
            </>
          ) : (
            <>
              <Field
                label="Nombre de usuario"
                type="text"
                placeholder="p. ej. user123"
                icon="👤"
                inputProps={{
                  value: username,
                  onChange: (e) => setUsername(e.target.value),
                  required: true,
                }}
              />
              <Field
                label="Correo electrónico"
                type="email"
                placeholder="email@dominio.com"
                icon="✉"
                inputProps={{
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  autoComplete: "email",
                }}
              />
              <Field
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                icon="🔒"
                inputProps={{
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                }}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Procesando..." : primaryLabel}
            {!isLogin ? <span aria-hidden="true">→</span> : null}
          </button>

          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d7deea]" />
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8a90a0]">
            o continúa con
          </span>
          <div className="h-px flex-1 bg-[#d7deea]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#d7deea] bg-white px-4 text-sm font-semibold text-[#191c1e] shadow-[0_8px_20px_rgba(25,28,30,0.04)] transition hover:bg-[#f2f4f6] disabled:opacity-60"
        >
          <GoogleMark />
          {loading ? "Iniciando..." : "Continuar con Google"}
        </button>

        {onContinueAsGuest ? (
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="mt-4 w-full text-center text-sm font-medium text-[#6a7080] transition hover:text-[#004ac6]"
          >
            Seguir como invitado
          </button>
        ) : null}

        <p className="mt-5 text-center text-sm text-[#6a7080]">
          {footerCopy}{" "}
          <button
            type="button"
            onClick={() => onModeChange(isLogin ? "register" : "login")}
            className="font-semibold text-[#004ac6] transition hover:text-[#2563eb]"
          >
            {footerAction}
          </button>
        </p>
      </div>
    </div>
  );
}
