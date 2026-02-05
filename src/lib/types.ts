export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export type TableVisibility = 'public' | 'private';

export interface ArchiveTable {
  id: string;
  name: string;
  description: string;
  visibility: TableVisibility;
  createdBy: string; // userId
  createdAt: string; // ISO date string
  picIds: string[]; // array of userIds
}

export type ColumnType = 'text' | 'number' | 'date' | 'select' | 'file';

export interface ArchiveColumn {
  id: string;
  tableId: string;
  name: string;
  type: ColumnType;
  isRequired: boolean;
  options?: string[]; // for 'select' type
}

export interface ArchiveRecord {
  id: string;
  tableId: string;
  data: Record<string, any>;
  createdBy: string; // userId
  createdAt: string; // ISO date string
}

export interface TablePermission {
  id: string;
  tableId: string;
  userId: string;
  canView: boolean;
  canInsert: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canEditStructure: boolean;
}
