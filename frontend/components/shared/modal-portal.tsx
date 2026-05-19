"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export function getModalRoot() {
  if (typeof document === "undefined") {
    return null;
  }

  const rootId = "uspot-modal-root";
  let root = document.getElementById(rootId);

  if (!root) {
    root = document.createElement("div");
    root.id = rootId;
    document.body.appendChild(root);
  }

  return root;
}

type ModalPortalProps = {
  children: ReactNode;
};

export function ModalPortal({ children }: ModalPortalProps) {
  const root = getModalRoot();

  if (!root) {
    return null;
  }

  return createPortal(children, root);
}
