import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, type Resolver, type UseFormProps, useForm } from "react-hook-form";
import type { z } from "zod";

/**
 * Hook genérico de formulários: combina `useForm` (react-hook-form) com
 * `zodResolver` (@hookform/resolvers) e um schema de
 * `packages/shared/src/schemas/`.
 *
 * Fica em `src/hooks/` (e não dentro de uma `feature/`) porque é genérico e
 * usado por várias features.
 *
 * - `register("campo")` registra campos tipados com `z.input<Schema>`.
 * - `handleSubmit(onSubmit)` entrega ao callback o valor já transformado
 *   (`z.output<Schema>` — ex.: strings com `.trim()` aplicado).
 * - Por padrão valida no submit (`mode: "onSubmit"`) e revalida a cada
 *   mudança após o primeiro submit (`reValidateMode: "onChange"`), limpando o
 *   erro dos campos enquanto o usuário digita.
 */
export function useZodForm<Schema extends z.ZodType<unknown, FieldValues>>(
  schema: Schema,
  options?: Omit<UseFormProps<z.input<Schema>, unknown, z.output<Schema>>, "resolver">,
) {
  return useForm<z.input<Schema>, unknown, z.output<Schema>>({
    // zodResolver já valida schemas Zod 4; o cast alinha apenas os tipos
    // genéricos do resolver com os de `useForm` (o valor em runtime é o mesmo).
    resolver: zodResolver(schema) as unknown as Resolver<
      z.input<Schema>,
      unknown,
      z.output<Schema>
    >,
    reValidateMode: "onChange",
    ...options,
  });
}
