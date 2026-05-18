export type FetchFailureKind = "timeout" | "network" | "server";

export class UspotFetchError extends Error {
  kind: FetchFailureKind;
  status?: number;

  constructor(
    message: string,
    kind: FetchFailureKind,
    options?: { status?: number; cause?: unknown },
  ) {
    super(message);
    this.name = "UspotFetchError";
    this.kind = kind;
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

type FetchWithTimeoutOptions = RequestInit & {
  timeoutMs?: number;
};

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeoutMs = 15000, signal, ...requestInit } = options;
  const controller = new AbortController();
  let timedOut = false;

  const timeoutHandle = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const forwardAbort = () => {
    controller.abort(signal?.reason);
  };

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener("abort", forwardAbort, { once: true });
    }
  }

  try {
    return await fetch(input, {
      ...requestInit,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new UspotFetchError(
        "La solicitud tardó demasiado en responder.",
        "timeout",
        { cause: error },
      );
    }

    if (error instanceof TypeError) {
      throw new UspotFetchError("No pudimos conectar con la red.", "network", {
        cause: error,
      });
    }

    throw error;
  } finally {
    globalThis.clearTimeout(timeoutHandle);

    if (signal) {
      signal.removeEventListener("abort", forwardAbort);
    }
  }
}

export function getFetchErrorCopy(error: unknown, fallback: string) {
  if (error instanceof UspotFetchError) {
    if (error.kind === "timeout") {
      return "La solicitud tardó demasiado. Revisa tu conexión e inténtalo nuevamente.";
    }

    if (error.kind === "network") {
      return "Revisa tu conexión a internet e inténtalo nuevamente.";
    }

    return error.status
      ? `La API respondió con un error temporal (${error.status}). Inténtalo nuevamente.`
      : "La API respondió con un error temporal. Inténtalo nuevamente.";
  }

  return fallback;
}
