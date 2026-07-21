<p align="center">
  <img height="72" src="./public/logo.svg" alt="Logo Sadar Judi">
</p>

<h1 align="center">Simulasi Risiko</h1>

<p align="center">
  Simulasi edukatif untuk memahami matematika dan risiko di balik perjudian online.
</p>

<p align="center">
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Vitest" src="https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-GPLv3-blue">
</p>

---

> [!WARNING] > Tidak ada uang, taruhan, atau hadiah nyata. Semua saldo bersifat simulasi (poin palsu) yang tidak dapat ditarik atau diuangkan. Tujuannya murni edukasi.

## Tentang Proyek

**Simulasi Risiko** sengaja meniru tampilan kasino/slot online modern untuk satu alasan: menunjukkan **mengapa pemain selalu kalah dalam jangka panjang**. Alih-alih sekadar memberi nasihat "jangan berjudi", proyek ini membiarkan pengguna mencoba sendiri simulasinya, lalu membuka tabir matematika dan trik psikologis yang membuat perjudian selalu menguntungkan bandar.

Bahkan estetika "mewah" situs ini (emas berkilau, tombol berdenyut, running text promo) adalah bagian dari pelajaran: itulah pola nyata yang dipakai situs judi untuk memikat. Di sini pengguna belajar mengenalinya.

## Fitur Utama

| Fitur                               | Penjelasan                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 🎰 **3 simulasi permainan**         | Slots, Roulette, dan Blackjack dengan mekanika judi yang nyata.                                            |
| 📊 **Peluang & Hadiah transparan**  | Setiap permainan menampilkan peluang, hadiah, dan **nilai harapan (EV) negatif** secara langsung.          |
| 📉 **Pelacak sesi**                 | Total dipertaruhkan vs hasil bersih, sebagai bukti empiris bahwa rumah selalu menang.                      |
| 🎓 **Halaman Edukasi** (`/edukasi`) | House edge, expected value, gambler's fallacy, simulator "berapa lama saldo bertahan", dan kontak bantuan. |
| 💾 **Saldo demo**                   | Disimpan di `localStorage`, dapat di-reset kapan saja lewat tombol di navbar.                              |
| ♿ **Aksesibel & responsif**        | Mendukung layar laptop/desktop dan menghormati `prefers-reduced-motion`.                                   |

## Konsep yang Diajarkan

- **House Edge:** keunggulan matematis bandar pada tiap permainan (Slots ~8%, Roulette ~25%, Blackjack ~5%).
- **Expected Value (EV):** rata-rata hasil per taruhan yang selalu negatif pada judi.
- **Probabilitas:** hadiah besar selalu berpasangan dengan peluang yang sangat kecil.
- **Jebakan psikologis:** gambler's fallacy, efek near-miss, dan chasing losses.

## Teknologi

- [Vue 3](https://vuejs.org/) (Composition & Options API) + [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/) sebagai build tool
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/) untuk styling
- [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) untuk pengujian
- ESLint, Prettier, dan Husky untuk kualitas kode

## Menjalankan Proyek

Butuh **Node.js 20+** (sesuai persyaratan Vite 7).

```bash
# 1. Install dependensi
npm install

# 2. Siapkan git hooks (Husky)
npm run prepare

# 3. Jalankan mode pengembangan
npm run dev
```

Buka alamat yang ditampilkan Vite (biasanya `http://localhost:5173`). Jika port terpakai, Vite memilih port lain otomatis.

## Skrip yang Tersedia

| Skrip              | Fungsi                                            |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Menjalankan server pengembangan.                  |
| `npm run build`    | Membuat bundle produksi ke folder `dist/`.        |
| `npm run preview`  | Pratinjau hasil build di `http://localhost:4173`. |
| `npm run test`     | Menjalankan unit test (Vitest).                   |
| `npm run coverage` | Membuat laporan cakupan test.                     |
| `npm run lint`     | Memeriksa dan memperbaiki gaya kode.              |

## Struktur Proyek

```
src/
├── views/          Halaman utama (Home, Slots, Roulette, Blackjack, Education)
├── components/     Komponen UI (NavBar, GameCard, InfoComponent, dll.)
├── router/         Konfigurasi rute (vue-router, hash history)
├── assets/         CSS global & design system "casino-luxe"
├── Game.js         Model data permainan
└── main.js         Titik masuk aplikasi
public/             Aset statis (logo, favicon, ilustrasi game, audio)
test/               Unit test
```

## Saldo Demo & Penyimpanan

Status sesi disimpan di `localStorage`:

| Kunci          | Arti                                  |
| -------------- | ------------------------------------- |
| `points`       | Saldo demo saat ini (poin palsu).     |
| `totalWagered` | Akumulasi total yang dipertaruhkan.   |
| `netResult`    | Hasil bersih sesi (biasanya negatif). |

Tombol **Reset** di navbar mengembalikan saldo ke 1.000.000 dan menghapus statistik sesi. Untuk mengubah manual: buka DevTools (`F12`) → `Application` → `Local Storage`.

## Butuh Bantuan?

Jika Anda atau orang terdekat kesulitan mengendalikan dorongan berjudi:

- 📞 **SEJIWA / Kemenkes:** hubungi **119 ext. 8** (layanan kesehatan jiwa, gratis).
- 🏥 Konsultasi ke puskesmas atau psikolog terdekat.

Perjudian bukan sumber penghasilan, dan kecanduan judi bisa diobati.

## Kontribusi

Kontribusi dipersilakan. Fork repositori, buat branch fitur, lalu ajukan pull request. Mohon ikuti gaya kode yang ada (ESLint + Prettier dijalankan otomatis oleh Husky).

## Lisensi

Dilisensikan di bawah [GNU General Public License v3.0](./LICENSE).

## Kredit

Dibuat oleh [Wahid Hidayat](https://github.com/whdhdyt21).
