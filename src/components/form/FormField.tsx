/**
 * FormField Component
 * 
 * QuranPulse v6.0 Form Infrastructure
 * Integrates react-hook-form with Input/Textarea components
 */

import React from 'react';
import { UseFormRegister, FieldError, Path, FieldValues } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { cn } from '../../lib/utils';

// ============================================
// FormField - Generic Form Input Wrapper
// ============================================

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    className?: string;
    autoComplete?: string;
}

export function FormField<T extends FieldValues>({
    name,
    label,
    register,
    error,
    type = 'text',
    placeholder,
    disabled,
    helperText,
    className,
    autoComplete,
}: FormFieldProps<T>) {
    return (
        <Input
            {...register(name)}
            type={type}
            label={label}
            placeholder={placeholder}
            error={error?.message}
            disabled={disabled}
            autoComplete={autoComplete}
            className={className}
        />
    );
}

// ============================================
// FormTextarea - Textarea with react-hook-form
// ============================================

interface FormTextareaProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
    maxLength?: number;
    helperText?: string;
    className?: string;
}

export function FormTextarea<T extends FieldValues>({
    name,
    label,
    register,
    error,
    placeholder,
    disabled,
    rows = 4,
    maxLength,
    helperText,
    className,
}: FormTextareaProps<T>) {
    return (
        <Textarea
            {...register(name)}
            label={label}
            placeholder={placeholder}
            error={error?.message}
            helperText={helperText}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={className}
        />
    );
}

// ============================================
// FormError - Display form-level errors
// ============================================

interface FormErrorProps {
    message?: string;
    className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-center gap-2 p-3 rounded-lg',
                'bg-red-500/10 border border-red-500/30',
                'text-red-400 text-sm',
                className
            )}
            role="alert"
        >
            <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{message}</span>
        </div>
    );
}

// ============================================
// FormSuccess - Display success messages
// ============================================

interface FormSuccessProps {
    message?: string;
    className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-center gap-2 p-3 rounded-lg',
                'bg-emerald-500/10 border border-emerald-500/30',
                'text-emerald-400 text-sm',
                className
            )}
            role="status"
        >
            <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{message}</span>
        </div>
    );
}

// ============================================
// FormActions - Form button container
// ============================================

interface FormActionsProps {
    children: React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div className={cn('flex items-center gap-3 pt-4', alignClasses[align], className)}>
            {children}
        </div>
    );
}
