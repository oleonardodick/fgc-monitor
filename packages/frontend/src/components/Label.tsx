import * as React from "react";
import { cn } from "../utils/merge";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, children, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-secondary-foreground mb-1", className)}
      {...props}
    >
      {children}
    </label>
  ),
);

export { Label };
