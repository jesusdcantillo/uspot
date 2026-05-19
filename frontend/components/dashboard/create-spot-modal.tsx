"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getCategories, type Category } from "@/lib/categories";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { ModalPortal } from "@/components/shared/modal-portal";

type CreateSpotModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateSpotModal({ open, onClose }: CreateSpotModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(open);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectingOnMap, setSelectingOnMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const { state } = useOnboarding();
  const mountedRef = useRef(false);

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

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    let active = true;

    void getCategories()
      .then((items) => {
        if (active) {
          setCategories(items);
        }
      })
      .catch(() => {
        if (active) {
          setCategories([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.type !== "uspot:map:selected") {
        return;
      }

      const nextLatitude = data.latitude;
      const nextLongitude = data.longitude;

      if (
        typeof nextLatitude === "number" &&
        typeof nextLongitude === "number"
      ) {
        setLatitude(nextLatitude);
        setLongitude(nextLongitude);
        setSelectingOnMap(false);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleChooseImages = useCallback((files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextImages = Array.from(files).slice(0, 6);
    const nextPreviews = nextImages.map((file) => URL.createObjectURL(file));

    setImages((current) => [...current, ...nextImages]);
    setPreviews((current) => [...current, ...nextPreviews]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((current) =>
      current.filter((_, currentIndex) => index !== currentIndex),
    );
    setPreviews((current) => {
      const next = current.filter((_, currentIndex) => index !== currentIndex);
      current.forEach((url, currentIndex) => {
        if (currentIndex === index) {
          URL.revokeObjectURL(url);
        }
      });
      return next;
    });
  }, []);

  const startMapSelection = useCallback(() => {
    setSelectingOnMap(true);

    const iframe = document.querySelector(
      'iframe[src^="/dashboard/map-panel"]',
    ) as HTMLIFrameElement | null;

    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "uspot:map:enable-selection" },
        "*",
      );
      return;
    }

    window.postMessage({ type: "uspot:map:enable-selection" }, "*");
  }, []);

  const validate = useCallback(() => {
    if (!title.trim()) {
      return "El título es requerido";
    }

    if (!description.trim()) {
      return "La descripción es requerida";
    }

    if (!selectedCategoryId) {
      return "Selecciona una categoría";
    }

    if (latitude === null || longitude === null) {
      return "Selecciona una ubicación en el mapa";
    }

    return null;
  }, [description, latitude, longitude, selectedCategoryId, title]);

  const handleSubmit = useCallback(async () => {
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));

      if (!mountedRef.current) {
        return;
      }

      setSuccessOpen(true);
      setTitle("");
      setDescription("");
      setSelectedCategoryId(null);
      setLatitude(null);
      setLongitude(null);
      setImages([]);
      setPreviews((current) => {
        current.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
    } catch {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }, [validate]);

  if (!isMounted) {
    return null;
  }

  return (
    <ModalPortal>
      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-[#191c1e]/35 p-4 backdrop-blur-md transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        role="presentation"
        onClick={onClose}
      >
        <div
          className={`relative z-[100] w-full max-w-[48rem] overflow-hidden rounded-[1.25rem] border border-white/40 bg-white/75 px-6 py-6 text-[#191c1e] shadow-[0_32px_72px_rgba(0,0,0,0.18)] backdrop-blur-[18px] transition-all duration-200 sm:px-8 sm:py-8 ${
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

          <div className="flex items-center justify-between">
            <div>
              <h2 id={titleId} className="text-lg font-bold">
                Crear Spot
              </h2>
              <p id={descriptionId} className="mt-1 text-sm text-[#6a7080]">
                Comparte un nuevo lugar en{" "}
                {state.selectedContextName ?? "el espacio activo"}. La comunidad
                verá tu spot en el mapa.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-[#6a7080]">Título</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Nombre del lugar"
                className="mt-2 h-12 w-full rounded-xl border border-[#d7deea] bg-white/80 px-4 text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#6a7080]">
                Descripción
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Cuenta por qué este lugar es interesante..."
                className="mt-2 h-32 w-full rounded-xl border border-[#d7deea] bg-white/80 px-4 py-3 text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-[#6a7080]">
                Categoría
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories === null ? (
                  <div className="text-sm text-[#6a7080]">
                    Cargando categorías...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-sm text-[#6a7080]">
                    No hay categorías
                  </div>
                ) : (
                  categories.map((category) => {
                    const selected = selectedCategoryId === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                          selected
                            ? "bg-[#004ac6] text-white"
                            : "border border-[#e6e9f0] bg-white text-[#434655]"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-[#6a7080]">
                Ubicación
              </span>
              <div className="mt-2 flex items-center gap-3">
                {latitude === null || longitude === null ? (
                  <div className="rounded-lg border border-dashed border-[#d7deea] bg-white/80 px-4 py-6 text-sm text-[#6a7080]">
                    {selectingOnMap
                      ? "Haz clic en el mapa"
                      : "Selecciona una ubicación en el mapa"}
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#d7deea] bg-white/80 px-4 py-3 text-sm text-[#191c1e]">
                    LAT: {latitude.toFixed(6)} • LNG: {longitude.toFixed(6)}
                  </div>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startMapSelection}
                    className="rounded-xl bg-[#004ac6] px-3 py-2 text-sm font-semibold text-white"
                  >
                    {selectingOnMap
                      ? "Esperando selección..."
                      : "Haz clic en el mapa"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-[#6a7080]">
                Imágenes
              </span>
              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d7deea] bg-white px-3 py-2 text-sm text-[#434655]">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) => handleChooseImages(event.target.files)}
                  />
                  Seleccionar
                </label>

                <span className="text-xs text-[#6a7080]">
                  {images.length} seleccionadas
                </span>

                <div className="flex gap-2">
                  {previews.map((url, index) => (
                    <div key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="h-20 w-28 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#d7deea] bg-white px-4 py-2 text-sm font-semibold text-[#434655]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white"
              >
                {loading ? "Publicando..." : "Publicar spot"}
              </button>
            </div>
          </div>

          {successOpen ? (
            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-white/90">
              <div className="max-w-sm rounded-xl border border-white/40 bg-white/90 px-6 py-8 text-center">
                <h3 className="text-lg font-bold text-[#004ac6]">
                  Spot publicado
                </h3>
                <p className="mt-2 text-sm text-[#6a7080]">
                  Tu spot ya aparece en el mapa y la comunidad podrá verlo.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessOpen(false);
                      onClose();
                    }}
                    className="rounded-xl bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Ver en el mapa
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ModalPortal>
  );
}
