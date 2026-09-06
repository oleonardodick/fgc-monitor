import * as React from "react";
import { useId } from "react";
import { cn } from "../utils/merge";
import { Input } from "./Input";
import { Label } from "./Label";

export type FormFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  id?: string;
};

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? `field-${generatedId}`;
    const errorId = `${fieldId}-error`;
    const hasError = Boolean(error);

    return (
      <div>
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          ref={ref}
          id={fieldId}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-700 focus:ring-emerald-500",
            className,
          )}
          {...props}
        />
        {hasError && (
          <p id={errorId} className="mt-1 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export { FormField };
