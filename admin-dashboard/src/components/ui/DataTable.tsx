'use client'

import React, { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, Plus } from 'lucide-react'
import type { CRUDColumn } from '@/types/crud'

interface DataTableProps<T> {
    data: T[]
    columns: CRUDColumn<T>[]
    loading?: boolean
    total?: number
    page?: number
    pageSize?: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (size: number) => void
    onRowClick?: (row: T) => void
    onEdit?: (row: T) => void
    onDelete?: (row: T) => void
    onCreate?: () => void
    searchPlaceholder?: string
    title?: string
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    loading = false,
    total = 0,
    page = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    onRowClick,
    onEdit,
    onDelete,
    onCreate,
    searchPlaceholder = 'Search...',
    title,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const totalPages = Math.ceil(total / pageSize)

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const renderCellValue = (column: CRUDColumn<T>, row: T) => {
        const value = (row as any)[column.key]

        if (column.render) {
            return column.render(value, row)
        }

        switch (column.type) {
            case 'badge':
                const option = column.options?.find(o => o.value === value)
                return (
                    <span className={`badge ${option?.color || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {option?.label || value}
                    </span>
                )
            case 'boolean':
                return (
                    <span className={`flex items-center gap-2 ${value ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        {value ? 'Yes' : 'No'}
                    </span>
                )
            case 'date':
                return value ? new Date(value).toLocaleDateString() : '-'
            case 'avatar':
                const initials = (row as any).full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            {initials.toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-slate-200">{(row as any).full_name || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{(row as any).email}</div>
                        </div>
                    </div>
                )
            default:
                return value ?? '-'
        }
    }

    return (
        <div className="glass-card rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-modern pl-10 w-64"
                        />
                    </div>
                </div>
                {onCreate && (
                    <button onClick={onCreate} className="btn-primary flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto">
                {loading && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    onClick={() => column.sortable && handleSort(String(column.key))}
                                    className={column.sortable ? 'cursor-pointer hover:text-white' : ''}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.label}
                                        {column.sortable && sortColumn === column.key && (
                                            sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th className="text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-12 text-slate-500">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row)}
                                    className={onRowClick ? 'cursor-pointer' : ''}
                                >
                                    {columns.map((column) => (
                                        <td key={String(column.key)}>
                                            {renderCellValue(column, row)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {onEdit && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-300"
                        aria-label="Rows per page"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(page - 1)}
                            disabled={page <= 1}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-300">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange?.(page + 1)}
                            disabled={page >= totalPages}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
