import type { LucideIcon } from "lucide-react";
import { type ChangeEvent, useId, useRef } from "react";
import { Button } from "./Button";
import { FormField, type FormFieldProps } from "./FormField";

export interface FileFieldProps extends Pick<FormFieldProps, "label" | "disabled"> {
  /** Mensagem de erro exibida junto ao campo. */
  error?: string | null;
  /** Padrão `accept` do `<input type="file">` (ex.: "image/png,image/jpeg"). */
  accept?: string;
  /** Texto do botão que abre o seletor nativo de arquivos. */
  buttonLabel: string;
  /** Ícone exibido dentro do botão (lucide-react). */
  buttonIcon?: LucideIcon;
  /** Nome do campo (para integração com bibliotecas de formulário). */
  name?: string;
  /** Chamado quando um arquivo é selecionado. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Campo de arquivo construído sobre o `FormField`: label, input de arquivo
 * oculto (acessível) e mensagem de erro são herdados do `FormField`; um botão
 * visível abre o seletor nativo de arquivos do navegador.
 */
export function FileField({
  label,
  error,
  accept,
  buttonLabel,
  buttonIcon: ButtonIcon,
  name,
  disabled,
  onChange,
}: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const generatedId = useId();
  const fieldId = `file-${generatedId}`;

  return (
    <div>
      <FormField
        ref={inputRef}
        id={fieldId}
        label={label}
        type="file"
        accept={accept}
        name={name}
        disabled={disabled}
        error={error ?? undefined}
        onChange={onChange}
        className="sr-only"
      />
      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <span className="inline-flex items-center gap-2">
          {ButtonIcon && <ButtonIcon aria-hidden="true" className="h-4 w-4" />}
          {buttonLabel}
        </span>
      </Button>
    </div>
  );
}
