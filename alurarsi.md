Siap. Kita bikin **VERSI FINAL, BERSIH, DAN KONSISTEN** untuk **alur + UI/UX**:

Fokus:

* **Pembuatan tabel**
* **Penambahan data**
* Sesuai keputusan penting kita:

  * **Role hanya Admin & User**
  * **PIC = atribut per tabel**
  * **Tim sebagai owner tabel**

Aku tulis ini seperti **dokumen produk + acuan desain + acuan dev**.

---

# 📘 UI/UX & FLOW – POLARIX

## Pembuatan Tabel & Penambahan Data

---

## A. AKTOR & ATURAN DASAR

### A.1 Aktor

* **Admin**
* **User**

  * Bisa menjadi **PIC pada tabel tertentu**

### A.2 Aturan Dasar

* Tabel **selalu dimiliki oleh 1 Tim**
* Tabel **selalu punya 1 PIC**
* Anggota tim owner → otomatis bisa akses data
* User luar tim → harus request akses

---

# B. ALUR PEMBUATAN TABEL

## 1️⃣ Entry Point – Buat Tabel

### Lokasi UI

* Sidebar: **Arsip Tim Saya**
* Header halaman: tombol **➕ Buat Tabel**

### Visibility Rule

* Tombol **hanya muncul** jika:

  * Admin
  * User yang ditunjuk sebagai PIC (atau eligible jadi PIC)

---

## 2️⃣ Step 1 – Identitas Tabel (Basic Info)

### Halaman

```
/tables/create
```

### UI Layout

Form satu kolom (clean, fokus)

### Field

* **Nama Tabel** (required)
* **Deskripsi** (optional)
* **Tim Pemilik**

  * User biasa → auto (readonly)
  * Admin → dropdown
* **PIC Tabel**

  * Default: pembuat tabel
* **Catatan Info (non-editable)**

  > Semua anggota tim pemilik otomatis dapat mengakses tabel ini

### CTA

* **Lanjut: Buat Struktur**
* Batal

---

## 3️⃣ Step 2 – Table Builder (Struktur Kolom)

### Halaman

```
/tables/create/structure
```

### Layout

```
┌──────────────┬──────────────────┐
│ Daftar Kolom │ Form Kolom        │
└──────────────┴──────────────────┘
```

---

### Panel Kiri – Daftar Kolom

* Nama kolom
* Icon tipe data
* Badge:

  * Required
* Urutan kolom

---

### Panel Kanan – Form Kolom

**Field**

* Nama Kolom
* Tipe Data:

  * Text
  * Number
  * Date
  * Select
  * File (Google Drive)
* Required (checkbox)
* Opsi (jika Select)

### Action

* ➕ Tambah Kolom
* 💾 Simpan Kolom

---

### UX Rules

* Minimal 1 kolom
* Nama kolom unik
* Validasi realtime
* Struktur **belum aktif** (aman untuk edit bebas)

---

## 4️⃣ Step 3 – Konfirmasi & Aktivasi

### Modal Konfirmasi

Menampilkan ringkasan:

* Nama tabel
* Tim pemilik
* PIC
* Jumlah kolom

### CTA

* ✅ Konfirmasi & Buat Tabel
* ⬅️ Kembali Edit

---

## 5️⃣ State Setelah Tabel Dibuat

### Sistem Otomatis

* Tabel aktif
* Struktur terkunci (tidak bisa sembarang diubah)
* PIC tercatat
* Permission default:

  * Tim owner → View + Insert
* Audit log dibuat

### Redirect

```
/tables/{tableId}
```

### Notifikasi

> ✅ Tabel berhasil dibuat
> Anggota tim Anda sekarang dapat mengisi data

---

# C. ALUR PENAMBAHAN DATA (RECORD)

## 6️⃣ Halaman Data Tabel

### URL

```
/tables/{tableId}
```

### UI Utama

* Tabel data (record list)
* Indikator akses user:

  * Editable
  * View-only
  * Locked
* Tombol aksi sesuai izin

---

## 7️⃣ Metode 1 – Quick Add (Simpan Cepat)

### Tujuan

Input data cepat & berulang

### UI

* Baris input di **bagian paling atas tabel**
* Field sesuai struktur kolom

### Alur

1. User isi field langsung di sel
2. Upload file jika tipe File
3. Tekan **Enter** / klik **Simpan**
4. Baris:

   * Tersimpan
   * Langsung muncul di daftar
   * Tabel auto-scroll ke atas

### UX Rules

* Validasi langsung
* Field required ditandai
* Error muncul inline

---

## 8️⃣ Metode 2 – Form Tambah Data (Full Form)

### Tujuan

Data kompleks / butuh fokus

### Entry Point

* Tombol **➕ Tambah Data**

### Halaman

```
/tables/{tableId}/create
```

### UI

* Form vertikal
* Field disusun rapi
* Tooltip untuk field khusus

### CTA

* 💾 Simpan Data
* Batal

---

## 9️⃣ Setelah Data Disimpan

### Sistem

* Record tersimpan
* Metadata otomatis:

  * Created by
  * Timestamp
* Audit log dicatat
* Real-time update ke user lain

### Feedback

> ✅ Data berhasil ditambahkan

---

## 10️⃣ Edit Data (Inline Edit)

### Interaksi

* Klik sel → berubah jadi input
* Edit nilai
* Auto-save saat:

  * Enter
  * Klik di luar

### UX Rules

* Hanya field yang diizinkan
* Loading indicator kecil
* Toast jika gagal

---

## 11️⃣ View Detail (Read Only)

### Aksi

* Klik baris

### Halaman

```
/tables/{tableId}/{recordId}
```

Digunakan untuk:

* User view-only
* Arsip penting

---

## 12️⃣ Hapus Data

### Aksi

* Icon 🗑️

### Modal

> Yakin ingin menghapus data ini?
> Tindakan tidak dapat dibatalkan.

---

# D. UX SAFETY & GOVERNANCE

### 🔒 Struktur vs Data

* Jika struktur diubah:

  * Field baru → kosong
  * Field dihapus → data disembunyikan (soft)

### 🔐 Permission Change

* Izin dicabut → UI update realtime
* Aksi langsung diblok

### 🧾 Audit

* Semua aksi penting tercatat

---

# E. RINGKASAN FLOW (SIMPLE)

```
Klik Buat Tabel
→ Isi Identitas
→ Buat Struktur
→ Konfirmasi
→ Tabel Aktif
→ Tim Isi Data
→ Quick Add / Form
```

---
