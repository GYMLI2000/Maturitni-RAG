"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Bottom sheet (mobile): thick glass, slides up with a bounce-free spring. Native <dialog> handles focus and Esc. */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const d = ref.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[#0b0d1433]"
    >
      <AnimatePresence onExitComplete={() => ref.current?.close()}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="glass-thick absolute inset-x-2 bottom-2 flex max-h-[82dvh] flex-col overflow-hidden rounded-[28px] pb-[env(safe-area-inset-bottom)]"
          >
            <span aria-hidden className="mx-auto mt-2 h-[5px] w-9 shrink-0 rounded-full bg-strong" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
