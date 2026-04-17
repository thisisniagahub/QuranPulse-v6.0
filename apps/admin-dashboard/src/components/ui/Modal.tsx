"use client"

import React from "react"
import { X } from "lucide-react"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
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
    const titleId = React.useId()

    React.useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            <div className={`relative w-full ${sizeClasses[size]} animate-fade-in`}>
                <div className="glass-card overflow-hidden rounded-2xl">
                    <div className="flex items-center justify-between border-b border-border/70 bg-background/30 p-4">
                        <h3 id={titleId} className="text-lg font-semibold text-foreground">
                            {title}
                        </h3>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            aria-label="Close modal"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto p-4 text-sm text-muted-foreground">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex items-center justify-end gap-3 border-t border-border/70 bg-muted/20 p-4">
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
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="crud-form"
                        variant="default"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </>
            }
        >
            <form id="crud-form" onSubmit={handleSubmit} className="space-y-4 text-foreground">
                {children}
            </form>
        </Modal>
    )
}
