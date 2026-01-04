'use client'

import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    footer?: React.ReactNode
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
}: ModalProps) {
    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full ${sizeClasses[size]} mx-4 animate-fade-in`}>
                <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800/50 bg-slate-900/30">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Form Modal specific wrapper
interface FormModalProps<T> {
    isOpen: boolean
    onClose: () => void
    title: string
    onSubmit: (data: Partial<T>) => Promise<void>
    initialData?: Partial<T>
    loading?: boolean
    children: React.ReactNode
}

export function FormModal<T>({
    isOpen,
    onClose,
    title,
    onSubmit,
    loading = false,
    children,
}: FormModalProps<T>) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) as Partial<T>
        await onSubmit(data)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-ghost"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="crud-form"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </>
            }
        >
            <form id="crud-form" onSubmit={handleSubmit} className="space-y-4">
                {children}
            </form>
        </Modal>
    )
}
