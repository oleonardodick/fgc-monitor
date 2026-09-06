import * as React from "react";
import { cn } from "../utils/merge";

const FormError = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export { FormError };
