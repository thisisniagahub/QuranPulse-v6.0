export type AppRole = 'user' | 'admin' | 'moderator';

export function normalizeRole(role?: string | null): AppRole | undefined {
  const normalized = role?.trim().toLowerCase();

  if (normalized === 'admin' || normalized === 'moderator' || normalized === 'user') {
    return normalized;
  }

  return undefined;
}

export function isAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === 'admin';
}
