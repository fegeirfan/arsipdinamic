Mantap. Karena **Admin UI sudah kuat dan kompleks**, maka **User UI harus jadi kebalikannya**:
👉 **fokus ke akses arsip, cepat, minim keputusan, dan aman**.

Di bawah ini aku susun **UI/UX HALAMAN USER** dengan **struktur yang konsisten dengan Admin**, tapi **lebih sederhana & task-oriented**, siap diterjemahkan ke **Figma / Next.js + Tailwind**.

---

# 🧑‍💼 UI / UX HALAMAN USER

**Sistem Manajemen Arsip**

> **Prinsip utama:**
> User **tidak mengatur sistem**, hanya **mengakses & mengelola arsip sesuai izin**.

---

## 1️⃣ Layout Global User

### 🧱 Struktur

```
┌──────────────────────────────┐
│ Topbar                       │
├──── Sidebar ────┬────────────┤
│                 │ Main       │
│                 │ Content    │
└─────────────────┴────────────┘
```

---

### 📌 Sidebar (Simplified)

**Menu:**

* 📁 Arsip Saya
* ⭐ Favorit
* 🕓 Riwayat
* 👤 Profil

> ❌ Tidak ada:
>
> * Manajemen user
> * Permission
> * Struktur tabel

**UX Notes:**

* Group berdasarkan **akses**
* Badge:

  * 🔐 Private
  * 👑 PIC (jika user adalah PIC)
* Sidebar auto-collapse di mobile

---

### 🔝 Topbar User

* Search arsip global
* Filter cepat (tabel / tanggal)
* Avatar user:

  * Profil
  * Logout

---

## 2️⃣ Halaman Dashboard User

### 🏠 `/dashboard`

### Tujuan

User **langsung tahu apa yang bisa dia akses & kerjakan**.

### Komponen

#### 📊 Info Ringkas

* Tabel yang bisa diakses
* Arsip milik saya
* Arsip terakhir diubah

#### ⚡ Quick Action

* ➕ Tambah Arsip
* 🔍 Cari Arsip

#### 🕓 Recent Activity

* Arsip yang terakhir dibuka / diubah

---

## 3️⃣ Halaman Daftar Tabel Arsip

### 📁 `/tables`

### Tampilan

**Grid / list card**

**Card berisi:**

* Nama Tabel
* Deskripsi singkat
* Badge:

  * Public / Private
  * PIC (jika ya)
* Jumlah Arsip
* Aksi:

  * 👁️ Buka

**UX Rules:**

* Hanya tabel yang user punya akses
* Disabled state kalau View-only
* Sorting:

  * Terbaru
  * Favorit

---

## 4️⃣ Halaman Isi Arsip (Record List)

### 📄 `/tables/[id]`

### Tampilan

**Table view (readable, bukan admin-heavy)**

**Kolom:**

* Data arsip
* Created at
* Created by
* Aksi

**Aksi per baris:**

* 👁️ Detail
* ✏️ Edit (jika allowed)
* 🗑️ Hapus (jika allowed)

---

### 🔍 Fitur Penting

* Search per kolom
* Filter (tanggal / status)
* Pagination / infinite scroll

---

## 5️⃣ Halaman Detail Arsip

### 📄 `/tables/[id]/[recordId]`

### Layout

```
┌─────────────────────┐
│ Header (judul)      │
├─────────────────────┤
│ Field Viewer        │
├─────────────────────┤
│ Action Bar          │
└─────────────────────┘
```

---

### 📋 Field Viewer

* Label kiri
* Value kanan
* Read-only by default

### 🧩 Action Bar

* ✏️ Edit
* 🖨️ Export PDF
* ⬇️ Download Lampiran

---

## 6️⃣ Form Tambah / Edit Arsip

### 📝 `/tables/[id]/create`

### Form Dinamis

> Menggunakan struktur dari admin (Table Builder)

**Komponen:**

* `<DynamicForm />`
* Validation inline
* Required field indicator

**CTA:**

* 💾 Simpan
* Cancel

**UX Rules:**

* Auto-focus field pertama
* Error jelas per field
* Tidak boleh edit field restricted

---

## 7️⃣ Permission Awareness (UX KRITIS)

User **harus selalu sadar batas aksesnya**.

### Contoh UX:

* Tombol **disabled + tooltip**

  > “Anda tidak memiliki izin Edit”
* Banner kecil:

  > 🔐 Tabel Private – Akses Terbatas
* Field terkunci:

  * Read-only style
  * Lock icon

---

## 8️⃣ Halaman Profil User

### 👤 `/profile`

* Nama
* Email
* Role (read-only)
* Tabel yang diakses
* Status PIC

---

## 9️⃣ UX Prinsip User (BEDA DENGAN ADMIN)

| Prinsip    | Implementasi              |
| ---------- | ------------------------- |
| Simplicity | Tidak ada fitur teknis    |
| Safety     | Tidak bisa melanggar izin |
| Speed      | Search dominan            |
| Clarity    | Aksi jelas boleh/tidak    |

---

## 🔁 Perbedaan Admin vs User (Ringkas)

| Area           | Admin          | User            |
| -------------- | -------------- | --------------- |
| Struktur tabel | ✔              | ❌               |
| Permission     | ✔              | ❌               |
| CRUD arsip     | ✔              | ✔ (sesuai izin) |
| UI Complexity  | Tinggi         | Rendah          |
| Target UX      | Kontrol sistem | Kerja cepat     |

---

## 🔧 Komponen Reusable (User)

* `<RecordTable />`
* `<RecordViewer />`
* `<DynamicForm />`
* `<PermissionGuard />`
* `<AccessDenied />`
* `<EmptyState />`

---

## 🧭 Alur Mental User (PENTING)

> **User berpikir:**
> “Saya mau cari arsip → lihat → edit → selesai”

UI harus **selalu mendukung alur ini tanpa gangguan**.

---

Kalau mau lanjut, aku bisa:

1️⃣ Buat **wireframe user per halaman (Figma-ready)**
2️⃣ Mapping **Admin Table Builder → DynamicForm User**
3️⃣ Buat **role-based routing Next.js**
4️⃣ Contoh **Record Table + PermissionGuard code**

Tinggal bilang mau lanjut ke **desain**, **alur data**, atau **kode langsung** 🔥
