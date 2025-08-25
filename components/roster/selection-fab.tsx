"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, X } from "lucide-react";

export interface FABProps {
  selectedCount: number;
  onProceed: () => void;
  onClear: () => void;
  isVisible: boolean;
  className?: string;
}

export default function SelectionFab({
  selectedCount,
  onProceed,
  onClear,
  isVisible,
  className,
}: FABProps) {
  const disabled = selectedCount <= 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={onClear}
              className="shadow-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <div className="relative">
              <Button
                size="lg"
                className="shadow-lg pr-10"
                onClick={onProceed}
                disabled={disabled}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Swap Request
              </Button>
              <span
                aria-live="polite"
                className={cn(
                  "absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold h-6 min-w-6 px-1 shadow-md",
                  disabled && "bg-muted text-muted-foreground"
                )}
              >
                {selectedCount}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
