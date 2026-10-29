"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { createContext, useContext, useState } from "react";

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastContext = createContext<{ notify: (message: string, kind?: Toast["kind"]) => void }>({ notify: () => undefined });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = (message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now(); setToasts((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200);
  };
  return <ToastContext.Provider value={{ notify }}>{children}<div className="fixed right-5 top-5 z-50 w-[min(360px,calc(100vw-40px))] space-y-2"><AnimatePresence>{toasts.map((toast) => <motion.div key={toast.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="glass flex gap-3 rounded-xl p-3 text-sm shadow-2xl"><span className={toast.kind === "success" ? "text-emerald-400" : "text-rose-400"}>{toast.kind === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</span>{toast.message}</motion.div>)}</AnimatePresence></div></ToastContext.Provider>;
}
