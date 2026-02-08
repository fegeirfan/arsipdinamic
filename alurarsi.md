Siap, noted 👍
Kita **reset & rapikan ulang**: **TANPA EMOJI**, full **icon system profesional**, **Next.js–ready**.

Di bawah ini adalah **STYLE SYSTEM POLARIX (REVISI FINAL)** yang **selaras dengan web app produksi**, data-heavy, dan instansi-ready.

---

# 🎨 STYLE SYSTEM – POLARIX (NEXT.JS READY)

## Karakter Visual

**Profesional · Tenang · Data-First · Konsisten**

POLARIX **bukan marketing site**, tapi **aplikasi kerja**.
Semua styling harus mendukung **kejelasan data & alur kerja**.

---

## 1️⃣ Icon System (WAJIB TANPA EMOJI)

### Icon Library

Pilih **SATU** dan konsisten:

* **Lucide Icons** ✅ (rekomendasi)
* Heroicons (alternatif)

**Alasan Lucide**

* Ringan
* Stroke konsisten
* Cocok untuk admin dashboard

### Aturan Icon

* Ukuran default: `16px` / `20px`
* Warna: inherit text (`text-slate-600`)
* Icon **bukan dekorasi**, hanya penanda aksi/status

### Contoh Mapping

| Fungsi   | Icon       |
| -------- | ---------- |
| Buat     | `Plus`     |
| Edit     | `Pencil`   |
| Hapus    | `Trash2`   |
| View     | `Eye`      |
| Lock     | `Lock`     |
| Unlock   | `Unlock`   |
| Upload   | `Upload`   |
| Table    | `Table`    |
| User     | `User`     |
| Settings | `Settings` |

---

## 2️⃣ Warna (Color System)

### Palet Utama

```txt
Primary       : indigo-600
Primary Hover : indigo-700
Primary Soft  : indigo-50

Success       : green-600
Success Soft  : green-50

Warning       : amber-600
Danger        : red-600

Text Main     : slate-900
Text Muted    : slate-500

Border        : slate-200
Background    : slate-50 / white
```

### Rules

* **Primary hanya untuk CTA utama**
* Warna merah **hanya** untuk destructive
* Status pakai **soft background**

---

## 3️⃣ Typography

### Font

**Inter** (default Next.js friendly)

```ts
font-sans: ['Inter', 'system-ui', 'sans-serif']
```

### Hierarki Teks

| Elemen         | Class                    |
| -------------- | ------------------------ |
| Page Title     | `text-xl font-semibold`  |
| Section Title  | `text-base font-medium`  |
| Body           | `text-sm`                |
| Meta / Caption | `text-xs text-slate-500` |

📌 Tidak ada ALL CAPS
📌 Line-height nyaman (`leading-relaxed`)

---

## 4️⃣ Layout & Spacing

### Page Layout

```txt
Sidebar | Content
        ├─ Page Header
        ├─ Divider
        └─ Main Content
```

### Spacing Rule

* Base: **4px system**
* Page padding: `px-6 py-4`
* Section gap: `space-y-4`

---

## 5️⃣ Card & Container

### Card Style

```txt
bg-white
border border-slate-200
rounded-lg
shadow-none
```

Card hanya untuk:

* Statistik
* Form
* Konfirmasi

❌ Jangan bungkus tabel dengan card berlebihan

---

## 6️⃣ Table Styling (KOMPONEN UTAMA)

### Table Container

* Scroll horizontal jika perlu
* Header sticky (opsional)

### Header

```txt
bg-slate-50
text-slate-600
text-sm font-medium
```

### Row

* Hover: `hover:bg-slate-50`
* Selected: `bg-indigo-50`

### Cell

```txt
px-3 py-2
text-sm
align-middle
```

### Inline Edit

* Default: text
* Active:

  * `bg-white`
  * `border border-indigo-300`
  * `focus:ring-2 focus:ring-indigo-200`

📌 Grid line **tipis atau minimal**

---

## 7️⃣ Button System

### Button Variants

| Variant     | Style                      |
| ----------- | -------------------------- |
| Primary     | `bg-indigo-600 text-white` |
| Secondary   | `border border-slate-300`  |
| Ghost       | `hover:bg-slate-100`       |
| Destructive | `bg-red-600 text-white`    |

### Rules

* Maks 1 Primary per view
* Icon + text → jarak `gap-2`
* Icon-only → tooltip wajib

---

## 8️⃣ Form & Input

### Input

```txt
h-9
border border-slate-300
rounded-md
text-sm
```

### Focus

```txt
focus:border-indigo-500
focus:ring-2 focus:ring-indigo-200
```

### Read-only

```txt
bg-slate-50
text-slate-500
cursor-not-allowed
```

### Error

* Text kecil merah
* Inline, bukan toast

---

## 9️⃣ Badge & Status Indicator

### Badge Style

```txt
inline-flex items-center
rounded-full
px-2 py-0.5
text-xs font-medium
```

### Contoh

| Status   | Style                          |
| -------- | ------------------------------ |
| PIC      | `bg-indigo-50 text-indigo-700` |
| Private  | `bg-slate-100 text-slate-700`  |
| Pending  | `bg-amber-50 text-amber-700`   |
| Approved | `bg-green-50 text-green-700`   |

---

## 🔔 10️⃣ Feedback & State

### Toast

* Posisi: kanan atas
* Tidak blocking
* Auto dismiss

### Loading

* Skeleton lebih diutamakan
* Inline loader untuk edit cell

### Empty State

* Icon (Lucide)
* Copy jelas
* CTA terlihat

---

## 11️⃣ Modal & Dialog

### Modal

* Centered
* Width konsisten
* Focus trap

### Confirm Dialog

* Judul jelas
* Aksi destruktif di kanan

---

## 12️⃣ Motion & Interaction

### Animasi

* 120–180ms
* Ease-in-out
* Tidak berlebihan

❌ No bounce
❌ No flashy animation

---

## 13️⃣ Accessibility (WAJIB)

* Kontras WCAG
* Fokus state jelas
* Semua icon-only button punya `aria-label`

---

## 14️⃣ DO & DON’T

### DO

* Konsisten antar halaman
* Gunakan icon sebagai aksi
* Fokus ke data

### DON’T

* Emoji
* Warna random
* Icon tanpa makna

---

## 15️⃣ Identitas Visual POLARIX

> **POLARIX = sistem arsip modern untuk kerja serius**
> Tenang, rapi, dan dapat dipercaya.

---

## Next Step Paling Ideal

Aku bisa:
1️⃣ Buat **Tailwind config + design token**
2️⃣ Buat **UI Kit React (Button, Table, Badge)**
3️⃣ Contoh **1 halaman tabel full styled**
4️⃣ Layout admin & user final

Tinggal bilang mau lanjut ke mana, kita langsung turunin ke kode 🚀
