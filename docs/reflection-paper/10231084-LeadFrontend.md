# Reflection Paper – Risky Nur Fatimah Bahar

## Lead Frontend Developer

---

## Overview

Dalam proyek SIPILIH, saya berperan sebagai Lead Frontend Developer. Tanggung jawab utama saya adalah membangun seluruh antarmuka pengguna aplikasi, memastikan setiap fitur yang dikembangkan dapat diakses dengan baik oleh pengguna, serta menjaga konsistensi pengalaman pengguna di seluruh halaman sistem. Selain itu, saya juga bertanggung jawab dalam mengelola integrasi antara frontend dan backend, termasuk pengelolaan API, routing, state aplikasi, serta pengaturan akses berdasarkan role pengguna.

Sebelum mengikuti proyek ini, saya memiliki pemahaman dasar mengenai pengembangan frontend menggunakan React, namun masih terbatas pada pembuatan komponen sederhana dan belum terlalu memahami bagaimana sebuah frontend berinteraksi dengan sistem backend yang kompleks. Terutama dalam konteks autentikasi, validasi user, serta sistem berbasis role dan status verifikasi. Melalui proyek ini, saya mendapatkan pengalaman langsung dalam membangun frontend yang tidak hanya berfungsi sebagai tampilan, tetapi juga sebagai bagian penting dari arsitektur sistem secara keseluruhan.

---

## Challenges

Selama proses pengembangan, tantangan terbesar yang saya hadapi adalah menjaga konsistensi antara frontend dengan perubahan yang terjadi pada backend. Dalam beberapa tahap pengembangan, struktur backend mengalami perubahan, termasuk transisi dari pendekatan microservices menuju monolith. Perubahan ini menyebabkan beberapa endpoint yang sebelumnya digunakan di frontend menjadi tidak relevan, sehingga saya harus melakukan penyesuaian ulang pada service API agar tetap sesuai dengan kondisi backend terbaru.

Selain itu, saya juga menghadapi tantangan dalam menangani berbagai kondisi edge case pada frontend, seperti user yang belum terverifikasi, data kosong, serta error response dari API. Pada beberapa kasus, ditemukan bahwa user yang belum melalui proses verifikasi masih dapat mengakses halaman tertentu sebelum validasi backend diterapkan secara ketat. Hal ini membuat saya perlu menambahkan proteksi tambahan di sisi frontend, meskipun saya menyadari bahwa kontrol utama tetap harus berada di backend.

Tantangan lainnya adalah ketidaksesuaian struktur data antara backend dan frontend, terutama pada bagian hasil voting dan data kandidat. Beberapa response API tidak selalu sesuai dengan struktur yang diharapkan oleh frontend, sehingga muncul kasus seperti kategori “lainnya” atau data yang tidak terpetakan dengan benar. Hal ini membuat logika frontend menjadi lebih kompleks karena harus melakukan penyesuaian tambahan sebelum data dapat ditampilkan dengan benar.

Selain masalah teknis, saya juga menghadapi tantangan dalam memahami alur sistem secara keseluruhan, karena frontend sangat bergantung pada keputusan arsitektur backend. Setiap perubahan kecil di backend berdampak langsung pada implementasi frontend, sehingga saya harus lebih sering melakukan debugging lintas layer untuk memastikan aplikasi tetap berjalan dengan stabil.

---

## Experience as Lead Frontend Developer

Dalam proses pengembangan, sebagian besar waktu saya dihabiskan untuk membangun dan memperbaiki antarmuka pengguna menggunakan React. Saya bertanggung jawab dalam membangun halaman login, dashboard, manajemen user, daftar kandidat, serta halaman hasil voting. Selain itu, saya juga mengatur routing aplikasi dan memastikan hanya user dengan role tertentu yang dapat mengakses halaman tertentu.

Saya juga melakukan refactoring pada beberapa komponen frontend agar lebih modular dan mudah dikelola. Beberapa komponen yang tidak digunakan dihapus untuk menjaga kebersihan struktur proyek. Selain itu, saya memperbaiki alur komunikasi antara frontend dan backend dengan menyesuaikan service API agar lebih konsisten dengan struktur backend yang terus berkembang.

Dalam proses ini, saya juga banyak melakukan debugging terhadap error yang muncul akibat perubahan endpoint atau ketidaksesuaian response API. Hal ini membuat saya lebih memahami bahwa frontend tidak berdiri sendiri, tetapi sangat bergantung pada stabilitas backend dan konsistensi data yang dikirimkan.

---

## Learning Outcomes

Dari proyek ini, saya belajar bahwa pengembangan frontend tidak hanya berfokus pada tampilan antarmuka, tetapi juga pada bagaimana sistem bekerja secara keseluruhan. Saya menjadi lebih memahami pentingnya API contract yang jelas agar komunikasi antara frontend dan backend dapat berjalan dengan stabil tanpa banyak penyesuaian mendadak.

Saya juga belajar bahwa penanganan error, empty state, dan akses user bukan hanya bagian dari UI, tetapi bagian dari desain sistem yang lebih besar. Frontend harus mampu menangani berbagai kondisi sistem yang tidak selalu ideal, terutama ketika terjadi perubahan atau ketidaksesuaian data dari backend.

Selain itu, saya semakin memahami pentingnya struktur kode yang rapi dan modular agar frontend tetap mudah dikembangkan meskipun terjadi banyak perubahan pada backend. Pengalaman ini juga meningkatkan kemampuan saya dalam debugging dan membaca alur sistem secara end-to-end.

---

## Reflection

Jika saya diberikan kesempatan untuk mengulang proyek ini, hal pertama yang ingin saya perbaiki adalah proses sinkronisasi antara frontend dan backend sejak tahap awal pengembangan. Saya menyadari bahwa banyak masalah yang muncul sebenarnya berasal dari perubahan API yang tidak sepenuhnya terkoordinasi, sehingga frontend harus sering melakukan penyesuaian di tengah jalan.

Saya juga akan lebih menekankan pentingnya perancangan API contract yang lebih stabil sejak awal, sehingga frontend tidak perlu terlalu sering menyesuaikan logika ketika terjadi perubahan di backend. Selain itu, saya akan lebih memperhatikan struktur state management agar pengelolaan data dan error handling dapat dilakukan dengan lebih konsisten.

Dari sisi pengalaman pribadi, saya juga menyadari bahwa menjadi frontend developer dalam sebuah sistem yang kompleks membutuhkan pemahaman yang lebih luas, tidak hanya pada UI, tetapi juga bagaimana backend, autentikasi, dan infrastruktur bekerja secara keseluruhan.

---

## Conclusion

Secara keseluruhan, proyek SIPILIH memberikan pengalaman yang sangat berharga bagi saya sebagai Lead Frontend Developer. Meskipun menghadapi banyak tantangan seperti perubahan arsitektur backend, ketidaksesuaian API, serta kompleksitas integrasi sistem, pengalaman ini membantu saya memahami bahwa frontend memiliki peran yang sangat penting dalam menjaga stabilitas dan kualitas pengalaman pengguna.

Proyek ini juga mengajarkan bahwa pengembangan frontend yang baik tidak hanya ditentukan oleh kemampuan membuat tampilan yang menarik, tetapi juga oleh kemampuan untuk beradaptasi dengan sistem yang terus berubah dan memastikan seluruh alur data tetap berjalan dengan konsisten dari backend hingga ke pengguna akhir.