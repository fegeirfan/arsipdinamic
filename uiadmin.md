

# 🛠️ UI / UX HALAMAN ADMIN (FINAL – BASED ON APPROVAL FLOW)

**Peran Admin:**
👉 **Pemilik sistem & penjaga governance**, bukan operator harian arsip.

---

## 0️⃣ Layout Global Admin

### Struktur

```
Topbar
├─ Sidebar Admin
└─ Main Content
```

### Sidebar Admin (FINAL)

1. 📊 Dashboard
2. 🧱 Team & PIC
3. 📁 Tabel Arsip
4. 🔐 Akses & Permintaan
5. 👥 User
6. 📜 Audit Log
7. ⚙️ Pengaturan Sistem

> ❌ Tidak ada menu “Isi Arsip”
> Admin **tidak bekerja dengan data**, tapi **mengatur sistem**.

---

## 1️⃣ Dashboard Admin

### 🎯 Tujuan

Melihat **kondisi & risiko sistem** dalam 1 layar.

### Komponen

#### 📊 Statistik Utama

* Total Team
* Total User
* Total Tabel
* Total Arsip

#### 🚨 Alert Sistem

* Team tanpa PIC
* Tabel tanpa PIC
* Request akses menumpuk
* User tanpa team

#### ⚡ Quick Action

* ➕ Buat Team
* 👑 Assign PIC
* 📁 Lihat Request Akses

---

## 2️⃣ Manajemen Team & PIC (HALAMAN PALING PENTING)

### 🧱 `/admin/teams`

### Fungsi

Admin **menentukan struktur organisasi & PIC**

### Tabel Team

| Team | PIC | Jumlah User | Jumlah Tabel | Aksi |
| ---- | --- | ----------- | ------------ | ---- |

### Aksi

* ➕ Buat Team
* 👑 Assign / Ganti PIC
* 👥 Kelola Anggota
* 🗑️ Hapus Team (dengan validasi)

### UX Rules (WAJIB)

* ❌ Team **tidak boleh tanpa PIC**
* ⚠️ Warning jika ganti PIC (tabel terdampak)
* Tooltip:

  > “PIC berwenang membuat & mengelola tabel untuk tim ini”

---

## 3️⃣ Manajemen Tabel Arsip (ADMIN VIEW)

### 📁 `/admin/tables`

### Tujuan

Admin **mengawasi semua tabel**, bukan mengisinya.

### Tabel List

| Nama Tabel | Team Owner | PIC | Visibility | Arsip | Aksi |
| ---------- | ---------- | --- | ---------- | ----- | ---- |

### Visibility (Auto)

* 🔒 Tim Owner
* 🔓 Shared (ada izin lintas tim)

### Aksi

* 👁️ Lihat metadata
* 🔐 Lihat permission
* 🧱 Lihat struktur
* 🗑️ Force delete (admin only)

---

## 4️⃣ Struktur Tabel (READ / LOCK MODE)

### 🧱 `/admin/tables/[id]/structure`

### Prinsip

* Default: **read-only**
* Edit struktur → **explicit override**

### UX

* Banner:

  > ⚠️ Perubahan struktur dapat berdampak ke data
* Tombol:

  * 🔓 Unlock (Admin)

---

## 5️⃣ Akses & Permintaan (APPROVAL CENTER)

### 🔐 `/admin/access`

### Fungsi

Admin **memantau & override** proses izin.

---

### A. Request Akses (Masuk)

| User | Team Asal | Tabel | Diminta | Status | Aksi |
| ---- | --------- | ----- | ------- | ------ | ---- |

**Aksi**

* Approve
* Reject
* Forward ke PIC

---

### B. Permission Overview

| Tabel | Team Owner | Shared ke | PIC |
| ----- | ---------- | --------- | --- |

Admin bisa:

* Cabut izin lintas tim
* Assign PIC tambahan
* Lock tabel (read-only global)

---

## 6️⃣ Manajemen User

### 👥 `/admin/users`

### Kolom

* Nama
* Email
* Team
* Status
* Role (Admin / User)

### Aksi

* Assign team
* Promote / demote admin
* Suspend user
* Reset password

### UX Rules

* ❌ User **wajib punya team**
* Admin tidak bisa menurunkan dirinya sendiri (safety)

---

## 7️⃣ Audit Log (WAJIB)

### 📜 `/admin/audit`

### Log Aktivitas

* Assign PIC
* Buat tabel
* Approve / reject request
* Ubah permission
* Hapus tabel

### Filter

* User
* Team
* Tanggal
* Jenis aksi

---

## 8️⃣ Pengaturan Sistem

### ⚙️ `/admin/settings`

### Konfigurasi

#### Identitas

* Nama instansi
* Logo
* Footer

#### Akses & Keamanan

* Default akses tabel (tim owner)
* Apakah user boleh browse tabel tim lain
* Expiry default request

#### Sistem

* Default role user baru
* Session timeout

---

## 🧩 Komponen UI Reusable (Admin)

* `<AdminLayout />`
* `<TeamTable />`
* `<AssignPICModal />`
* `<TableOverview />`
* `<AccessRequestTable />`
* `<PermissionViewer />`
* `<ConfirmDialog />`
* `<AuditLogTable />`

---

## 🧠 Prinsip UX Admin (FINAL)

| Prinsip      | Implementasi             |
| ------------ | ------------------------ |
| Governance   | Admin pegang struktur    |
| Delegation   | PIC pegang tabel         |
| Safety       | No orphan team / table   |
| Transparency | Audit & permission jelas |
| Scalability  | Siap deploy ulang        |

---

## 🧾 RINGKASAN AKHIR

> **Admin UI = Control Tower**

Admin:

* Membentuk team
* Menentukan PIC
* Mengawasi akses lintas tim
* Menjaga sistem tetap sehat

PIC:

* Membuat & mengelola tabel tim

User:

* Bekerja dengan arsip

---

## Langkah Lanjut (pilih salah satu)

1️⃣ **Wireframe Admin (Figma-ready, per halaman)**
2️⃣ **Mapping ke Next.js folder & layout.tsx**
3️⃣ **Schema DB + RLS Supabase sesuai flow ini** 🔥
4️⃣ **Flow diagram visual (Admin → PIC → User)**

Tinggal bilang mau lanjut ke **desain**, **kode**, atau **diagram** 🚀
