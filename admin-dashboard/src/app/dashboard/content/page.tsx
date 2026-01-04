'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Image, FileText, Database, RefreshCw, Plus, ExternalLink,
    CheckCircle2, Clock, AlertCircle, Upload, Trash2
} from 'lucide-react'
import { DataTable, Modal, FormModal, DeleteConfirm, FormField } from '@/components/ui'
import {
    getBanners, createBanner, updateBanner, deleteBanner, toggleBannerActive,
    getKnowledgeBase, createKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry,
    getDataSources, triggerSync
} from '@/actions/content'
import type { Banner, KnowledgeBase, CRUDColumn } from '@/types/crud'

const bannerColumns: CRUDColumn<Banner>[] = [
    {
        key: 'title',
        label: 'Banner',
        type: 'text',
        sortable: true,
        render: (value, row) => (
            <div className="flex items-center gap-3">
                <div className="w-16 h-10 rounded bg-slate-700 flex items-center justify-center overflow-hidden">
                    {row.image_url ? (
                        <img src={row.image_url} alt={value} className="w-full h-full object-cover" />
                    ) : (
                        <Image className="h-5 w-5 text-slate-500" />
                    )}
                </div>
                <div>
                    <div className="font-medium text-slate-200">{value}</div>
                    <div className="text-xs text-slate-500 truncate max-w-48">{row.link_url || 'No link'}</div>
                </div>
            </div>
        )
    },
    { key: 'active', label: 'Status', type: 'boolean', sortable: true },
    { key: 'start_date', label: 'Start', type: 'date', sortable: true },
    { key: 'end_date', label: 'End', type: 'date', sortable: true },
]

