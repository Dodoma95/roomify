// components/ui/Toast.tsx
"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ToastItem, ToastType, useToastStore } from "@/store/toastStore";

const SUCCESS_DURATION = 4000;

const CONFIG: Record<ToastType, { Icon: typeof CheckCircle2; color: string; bar: string }> = {
  success: { Icon: CheckCircle2, color: "#008A05", bar: "#008A05" },
  error:   { Icon: AlertCircle,  color: "#c13515", bar: "#c13515" },
};

export function ToastCard({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { Icon, color, bar } = CONFIG[toast.type];

  useEffect(() => {
    if (toast.type !== "success") return;
    const timer = setTimeout(() => removeToast(toast.id), SUCCESS_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 64 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 64 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-80 bg-white rounded-xl overflow-hidden"
      style={{
        borderLeft: `4px solid ${bar}`,
        boxShadow:
          "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
        <p className="flex-1 text-[14px] font-medium text-[#222222] leading-snug line-clamp-3">
          {toast.message}
        </p>
        <button
          type="button"
          onClick={() => removeToast(toast.id)}
          className="shrink-0 text-[#929292] hover:text-[#222222] transition-colors duration-150 cursor-pointer"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
