'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Shield, Crown, AlertCircle, Download, UserPlus, MoreHorizontal } from 'lucide-react'
import { DataTable, Modal, FormModal, DeleteConfirm, FormField } from '@/components/ui'
import { getUsers, createUser, updateUser, deleteUser, updateUserRole, updateUserSubscription, banUser } from '@/actions/users'
import type { User, CRUDColumn } from '@/types/crud'

const userColumns: CRUDColumn<User>[] = [
    { key: 'full_name', label: 'User', type: 'avatar', sortable: true },
    {
        key: 'role',
        label: 'Role',
        type: 'badge',
        sortable: true,
        options: [
            { value: 'admin', label: 'Admin', color: 'badge-warning' },
            { value: 'moderator', label: 'Moderator', color: 'badge-info' },
            { value: 'user', label: 'User', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
        ]
    },
    {
        key: 'subscription_tier',
        label: 'Plan',
        type: 'badge',
        sortable: true,
        options: [
            { value: 'PRO', label: 'Pro', color: 'badge-pro' },
            { value: 'FAMILY', label: 'Family', color: 'badge-success' },
            { value: 'FREE', label: 'Free', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
        ]
    },
    { key: 'is_active', label: 'Status', type: 'boolean', sortable: true },
    { key: 'created_at', label: 'Joined', type: 'date', sortable: true },
]

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getUsers(page, pageSize)
            setUsers(data.users)
            setTotal(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }, [page, pageSize])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleCreate = async (data: Partial<User>) => {
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })
            await createUser(formData)
            setIsCreateOpen(false)
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdate = async (data: Partial<User>) => {
        if (!selectedUser) return
        setActionLoading(true)
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value))
            })
            await updateUser(selectedUser.id, formData)
            setIsEditOpen(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedUser) return
        setActionLoading(true)
        try {
            await deleteUser(selectedUser.id)
            setIsDeleteOpen(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user')
        } finally {
            setActionLoading(false)
        }
    }

    const stats = [
        { label: 'Total Users', value: total.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Active Now', value: users.filter(u => u.is_active).length, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Pro Subscribers', value: users.filter(u => u.subscription_tier === 'PRO').length, icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-slate-400 mt-1">Manage users, roles, and subscriptions</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-ghost flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <DataTable<User>
                data={users}
                columns={userColumns}
                loading={loading}
                total={total}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onEdit={(user) => { setSelectedUser(user); setIsEditOpen(true) }}
                onDelete={(user) => { setSelectedUser(user); setIsDeleteOpen(true) }}
                searchPlaceholder="Search users..."
            />

            {/* Create Modal */}
            <FormModal<User>
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Add New User"
                onSubmit={handleCreate}
                loading={actionLoading}
            >
                <FormField name="email" label="Email" type="email" required placeholder="user@example.com" />
                <FormField name="full_name" label="Full Name" required placeholder="John Doe" />
                <FormField
                    name="role"
                    label="Role"
                    type="select"
                    options={[
                        { value: 'user', label: 'User' },
                        { value: 'moderator', label: 'Moderator' },
                        { value: 'admin', label: 'Admin' },
                    ]}
                />
                <FormField
                    name="subscription_tier"
                    label="Subscription"
                    type="select"
                    options={[
                        { value: 'FREE', label: 'Free' },
                        { value: 'PRO', label: 'Pro' },
                        { value: 'FAMILY', label: 'Family' },
                    ]}
                />
            </FormModal>

            {/* Edit Modal */}
            <FormModal<User>
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedUser(null) }}
                title="Edit User"
                onSubmit={handleUpdate}
                loading={actionLoading}
                initialData={selectedUser || undefined}
            >
                <FormField name="full_name" label="Full Name" defaultValue={selectedUser?.full_name} />
                <FormField
                    name="role"
                    label="Role"
                    type="select"
                    defaultValue={selectedUser?.role}
                    options={[
                        { value: 'user', label: 'User' },
                        { value: 'moderator', label: 'Moderator' },
                        { value: 'admin', label: 'Admin' },
                    ]}
                />
                <FormField
                    name="subscription_tier"
                    label="Subscription"
                    type="select"
                    defaultValue={selectedUser?.subscription_tier}
                    options={[
                        { value: 'FREE', label: 'Free' },
                        { value: 'PRO', label: 'Pro' },
                        { value: 'FAMILY', label: 'Family' },
                    ]}
                />
                <FormField
                    name="is_active"
                    label="Active"
                    type="checkbox"
                    defaultValue={selectedUser?.is_active}
                />
            </FormModal>

            {/* Delete Confirm */}
            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedUser(null) }}
                onConfirm={handleDelete}
                itemName={selectedUser?.full_name || selectedUser?.email}
                loading={actionLoading}
            />
        </div>
    )
}
