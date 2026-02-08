

# 🧑‍💼 UI / UX HALAMAN USER (FINAL – ACCESS REQUEST FLOW)

**Peran User:**
👉 **Bekerja dengan arsip, bukan mengatur sistem**

---

## 0️⃣ Layout Global User

### Struktur

```
Topbar
├─ Sidebar User
└─ Main Content
```

### Sidebar User (FINAL)

1. 📁 Arsip Tim Saya
2. 🌐 Jelajahi Tabel
3. ⭐ Favorit
4. 🕓 Aktivitas Saya
5. 👤 Profil

> ❌ Tidak ada menu teknis
> ❌ Tidak ada permission editor

---

## 1️⃣ Dashboard User

### 🏠 `/dashboard`

### Tujuan

Masuk → **langsung tahu apa yang bisa dikerjakan**

### Konten

**Ringkasan**

* Tabel tim saya
* Arsip yang saya buat
* Permintaan akses (status saya)

**Quick Action**

* ➕ Tambah Arsip
* 🔍 Cari Arsip

---

## 2️⃣ Arsip Tim Saya

### 📁 `/tables/my-team`

### Isi

Semua tabel **yang dimiliki tim user**

### Tampilan

**List / card**

**Card**

* Nama tabel
* Deskripsi
* Badge:

  * 👑 PIC (jika user PIC)
  * 🔒 Tim Saya
* Jumlah arsip

**Aksi**

* 👁️ Buka

---

## 3️⃣ Jelajahi Tabel (Tim Lain)

### 🌐 `/tables/browse`

### Tujuan

User **sadar ada tabel lain**, tapi **tidak otomatis bisa akses**

### State Card

| State      | Tampilan       |
| ---------- | -------------- |
| Accessible | 👁️ Buka       |
| Locked     | 🔒 Minta Akses |
| Pending    | ⏳ Menunggu     |

### Filter

* Team
* PIC
* Status akses

---

## 4️⃣ Request Akses (User Flow)

### 🔐 Modal “Minta Akses”

**Isi**

* Tabel tujuan
* Level akses:

  * View
  * Insert
* Catatan (opsional)

**CTA**

* Kirim Permintaan

### UX Setelah Submit

* Card berubah → ⏳ Pending
* Notifikasi:

  > Permintaan dikirim ke PIC

---

## 5️⃣ Daftar Arsip (Record List)

### 📄 `/tables/[id]`

### Tampilan

**Table fokus data**

**Kolom**

* Data utama
* Created at
* Created by
* Aksi

**Aksi per baris**

* 👁️ Detail
* ✏️ Edit (jika allowed)
* 🗑️ Hapus (jika allowed)

---

## 6️⃣ Detail Arsip

### 📄 `/tables/[id]/[recordId]`

### Header

```
Nama Arsip
🔐 Akses: Tim Keuangan
👑 PIC: Andi
```

### Action Bar

* ✏️ Edit (jika boleh)
* 🖨️ Export PDF
* ⬇️ Download lampiran

---

## 7️⃣ Tambah / Edit Arsip

### 📝 `/tables/[id]/create`

### Form Dinamis

**UX Rules**

* Field required jelas
* Field terkunci → read-only + 🔒
* Error inline

**CTA**

* 💾 Simpan
* Cancel

---

## 8️⃣ Favorit

### ⭐ `/favorites`

* Tabel / arsip yang sering dipakai
* Shortcut kerja cepat

---

## 9️⃣ Aktivitas Saya

### 🕓 `/activity`

* Arsip:

  * Dibuat
  * Diubah
  * Diakses
* Request:

  * Approved
  * Rejected
  * Pending

---

## 🔔 10️⃣ Notifikasi (Inline)

User dapat notifikasi saat:

* Request disetujui / ditolak
* Akses dicabut
* Arsip diubah (jika subscribed)

---

## 1️⃣1️⃣ Profil User

### 👤 `/profile`

**Isi**

* Nama
* Email
* Team
* Status:

  * 👑 PIC di tabel X
* Role (read-only)

---

## 🧩 Komponen UI Reusable (User)

* `<UserLayout />`
* `<TableCard />`
* `<AccessStateBadge />`
* `<RequestAccessModal />`
* `<RecordTable />`
* `<RecordViewer />`
* `<DynamicForm />`
* `<PermissionGuard />`
* `<EmptyState />`

---

## 🧠 Prinsip UX User (FINAL)

| Prinsip      | Implementasi            |
| ------------ | ----------------------- |
| Awareness    | Tahu batas akses        |
| Simplicity   | Tidak ada menu teknis   |
| Transparency | Sumber akses jelas      |
| Safety       | Tidak bisa langgar izin |
| Speed        | Fokus data & search     |

---

## 🧾 RINGKASAN USER FLOW

> **User melihat tabel → jika terkunci → request → tunggu → pakai**
