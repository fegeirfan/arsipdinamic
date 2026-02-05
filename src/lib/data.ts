import type { User, ArchiveTable, ArchiveColumn, ArchiveRecord, TablePermission } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Admin Utama', email: 'admin@polarix.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/101/100/100' },
  { id: 'user-2', name: 'Budi Santoso', email: 'budi@polarix.com', role: 'staff', avatarUrl: 'https://picsum.photos/seed/102/100/100' },
  { id: 'user-3', name: 'Citra Lestari', email: 'citra@polarix.com', role: 'staff', avatarUrl: 'https://picsum.photos/seed/103/100/100' },
  { id: 'user-4', name: 'Dewi Anggraini', email: 'dewi@polarix.com', role: 'staff', avatarUrl: 'https://picsum.photos/seed/104/100/100' },
];

export const archiveTables: ArchiveTable[] = [
  {
    id: 'tbl-1',
    name: 'Surat Masuk',
    description: 'Arsip untuk semua surat yang masuk ke instansi.',
    visibility: 'public',
    createdBy: 'user-2',
    createdAt: '2023-10-26T10:00:00Z',
    picIds: ['user-2'],
  },
  {
    id: 'tbl-2',
    name: 'Data Kepegawaian Internal',
    description: 'Informasi sensitif mengenai data pegawai.',
    visibility: 'private',
    createdBy: 'user-1',
    createdAt: '2023-10-25T14:30:00Z',
    picIds: ['user-1', 'user-3'],
  },
  {
    id: 'tbl-3',
    name: 'Standard Operating Procedures (SOP)',
    description: 'Kumpulan dokumen SOP yang berlaku di perusahaan.',
    visibility: 'public',
    createdBy: 'user-3',
    createdAt: '2023-11-01T09:00:00Z',
    picIds: ['user-3'],
  },
];

export const archiveColumns: ArchiveColumn[] = [
  // Columns for "Surat Masuk" (tbl-1)
  { id: 'col-1-1', tableId: 'tbl-1', name: 'Nomor Surat', type: 'text', isRequired: true },
  { id: 'col-1-2', tableId: 'tbl-1', name: 'Tanggal Surat', type: 'date', isRequired: true },
  { id: 'col-1-3', tableId: 'tbl-1', name: 'Pengirim', type: 'text', isRequired: true },
  { id: 'col-1-4', tableId: 'tbl-1', name: 'Perihal', type: 'text', isRequired: true },
  { id: 'col-1-5', tableId: 'tbl-1', name: 'Status', type: 'select', isRequired: false, options: ['Diterima', 'Didisposisikan', 'Diarsip'] },
  { id: 'col-1-6', tableId: 'tbl-1', name: 'File Scan', type: 'file', isRequired: false },

  // Columns for "Data Kepegawaian" (tbl-2)
  { id: 'col-2-1', tableId: 'tbl-2', name: 'Nama Lengkap', type: 'text', isRequired: true },
  { id: 'col-2-2', tableId: 'tbl-2', name: 'NIP', type: 'text', isRequired: true },
  { id: 'col-2-3', tableId: 'tbl-2', name: 'Jabatan', type: 'text', isRequired: true },
  { id: 'col-2-4', tableId: 'tbl-2', name: 'Tanggal Lahir', type: 'date', isRequired: false },
  { id: 'col-2-5', tableId: 'tbl-2', name: 'Gaji Pokok', type: 'number', isRequired: true },

   // Columns for "SOP" (tbl-3)
   { id: 'col-3-1', tableId: 'tbl-3', name: 'Kode Dokumen', type: 'text', isRequired: true },
   { id: 'col-3-2', tableId: 'tbl-3', name: 'Nama SOP', type: 'text', isRequired: true },
   { id: 'col-3-3', tableId: 'tbl-3', name: 'Revisi', type: 'number', isRequired: false },
   { id: 'col-3-4', tableId: 'tbl-3', name: 'Berlaku Mulai', type: 'date', isRequired: true },
   { id: 'col-3-5', tableId: 'tbl-3', name: 'Dokumen SOP', type: 'file', isRequired: true },
];

export const archiveRecords: ArchiveRecord[] = [
    // Records for "Surat Masuk" (tbl-1)
    { id: 'rec-1-1', tableId: 'tbl-1', createdBy: 'user-2', createdAt: '2023-10-27T11:00:00Z', data: { 'col-1-1': '001/ABC/X/2023', 'col-1-2': '2023-10-27', 'col-1-3': 'PT. Maju Mundur', 'col-1-4': 'Penawaran Kerjasama', 'col-1-5': 'Diterima', 'col-1-6': '/files/surat1.pdf' } },
    { id: 'rec-1-2', tableId: 'tbl-1', createdBy: 'user-2', createdAt: '2023-10-28T15:20:00Z', data: { 'col-1-1': 'INV/2023/10/28', 'col-1-2': '2023-10-28', 'col-1-3': 'CV. Jaya Abadi', 'col-1-4': 'Invoice Pembayaran', 'col-1-5': 'Diarsip' } },
    
    // Records for "Data Kepegawaian" (tbl-2)
    { id: 'rec-2-1', tableId: 'tbl-2', createdBy: 'user-1', createdAt: '2023-10-26T09:00:00Z', data: { 'col-2-1': 'Budi Santoso', 'col-2-2': '199001012020121001', 'col-2-3': 'Staf IT', 'col-2-4': '1990-01-01', 'col-2-5': 8000000 } },
    { id: 'rec-2-2', tableId: 'tbl-2', createdBy: 'user-3', createdAt: '2023-10-26T09:05:00Z', data: { 'col-2-1': 'Citra Lestari', 'col-2-2': '199203152021012003', 'col-2-3': 'Staf HRD', 'col-2-4': '1992-03-15', 'col-2-5': 8500000 } },

    // Records for "SOP" (tbl-3)
    { id: 'rec-3-1', tableId: 'tbl-3', createdBy: 'user-3', createdAt: '2023-11-02T10:00:00Z', data: { 'col-3-1': 'SOP-HRD-001', 'col-3-2': 'Prosedur Cuti Karyawan', 'col-3-3': 2, 'col-3-4': '2023-01-01', 'col-3-5': '/files/sop-cuti.pdf' } },
];


export const tablePermissions: TablePermission[] = [
  // User Budi (user-2) is PIC for Surat Masuk, so has full access
  // User Citra (user-3) has view and insert rights on Surat Masuk
  { id: 'perm-1', tableId: 'tbl-1', userId: 'user-3', canView: true, canInsert: true, canEdit: false, canDelete: false, canEditStructure: false },
  // User Dewi (user-4) only has view rights
  { id: 'perm-2', tableId: 'tbl-1', userId: 'user-4', canView: true, canInsert: false, canEdit: false, canDelete: false, canEditStructure: false },

  // User Budi (user-2) has only view rights on private Data Kepegawaian table
  { id: 'perm-3', tableId: 'tbl-2', userId: 'user-2', canView: true, canInsert: false, canEdit: false, canDelete: false, canEditStructure: false },
];
