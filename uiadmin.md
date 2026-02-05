Siap 👌
Ini **UI/UX HALAMAN ADMIN** yang **jelas, rapi, dan siap diterjemahkan ke desain (Figma) atau langsung ke Next.js + Tailwind**. Aku susun dari **layout global → halaman → komponen → UX rules**.

---

# 🎨 UI / UX HALAMAN ADMIN

**Sistem Manajemen Arsip (Next.js + Supabase)**

---

## 1️⃣ Layout Global Admin

### 🧱 Struktur Layout

```
┌──────────────────────────────┐
│ Topbar                       │
├──── Sidebar ────┬────────────┤
│                 │ Main       │
│                 │ Content    │
│                 │            │
└─────────────────┴────────────┘
```

---

### 📌 Sidebar (Left)

**Tetap (sticky), collapsible**

**Menu:**

* 📊 Dashboard
* 📁 Manajemen Tabel
* 👥 Manajemen User
* 🛡️ Permission & PIC
* 📤 Backup & Export
* ⚙️ Pengaturan

**UX Notes:**

* Badge **Public / Private**
* Label kecil **PIC**
* Active state jelas

---

### 🔝 Topbar

* Judul halaman
* Search global arsip
* Avatar admin (dropdown):

  * Profile
  * Logout

---

## 2️⃣ Halaman Dashboard Admin

### 🎯 Tujuan

Memberi **overview cepat** kondisi arsip.

### 🧩 Komponen

* Card Statistik:

  * Total Tabel
  * Total Arsip
  * Tabel Private
  * User Aktif
* Recent Activity (log)
* Quick Action:

  * ➕ Buat Tabel
  * 👤 Tambah User

**UX:**

* Ringkas
* Data paling penting di atas

---

## 3️⃣ Halaman Manajemen Tabel Arsip

### 📁 `/dashboard/tables`

### Tampilan

**Table list view + action**

**Kolom:**

* Nama Tabel
* PIC
* Visibility (Public / Private)
* Jumlah Arsip
* Aksi

**Aksi (icon button):**

* 👁️ Lihat
* ✏️ Edit Struktur
* 🔐 Permission
* 🗑️ Hapus

**UX Rules:**

* Konfirmasi sebelum hapus
* Filter: Public / Private / PIC
* Search nama tabel

---

## 4️⃣ Halaman Buat / Edit Tabel

### 🧱 `/dashboard/tables/create`

### Form:

* Nama tabel
* Deskripsi
* Visibility:

  * 🔘 Public
  * 🔘 Private
* PIC awal (default: creator)

**CTA:**

* **Buat Tabel**
* Cancel

**UX:**

* Simple, 1 kolom
* Tooltip penjelasan Public vs Private

---

## 5️⃣ Halaman Builder Struktur Tabel

### 🧩 `/dashboard/tables/[id]/builder`

### Layout

**Split View**

```
┌───────────────┬──────────────┐
│ Column List   │ Column Form  │
└───────────────┴──────────────┘
```

---

### 🧱 Panel Kiri – Daftar Kolom

* List kolom
* Icon tipe data
* Required badge
* Drag & reorder (opsional)

---

### ✏️ Panel Kanan – Form Kolom

Field:

* Nama kolom
* Tipe data (select)
* Required (checkbox)
* Option (jika select)

**Button:**

* ➕ Tambah Kolom
* 💾 Simpan

**UX Rules:**

* Auto-save optional
* Warning kalau ubah struktur tabel berisi data

---

## 6️⃣ Halaman Permission & PIC

### 🔐 `/dashboard/tables/[id]/permissions`

### Konsep: **Permission Matrix**

| User | PIC | View | Insert | Edit | Delete | Edit Struktur |
| ---- | --- | ---- | ------ | ---- | ------ | ------------- |
| Andi | ☑   | ☑    | ☑      | ☑    | ⛔      | ☑             |

**Fitur:**

* Checkbox per izin
* Toggle PIC
* Admin override

**UX:**

* Inline update
* Toast sukses/gagal
* Lock icon untuk private table

---

## 7️⃣ Halaman Manajemen User

### 👥 `/dashboard/users`

**List User:**

* Nama
* Email
* Role
* Status
* Aksi

**Aksi:**

* Edit role
* Reset password
* Nonaktifkan

---

## 8️⃣ UX Prinsip Penting (WAJIB)

### ✅ Clarity

* Admin selalu tahu:

  * Siapa PIC
  * Tabel public / private

### 🛡️ Safety

* Confirm dialog untuk:

  * Hapus tabel
  * Ubah struktur
  * Cabut izin

### ⚡ Efficiency

* Modal, bukan page reload
* Inline edit
* Keyboard-friendly

---

## 9️⃣ Design System (Rekomendasi)

* Font: Inter
* Warna:

  * Primary: Indigo / Blue
  * Danger: Red
  * Success: Green
* Icon: Lucide / Heroicons
* Button:

  * Primary
  * Secondary
  * Destructive

---

## 🔟 Komponen UI Penting (Reusable)

* `<PermissionGuard />`
* `<VisibilityBadge />`
* `<PICBadge />`
* `<ConfirmDialog />`
* `<DynamicForm />`
* `<TableBuilder />`

---

Kalau mau, aku bisa:

* 🎨 Buatin **wireframe visual (deskripsi Figma-ready)**
* 🧑‍💻 Mapping **UI → component Next.js**
* 📐 Buat **design system Tailwind**
* 🧩 Contoh **layout.tsx + sidebar**

Tinggal bilang mau lanjut ke **desain**, **kode**, atau **wireframe detail per halaman** 🚀