const kbColumns: CRUDColumn<KnowledgeBase>[] = [
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    {
        key: 'category',
        label: 'Category',
        type: 'badge',
        options: [
            { value: 'fatwa', label: 'Fatwa', color: 'badge-warning' },
            { value: 'hadith', label: 'Hadith', color: 'badge-info' },
            { value: 'fiqh', label: 'Fiqh', color: 'badge-success' },
            { value: 'general', label: 'General', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
        ]
    },
    { key: 'source', label: 'Source', type: 'text' },
    { key: 'created_at', label: 'Added', type: 'date', sortable: true },
]

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<'banners' | 'knowledge' | 'sync'>('sync')

    // Banners state
    const [banners, setBanners] = useState<Banner[]>([])
    const [bannersLoading, setBannersLoading] = useState(true)
    const [bannersTotal, setBannersTotal] = useState(0)

    // Knowledge Base state
    const [kbItems, setKbItems] = useState<KnowledgeBase[]>([])
    const [kbLoading, setKbLoading] = useState(true)
    const [kbTotal, setKbTotal] = useState(0)

    // Data Sources state
    const [dataSources, setDataSources] = useState<any[]>([])

    // Modal states
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
    const [isKbModalOpen, setIsKbModalOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [deleteType, setDeleteType] = useState<'banner' | 'kb'>('banner')
    const [isEditing, setIsEditing] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchBanners = useCallback(async () => {
        setBannersLoading(true)
        try {
            const data = await getBanners()
            setBanners(data.banners)
            setBannersTotal(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch banners')
        } finally {
            setBannersLoading(false)
        }
    }, [])

    const fetchKnowledgeBase = useCallback(async () => {
        setKbLoading(true)
        try {
            const data = await getKnowledgeBase()
            setKbItems(data.items)
            setKbTotal(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch knowledge base')
        } finally {
            setKbLoading(false)
        }
    }, [])

    const fetchDataSources = useCallback(async () => {
        try {
            const data = await getDataSources()
            setDataSources(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data sources')
        }
    }, [])

    useEffect(() => {
        fetchBanners()
        fetchKnowledgeBase()
        fetchDataSources()
    }, [fetchBanners, fetchKnowledgeBase, fetchDataSources])

    const handleBannerSubmit = async (data: Partial<Banner>) => {
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })

            if (isEditing && selectedItem) {
                await updateBanner(selectedItem.id, formData)
            } else {
                await createBanner(formData)
            }

            setIsBannerModalOpen(false)
            setSelectedItem(null)
            setIsEditing(false)
            fetchBanners()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save banner')
        } finally {
            setActionLoading(false)
        }
    }

    const handleKbSubmit = async (data: Partial<KnowledgeBase>) => {
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })

            if (isEditing && selectedItem) {
                await updateKnowledgeEntry(selectedItem.id, formData)
            } else {
                await createKnowledgeEntry(formData)
            }

            setIsKbModalOpen(false)
            setSelectedItem(null)
            setIsEditing(false)
            fetchKnowledgeBase()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save entry')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedItem) return
        setActionLoading(true)
        try {
            if (deleteType === 'banner') {
                await deleteBanner(selectedItem.id)
                fetchBanners()
            } else {
                await deleteKnowledgeEntry(selectedItem.id)
                fetchKnowledgeBase()
            }
            setIsDeleteOpen(false)
            setSelectedItem(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setActionLoading(false)
        }
    }

    const handleSync = async (source: string) => {
        try {
            await triggerSync(source)
            fetchDataSources()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to trigger sync')
        }
    }

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Content Operations</h2>
                    <p className="text-slate-400 mt-1">Manage banners, knowledge base, and data synchronization</p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-red-400 border-red-500/30">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-300">×</button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-800/50 pb-4">
                {[
                    { id: 'sync', label: 'Data Sources', icon: Database },
                    { id: 'banners', label: 'Banners', icon: Image },
                    { id: 'knowledge', label: 'Knowledge Base', icon: FileText },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Data Sources Tab */}
            {activeTab === 'sync' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid gap-4 md:grid-cols-2">
                        {dataSources.map((source, i) => (
                            <div key={i} className="glass-card rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${source.status === 'synced' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                                            }`}>
                                            {source.status === 'synced' ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-amber-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-200">{source.name}</h4>
                                            <p className="text-xs text-slate-500">
                                                {source.lastSync ? `Last sync: ${new Date(source.lastSync).toLocaleDateString()}` : 'Never synced'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSync(source.name)}
                                        className="btn-ghost text-xs flex items-center gap-1"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Sync
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Records</span>
                                    <span className="text-cyan-400 font-mono">{source.records.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Banners Tab */}
            {activeTab === 'banners' && (
                <div className="animate-fade-in">
                    <DataTable<Banner>
                        data={banners}
                        columns={bannerColumns}
                        loading={bannersLoading}
                        total={bannersTotal}
                        onCreate={() => { setIsEditing(false); setSelectedItem(null); setIsBannerModalOpen(true) }}
                        onEdit={(banner) => { setIsEditing(true); setSelectedItem(banner); setIsBannerModalOpen(true) }}
                        onDelete={(banner) => { setDeleteType('banner'); setSelectedItem(banner); setIsDeleteOpen(true) }}
                        searchPlaceholder="Search banners..."
                    />
                </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === 'knowledge' && (
                <div className="animate-fade-in">
                    <DataTable<KnowledgeBase>
                        data={kbItems}
                        columns={kbColumns}
                        loading={kbLoading}
                        total={kbTotal}
                        onCreate={() => { setIsEditing(false); setSelectedItem(null); setIsKbModalOpen(true) }}
                        onEdit={(item) => { setIsEditing(true); setSelectedItem(item); setIsKbModalOpen(true) }}
                        onDelete={(item) => { setDeleteType('kb'); setSelectedItem(item); setIsDeleteOpen(true) }}
                        searchPlaceholder="Search knowledge base..."
                    />
                </div>
            )}

            {/* Banner Modal */}
            <FormModal<Banner>
                isOpen={isBannerModalOpen}
                onClose={() => { setIsBannerModalOpen(false); setSelectedItem(null); setIsEditing(false) }}
                title={isEditing ? 'Edit Banner' : 'Add Banner'}
                onSubmit={handleBannerSubmit}
                loading={actionLoading}
            >
                <FormField name="title" label="Title" required defaultValue={selectedItem?.title} />
                <FormField name="description" label="Description" type="textarea" defaultValue={selectedItem?.description} />
                <FormField name="image_url" label="Image URL" required placeholder="https://..." defaultValue={selectedItem?.image_url} />
                <FormField name="link_url" label="Link URL" placeholder="https://..." defaultValue={selectedItem?.link_url} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField name="start_date" label="Start Date" type="date" defaultValue={selectedItem?.start_date} />
                    <FormField name="end_date" label="End Date" type="date" defaultValue={selectedItem?.end_date} />
                </div>
                <FormField name="active" label="Active" type="checkbox" defaultValue={selectedItem?.active ?? true} />
            </FormModal>

            {/* Knowledge Base Modal */}
            <FormModal<KnowledgeBase>
                isOpen={isKbModalOpen}
                onClose={() => { setIsKbModalOpen(false); setSelectedItem(null); setIsEditing(false) }}
                title={isEditing ? 'Edit Entry' : 'Add Knowledge Entry'}
                onSubmit={handleKbSubmit}
                loading={actionLoading}
            >
                <FormField name="title" label="Title" required defaultValue={selectedItem?.title} />
                <FormField
                    name="category"
                    label="Category"
                    type="select"
                    required
                    defaultValue={selectedItem?.category}
                    options={[
                        { value: 'fatwa', label: 'Fatwa' },
                        { value: 'hadith', label: 'Hadith' },
                        { value: 'fiqh', label: 'Fiqh' },
                        { value: 'general', label: 'General' },
                    ]}
                />
                <FormField name="source" label="Source" required placeholder="e.g., JAKIM, Al-Nawawi" defaultValue={selectedItem?.source} />
                <FormField name="content" label="Content" type="textarea" required defaultValue={selectedItem?.content} />
            </FormModal>

            {/* Delete Confirm */}
            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedItem(null) }}
                onConfirm={handleDelete}
                itemName={selectedItem?.title}
                loading={actionLoading}
            />
        </div>
    )
}
