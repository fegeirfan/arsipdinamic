
---

# 🧭 ALUR UI DESIGN & STYLING

## **POLARIX — Arsip Digital Tanpa Batas Struktur**

---

## 1️⃣ LANDING PAGE (Public)

### 🎯 Tujuan UX

* Menjelaskan **apa itu POLARIX**
* Menegaskan **“Tanpa Batas Struktur”**
* Mengarahkan user ke **Login**

---

### 🧱 Struktur Halaman

```
Header
Hero Section
Value Proposition
Feature Highlight
Role Explanation
Call to Action
Footer
```

---

### 🔝 Header

* Logo **POLARIX**
* Menu (opsional): Fitur, Tentang, Login
* Button **Login** (Primary)

**Styling**

* Background: putih
* Logo warna Polar Indigo
* Button login: Indigo solid

---

### 🌌 Hero Section (Bagian Paling Penting)

**Konten:**

* Headline besar:

  > **Arsip Digital Tanpa Batas Struktur**
* Subheadline:

  > Kelola arsip secara fleksibel, dinamis, dan terkontrol tanpa coding.
* CTA:

  * **Masuk ke Sistem**
  * Secondary: Lihat Fitur

**Styling**

* Background: gradient Midnight Blue → Indigo
* Text putih
* Accent glow cyan halus
* Ilustrasi abstrak (grid / node / struktur bebas)

---

### 💎 Value Proposition

3–4 card horizontal:

* Dynamic Table
* Role & Permission
* Public / Private Archive
* Secure & Scalable

**Styling**

* Card putih
* Icon cyan
* Shadow lembut

---

### 👥 Role Explanation

Dua kolom:

* **Admin**
* **Staf (PIC)**

Menjelaskan peran masing-masing secara ringkas.

---

### 🚀 CTA Section

* Background Indigo
* Text putih
* Button **Login Sekarang**

---

## 2️⃣ LOGIN PAGE

### 🎯 Tujuan UX

* Login cepat
* Tidak distraktif
* Aman & profesional

---

### 🧱 Struktur

```
Left: Branding
Right: Login Form
```

---

### ✨ Left Panel (Brand)

* Logo POLARIX
* Tagline:

  > Arsip Digital Tanpa Batas Struktur

**Styling**

* Background Midnight Blue
* Accent Cyan
* Clean, minimal

---

### 🔐 Right Panel (Form)

Form:

* Email
* Password
* Button **Masuk**

Tambahan:

* Error message jelas
* Loading state

**Styling**

* Background putih
* Input rounded
* Button Indigo

---

### 🔀 Alur Setelah Login

* Role = **Admin** → Dashboard Admin
* Role = **Staf** → Dashboard Staf

---

## 3️⃣ DASHBOARD LAYOUT (ADMIN & STAF)

### 🧱 Layout Umum

```
Topbar
Sidebar
Main Content
```

---

### 📌 Sidebar

* Logo kecil POLARIX
* Menu (berbeda sesuai role)

**Styling**

* Background: Midnight Blue
* Text putih
* Active menu: Cyan indicator

---

### 🔝 Topbar

* Page title
* Search global
* Avatar user

---

## 4️⃣ DASHBOARD ADMIN

### 🎯 Fokus UX

* Kontrol
* Monitoring
* Otoritas

---

### 📊 Halaman Dashboard

Komponen:

* Statistik (card)
* Aktivitas terbaru
* Shortcut:

  * Buat Tabel
  * Manajemen User

**Styling**

* Card putih
* Angka besar
* Icon Indigo

---

### 📁 Manajemen Tabel

* Table list
* Badge:

  * Public / Private
  * PIC

Aksi:

* Builder
* Permission
* Delete

---

### 🔐 Permission Page

* Permission Matrix (checkbox)
* Inline update
* Toast feedback

---

## 5️⃣ DASHBOARD STAF

### 🎯 Fokus UX

* Produktivitas
* Kesederhanaan
* Tanggung jawab (PIC)

---

### 📊 Halaman Dashboard Staf

Komponen:

* Tabel yang dimiliki (PIC)
* Tabel public
* Arsip terbaru

---

### 📁 Tabel Arsip

* Akses hanya tabel:

  * PIC
  * Diizinkan
  * Public

Badge:

* **PIC**
* **Read Only**

---

### 🧱 Builder (Jika PIC)

* Sama dengan admin
* Tapi **tanpa akses user management**

---

## 6️⃣ STYLING KONSISTEN (ADMIN & STAF)

### 🎨 Warna

* Primary: Polar Indigo
* Accent: Cyan
* Background: Soft Gray

---

### 🔤 Typography

* Heading tegas
* Body ringan
* Data mudah dibaca

---

### 🧩 Komponen Konsisten

* Button
* Card
* Table
* Badge
* Modal

---

## 7️⃣ UX FLOW RINGKAS

```
Landing Page
   ↓
Login
   ↓
Role Check
   ↓
Admin Dashboard / Staff Dashboard
   ↓
Tabel Arsip
   ↓
Input / Edit / Permission
```

---

## 8️⃣ Prinsip UX POLARIX

* Jangan buat user mikir struktur
* Sistem yang menyesuaikan user
* Aksi penting maksimal 2 klik
* Selalu tampilkan status & peran

---

## 🚀 Next Step

Kalau mau, aku bisa:
1️⃣ Buat **wireframe teks per halaman (Figma-ready)**
2️⃣ Mapping ke **Next.js layout.tsx**
3️⃣ Buat **Tailwind theme config**
4️⃣ Buat **user flow diagram**

Tinggal bilang mau lanjut ke **desain** atau **kode** 👍
