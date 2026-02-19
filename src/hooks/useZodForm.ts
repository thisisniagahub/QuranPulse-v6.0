/**
 * useZodForm Hook
 * 
 * QuranPulse v6.0 Form Infrastructure
 * Convenience wrapper for react-hook-form with Zod validation
 */

import { useForm, UseFormProps, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * useZodForm - Pre-configured useForm with Zod resolver
 * 
 * @example
 * const form = useZodForm({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '' }
 * });
 * 
 * <form onSubmit={form.handleSubmit(onSubmit)}>
 *   <FormField name="email" register={form.register} error={form.formState.errors.email} />
 * </form>
 */
export function useZodForm<TSchema extends z.ZodType<any, any, any>>(
    props: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'> & {
        schema: TSchema;
    }
) {
    const { schema, ...formProps } = props;

    return useForm<z.infer<TSchema>>({
        ...formProps,
        resolver: zodResolver(schema) as any,
    });
}

/**
 * Common form configurations
 */
export const formConfig = {
    // Debounce delay for real-time validation
    validationDelay: 300,

    // Error display modes
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
};

/**
 * Type helper for extracting form data type from schema
 */
export type InferFormData<T extends z.ZodType<any, any, any>> = z.infer<T>;

export default useZodForm;
