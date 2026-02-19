// CRUD Types for Admin Dashboard
// Generic, scalable type definitions for all entities

export interface CRUDColumn<T> {
    key: keyof T | string
    label: string
    type: 'text' | 'email' | 'number' | 'select' | 'date' | 'boolean' | 'badge' | 'avatar'
    sortable?: boolean
    filterable?: boolean
    editable?: boolean
    options?: { value: string; label: string; color?: string }[]
    render?: (value: any, row: T) => React.ReactNode
}

export interface CRUDConfig<T> {
    table: string
    schema?: string
    primaryKey?: keyof T
    displayName: string
    displayNamePlural: string
    columns: CRUDColumn<T>[]
    searchableColumns?: (keyof T)[]
    defaultSort?: { column: keyof T; direction: 'asc' | 'desc' }
    permissions?: {
        create?: boolean
        read?: boolean
        update?: boolean
        delete?: boolean
    }
}

export interface CRUDState<T> {
    items: T[]
    loading: boolean
    error: string | null
    total: number
    page: number
    pageSize: number
}

export interface CRUDActions<T> {
    create: (data: Partial<T>) => Promise<T>
    update: (id: string, data: Partial<T>) => Promise<T>
    delete: (id: string) => Promise<void>
    refresh: () => Promise<void>
    setPage: (page: number) => void
    setPageSize: (size: number) => void
}

// User Types
export interface User {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'admin' | 'moderator' | 'user'
    subscription_tier: 'FREE' | 'PRO' | 'FAMILY'
    is_active: boolean
    created_at: string
    updated_at: string
    last_sign_in_at: string | null
}

// Content Types
export interface Banner {
    id: string
    image_url: string
    link_url: string | null
    title: string
    description: string | null
    active: boolean
    start_date: string | null
    end_date: string | null
    created_at: string
}

export interface KnowledgeBase {
    id: string
    title: string
    content: string
    source: string
    category: 'fatwa' | 'hadith' | 'fiqh' | 'general'
    embedding: number[] | null
    created_at: string
}

// Finance Types
export interface Transaction {
    id: string
    user_id: string
    type: 'subscription' | 'infaq' | 'refund'
    amount: number
    currency: string
    status: 'pending' | 'success' | 'failed' | 'refunded'
    provider: 'toyyibpay' | 'stripe'
    metadata: Record<string, any>
    created_at: string
}

// AI Types
export interface FlaggedChat {
    id: string
    conversation_id: string
    user_id: string
    trigger: string
    snippet: string
    severity: 'high' | 'medium' | 'low'
    status: 'pending' | 'approved' | 'rejected' | 'trained'
    reviewed_by: string | null
    reviewed_at: string | null
    created_at: string
}

// Iqra Types
export interface IqraLesson {
    id: string
    volume: number
    page: number
    line: number
    arabic_text: string
    transliteration: string
    audio_url: string | null
    status: 'pending' | 'validated' | 'live'
    validated_by: string | null
    created_at: string
}
