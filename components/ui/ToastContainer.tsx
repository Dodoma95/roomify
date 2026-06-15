// components/ui/ToastContainer.tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import { ToastCard } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto z-[200] flex flex-col gap-2"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
