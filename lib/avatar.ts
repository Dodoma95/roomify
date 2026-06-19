export const AVATAR_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"] as const;
export const AVATAR_MAX_SIZE = 10 * 1024 * 1024;

export function buildAvatarSrc(userId: string, version?: number): string {
  const base = `/api/profile/avatar?uid=${userId}`;
  return version !== undefined ? `${base}&v=${version}` : base;
}