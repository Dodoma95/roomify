// components/ui/ToastContainer.tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import { ToastItem } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
