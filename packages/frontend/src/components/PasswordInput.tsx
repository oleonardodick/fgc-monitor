import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormField, type FormFieldProps } from "./FormField";

export type PasswordInputProps = Omit<
  FormFieldProps,
  "type" | "icon" | "iconPosition" | "iconAction"
>;

/**
 * Campo de senha com ícone de mostrar/ocultar o valor.
 * O ícone é trocado entre `Eye` e `EyeOff` (lucide-react) e a ação
 * é executada ao clicar nele.
 */
export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible((current) => !current);
  const labelText = isVisible ? "Ocultar senha" : "Mostrar senha";
  const type = isVisible ? "text" : "password";

  return (
    <FormField
      {...props}
      type={type}
      icon={isVisible ? EyeOff : Eye}
      iconPosition="right"
      iconAction={{
        onClick: toggle,
        label: labelText,
        pressed: isVisible,
      }}
    />
  );
}
