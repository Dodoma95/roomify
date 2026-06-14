export type Role = "USER" | "OWNER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface UserAdminResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  enabled: boolean;
  emailVerified: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface UserPage {
  results: UserAdminResponse[];
  pageInfo: {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  token: string;
}
