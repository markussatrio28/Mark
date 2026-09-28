# Sebuah Rahasia untukmu

Kejutan ulang tahun statis dengan gerbang PIN, ucapan berlatar galaksi berbentuk hati, puzzle foto yang membuka surat, gulungan foto kenangan bertema film, dan penutup tiga bunga gerbera. Foto referensi dioptimalkan dan disimpan lokal. Project tidak memerlukan proses build atau font eksternal; URL root (`/`) menjadi alamat bersih saat di-deploy.

## Mengganti PIN

Ubah nilai `accessPin` dan `puzzleImage` di objek `EXPERIENCE` dalam `assets/js/entrance.js`. PIN ditulis sebagai enam angka tanpa tanda hubung. Saat foto puzzle baru siap, simpan versi WebP di `assets/images/` dan ganti `puzzleImage`. Ubah `[NAME]` serta `[ISI_SURAT]` di `index.html`.

## Mengganti foto dan teks kenangan

Edit array `memories` di objek `EXPERIENCE` dalam `assets/js/entrance.js`. Untuk tiap frame, isi `image` dengan path relatif seperti `./assets/images/memories/kenangan-01.webp`, lalu ganti `date` dan `story`. Selama `image` kosong, frame menampilkan placeholder `[PHOTO_01]` dan seterusnya. Putar otomatis hanya berjalan setelah tombol **Putar kenangan** ditekan.

Setelah seluruh empat bingkai dilihat, petunjuk **Lanjut scroll** membuka penutup tiga bunga gerbera. Ilustrasi bunga berbentuk SVG di `index.html`, jadi tidak memerlukan asset foto tambahan.

PIN diperiksa di browser untuk menjaga kejutan ringan, bukan untuk melindungi informasi rahasia. Siapa pun yang memeriksa source website dapat melihat kodenya.

## Deploy

### Vercel

1. Push folder ini ke Git provider.
2. Import repository di Vercel dengan framework preset **Other**.
3. Biarkan build command kosong dan gunakan `.` sebagai output directory.
4. Deploy. `vercel.json` mengaktifkan clean URLs dan header respons dasar.

### Netlify

1. Push folder ini ke Git provider atau unggah folder project ke Netlify.
2. Gunakan `.` sebagai publish directory dan biarkan build command kosong.
3. Deploy. `netlify.toml` mengaktifkan pretty URLs dan header respons.

Hubungkan custom domain melalui pengaturan domain di penyedia hosting. Project tidak menyimpan hostname tertentu.
