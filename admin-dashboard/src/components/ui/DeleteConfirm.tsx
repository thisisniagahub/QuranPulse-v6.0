'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface DeleteConfirmProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    title?: string
    message?: string
    itemName?: string
    loading?: boolean
}

export function DeleteConfirm({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message,
    itemName,
    loading = false,
}: DeleteConfirmProps) {
    const handleConfirm = async () => {
        await onConfirm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="btn-ghost"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-500/10">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                    <p className="text-slate-200 mb-2">
                        {message || `Are you sure you want to delete this item?`}
                    </p>
                    {itemName && (
                        <p className="text-sm text-slate-400">
                            Item: <span className="text-white font-medium">{itemName}</span>
                        </p>
                    )}
                    <p className="text-xs text-red-400 mt-3">
                        This action cannot be undone.
                    </p>
                </div>
            </div>
        </Modal>
    )
}
