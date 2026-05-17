"use client";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
};

export function LoginModal({
  open,
  onClose,
  onContinueAsGuest,
}: LoginModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#191c1e]/40 px-5 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(25,28,30,0.2)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="inline-flex rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#004ac6]">
            Inicio diferido
          </div>

          <div>
            <h2
              id="login-modal-title"
              className="text-2xl font-bold text-[#191c1e]"
            >
              Inicia sesión para guardar tu avance
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#434655]">
              La autenticación real se conecta después. Por ahora puedes cerrar
              esta ventana y entrar como invitado sin perder tu onboarding.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#004ac6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
            >
              Continuar como invitado
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#c3c6d7] bg-white px-5 py-3 text-sm font-semibold text-[#191c1e] transition hover:bg-[#f6f8ff]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
