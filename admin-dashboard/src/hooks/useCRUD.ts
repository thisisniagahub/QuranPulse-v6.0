'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { CRUDConfig, CRUDState, CRUDActions } from '@/types/crud'

export function useCRUD<T extends { id: string }>(
    config: CRUDConfig<T>
): CRUDState<T> & CRUDActions<T> {
    const [items, setItems] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const supabase = createClient()

    // Fetch items
    const refresh = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1

            let query = supabase
                .from(config.table)
                .select('*', { count: 'exact' })
                .range(from, to)

            // Apply default sort
            if (config.defaultSort) {
                query = query.order(
                    config.defaultSort.column as string,
                    { ascending: config.defaultSort.direction === 'asc' }
                )
            }

            const { data, error: fetchError, count } = await query

            if (fetchError) throw fetchError

            setItems((data as T[]) || [])
            setTotal(count || 0)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data')
            console.error('CRUD fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [config.table, page, pageSize, config.defaultSort, supabase])

    // Create item
    const create = useCallback(async (data: Partial<T>): Promise<T> => {
        const { data: created, error: createError } = await supabase
            .from(config.table)
            .insert(data)
            .select()
            .single()

        if (createError) throw createError

        await refresh()
        return created as T
    }, [config.table, supabase, refresh])

    // Update item
    const update = useCallback(async (id: string, data: Partial<T>): Promise<T> => {
        const primaryKey = (config.primaryKey as string) || 'id'

        const { data: updated, error: updateError } = await supabase
            .from(config.table)
            .update(data)
            .eq(primaryKey, id)
            .select()
            .single()

        if (updateError) throw updateError

        await refresh()
        return updated as T
    }, [config.table, config.primaryKey, supabase, refresh])

    // Delete item
    const deleteItem = useCallback(async (id: string): Promise<void> => {
        const primaryKey = (config.primaryKey as string) || 'id'

        const { error: deleteError } = await supabase
            .from(config.table)
            .delete()
            .eq(primaryKey, id)

        if (deleteError) throw deleteError

        await refresh()
    }, [config.table, config.primaryKey, supabase, refresh])

    // Initial fetch
    useEffect(() => {
        refresh()
    }, [refresh])

    return {
        items,
        loading,
        error,
        total,
        page,
        pageSize,
        create,
        update,
        delete: deleteItem,
        refresh,
        setPage,
        setPageSize,
    }
}

// Simplified hook for read-only tables
export function useReadOnly<T>(table: string) {
    return useCRUD<T & { id: string }>({
        table,
        displayName: table,
        displayNamePlural: table,
        columns: [],
        permissions: { create: false, update: false, delete: false, read: true }
    })
}
