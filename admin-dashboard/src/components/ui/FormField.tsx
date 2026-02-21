'use client'

import React from 'react'

interface FormFieldProps {
    name: string
    label: string
    type?: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox'
    placeholder?: string
    required?: boolean
    defaultValue?: any
    options?: { value: string; label: string }[]
    disabled?: boolean
    className?: string
}

export function FormField({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
    defaultValue,
    options,
    disabled = false,
    className = '',
}: FormFieldProps) {
    const baseInputClass = "input-modern w-full"

    if (type === 'select' && options) {
        return (
            <div className={className}>
                <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1.5">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    required={required}
                    disabled={disabled}
                    className={baseInputClass}
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    if (type === 'textarea') {
        return (
            <div className={className}>
                <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1.5">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    required={required}
                    disabled={disabled}
                    rows={4}
                    className={baseInputClass}
                />
            </div>
        )
    }

    if (type === 'checkbox') {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    defaultChecked={defaultValue}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-raudhah-teal focus:ring-raudhah-teal/50"
                />
                <label htmlFor={name} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            </div>
        )
    }

    return (
        <div className={className}>
            <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                required={required}
                disabled={disabled}
                className={baseInputClass}
            />
        </div>
    )
}

// Quick helper for common field patterns
export const FormFields = {
    Text: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="text" />,
    Email: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="email" />,
    Number: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="number" />,
    Select: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="select" />,
    Textarea: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="textarea" />,
    Date: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="date" />,
    Checkbox: (props: Omit<FormFieldProps, 'type'>) => <FormField {...props} type="checkbox" />,
}
