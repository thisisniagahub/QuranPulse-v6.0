'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    BookOpen, Mic, Upload, CheckCircle2, Clock, Play, Pause,
    AlertCircle, Plus, RefreshCw, Volume2, Check
} from 'lucide-react'
import { DataTable, Modal, FormModal, DeleteConfirm, FormField } from '@/components/ui'
import {
    getLessons, getIqraStats, createLesson, updateLesson, deleteLesson,
    validateLesson, publishLesson, bulkPublishVolume
} from '@/actions/iqra'
import type { IqraLesson, CRUDColumn } from '@/types/crud'

const lessonColumns: CRUDColumn<IqraLesson>[] = [
    {
        key: 'volume',
        label: 'Reference',
        type: 'text',
        render: (v, row) => (
            <span className="font-mono text-xs text-slate-400">
                V{row.volume} P{row.page} L{row.line}
            </span>
        )
    },
    {
        key: 'arabic_text',
        label: 'Arabic',
        type: 'text',
        render: (v) => <span className="font-arabic text-xl text-white">{v}</span>
    },
    { key: 'transliteration', label: 'Transliteration', type: 'text' },
    {
        key: 'audio_url',
        label: 'Audio',
        type: 'boolean',
        render: (v) => v ? (
            <span className="flex items-center gap-1 text-emerald-400">
                <Volume2 className="h-4 w-4" /> Ready
            </span>
        ) : (
            <span className="text-slate-500">Missing</span>
        )
    },
    {
        key: 'status',
        label: 'Status',
        type: 'badge',
        options: [
            { value: 'live', label: 'Live', color: 'badge-success' },
            { value: 'validated', label: 'Validated', color: 'badge-info' },
            { value: 'pending', label: 'Pending', color: 'badge-warning' },
        ]
    },
]

export default function IqraOpsPage() {
    const [lessons, setLessons] = useState<IqraLesson[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [selectedVolume, setSelectedVolume] = useState<number | undefined>(undefined)

    const [volumeStats, setVolumeStats] = useState<any[]>([])

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState<IqraLesson | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLessons = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getLessons(selectedVolume, page, pageSize)
            setLessons(data.lessons)
            setTotal(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch lessons')
        } finally {
            setLoading(false)
        }
    }, [selectedVolume, page, pageSize])

    const fetchStats = useCallback(async () => {
        try {
            const data = await getIqraStats()
            setVolumeStats(data.volumes)
        } catch (err) {
            console.error('Failed to fetch stats:', err)
        }
    }, [])

    useEffect(() => {
        fetchLessons()
        fetchStats()
    }, [fetchLessons, fetchStats])

    const handleCreate = async (data: Partial<IqraLesson>) => {
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })
            await createLesson(formData)
            setIsCreateOpen(false)
            fetchLessons()
            fetchStats()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create lesson')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdate = async (data: Partial<IqraLesson>) => {
        if (!selectedLesson) return
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })
            await updateLesson(selectedLesson.id, formData)
            setIsEditOpen(false)
            setSelectedLesson(null)
            fetchLessons()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update lesson')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedLesson) return
        setActionLoading(true)
        try {
            await deleteLesson(selectedLesson.id)
            setIsDeleteOpen(false)
            setSelectedLesson(null)
            fetchLessons()
            fetchStats()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete lesson')
        } finally {
            setActionLoading(false)
        }
    }

    const handleBulkPublish = async (volume: number) => {
        try {
            await bulkPublishVolume(volume)
            fetchLessons()
            fetchStats()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to publish volume')
        }
    }

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Iqra Digital Ops</h2>
                    <p className="text-slate-400 mt-1">Manage curriculum structure, audio validation, and lesson content</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchLessons} className="btn-ghost flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Lesson
                    </button>
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

            {/* Volume Progress */}
            <div className="grid gap-4 md:grid-cols-6 animate-fade-in">
                {volumeStats.map((vol) => {
                    const progress = vol.total > 0 ? (vol.live / vol.total) * 100 : 0
                    const isSelected = selectedVolume === vol.volume
                    return (
                        <button
                            key={vol.volume}
                            onClick={() => setSelectedVolume(isSelected ? undefined : vol.volume)}
                            className={`glass-card rounded-xl p-4 text-left transition-all ${isSelected ? 'border-cyan-500/50 bg-cyan-500/5' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-slate-200">Iqra {vol.volume}</span>
                                {progress === 100 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{vol.live}/{vol.total} live</span>
                                <span>{vol.withAudio} audio</span>
                            </div>
                            {vol.validated > 0 && vol.validated !== vol.live && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleBulkPublish(vol.volume) }}
                                    className="mt-2 w-full text-xs py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                >
                                    Publish {vol.validated} validated
                                </button>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Lessons Table */}
            <div className="animate-fade-in">
                <DataTable<IqraLesson>
                    data={lessons}
                    columns={lessonColumns}
                    loading={loading}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    title={selectedVolume ? `Iqra ${selectedVolume} Lessons` : 'All Lessons'}
                    onEdit={(lesson) => { setSelectedLesson(lesson); setIsEditOpen(true) }}
                    onDelete={(lesson) => { setSelectedLesson(lesson); setIsDeleteOpen(true) }}
                    searchPlaceholder="Search lessons..."
                />
            </div>

            {/* Create Modal */}
            <FormModal<IqraLesson>
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Add New Lesson"
                onSubmit={handleCreate}
                loading={actionLoading}
            >
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        name="volume"
                        label="Volume"
                        type="select"
                        required
                        options={[1, 2, 3, 4, 5, 6].map(v => ({ value: String(v), label: `Iqra ${v}` }))}
                    />
                    <FormField name="page" label="Page" type="number" required placeholder="1" />
                    <FormField name="line" label="Line" type="number" required placeholder="1" />
                </div>
                <FormField name="arabic_text" label="Arabic Text" required placeholder="بَ تَ ثَ" />
                <FormField name="transliteration" label="Transliteration" required placeholder="BA-TA-THA" />
                <FormField name="audio_url" label="Audio URL" placeholder="https://..." />
            </FormModal>

            {/* Edit Modal */}
            <FormModal<IqraLesson>
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedLesson(null) }}
                title="Edit Lesson"
                onSubmit={handleUpdate}
                loading={actionLoading}
            >
                <FormField name="arabic_text" label="Arabic Text" defaultValue={selectedLesson?.arabic_text} />
                <FormField name="transliteration" label="Transliteration" defaultValue={selectedLesson?.transliteration} />
                <FormField name="audio_url" label="Audio URL" defaultValue={selectedLesson?.audio_url || ''} />
                <FormField
                    name="status"
                    label="Status"
                    type="select"
                    defaultValue={selectedLesson?.status}
                    options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'validated', label: 'Validated' },
                        { value: 'live', label: 'Live' },
                    ]}
                />
            </FormModal>

            {/* Delete Confirm */}
            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedLesson(null) }}
                onConfirm={handleDelete}
                itemName={selectedLesson ? `V${selectedLesson.volume} P${selectedLesson.page} L${selectedLesson.line}` : undefined}
                loading={actionLoading}
            />
        </div>
    )
}
