import * as React from "react";
import { cn } from "../utils/merge";

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      isLoading = false,
      loadingText,
      children,
      disabled,
      type,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          "w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {isLoading && loadingText ? loadingText : children}
      </button>
    );
  },
);

export type { ButtonVariant };
export { Button };
