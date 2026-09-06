import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/merge";

/**
 * Tipo de ação exibida no ícone. Se fornecida, o ícone é renderizado
 * como botão; caso contrário, fica apenas decorativo.
 */
export type InputIconAction = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  pressed?: boolean;
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Ícone exibido dentro do input. Quando fornecido, é renderizado
   * decorativamente à esquerda do texto (a menos que `iconPosition` seja
   * definido como `"right"`). Aceita qualquer componente de ícone do
   * `lucide-react`.
   */
  icon?: LucideIcon;
  /**
   * Posição do ícone. Padrão: `"left"`.
   */
  iconPosition?: "left" | "right";
  /**
   * Ação executada ao clicar no ícone. Quando presente, o ícone é
   * renderizado como botão acessível. Quando ausente, o ícone é
   * apenas decorativo.
   */
  iconAction?: InputIconAction;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = "left", iconAction, disabled, ...props }, ref) => {
    const hasIcon = icon !== undefined;
    const isLeft = hasIcon && iconPosition === "left";
    const isRight = hasIcon && iconPosition === "right";

    const paddingClass = isLeft ? "pl-11" : isRight ? "pr-11" : null;

    const renderIcon = () => {
      if (!icon) return null;
      const IconComponent = icon;
      const iconClasses = "h-4 w-4 text-slate-400";

      if (iconAction) {
        return (
          <button
            type="button"
            onClick={iconAction.onClick}
            aria-label={iconAction.label}
            aria-pressed={iconAction.pressed}
            title={iconAction.label}
            tabIndex={-1}
            disabled={disabled}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              "text-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <IconComponent aria-hidden="true" className={iconClasses} />
          </button>
        );
      }

      return (
        <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center">
          <IconComponent className={iconClasses} />
        </span>
      );
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            paddingClass,
            className,
          )}
          {...props}
        />
        {hasIcon && (
          <div
            className={cn(
              "absolute inset-y-0 flex items-center",
              isLeft ? "left-0 pl-2" : "right-0 pr-2",
            )}
          >
            {renderIcon()}
          </div>
        )}
      </div>
    );
  },
);

export { Input };
