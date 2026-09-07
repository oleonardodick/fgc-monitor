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
          "rounded-lg border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground",
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
