# Reflection Paper – Dzakwan Fatih Fadhilah

## Lead QA & Documentation

### Overview

Dalam proyek SiPilih, saya berperan sebagai Lead Backend yang bertanggung jawab terhadap pengembangan logika bisnis aplikasi, perancangan API, pengelolaan database, integrasi antar layanan, serta memastikan backend dapat digunakan oleh frontend dan service lain yang terhubung di dalam sistem. Melalui proyek ini saya mendapatkan pengalaman baru dalam membangun sistem yang lebih kompleks dengan pendekatan microservices, Docker, API Gateway, monitoring, logging, hingga mekanisme reliability seperti health check, retry logic, dan circuit breaker.

### Challenges

Tantangan terbesar yang saya hadapi selama proyek berlangsung adalah kompleksitas pengembangan backend yang terus meningkat dari minggu ke minggu. Pada awal proyek, backend masih relatif sederhana karena hanya berfokus pada autentikasi pengguna dan manajemen data. Namun semakin lama mengikuti modul dan praktikum, rasanya tingkat kesulitan nya meningkat terus sampai kepala pun mau pecah (bercanda hahaha).

Kendala yang sering dialami :
1. Codingan eror yang tidak sejalan
2. Proses debugging
3. Bermasalah dengan sistem docker dan docker desktop sering eror
4. Kurang fokus sehingga ada tanda khusus yang terlewat dan eror saat sudah dipush.

Selain dari4 di atas, yang terbaru dengan adanya modul microservices. Bisa dibilang ini cukup ribet juga karna setiap fitur harus ada database sendiri dan mengatur ulang lagi dikonfigurasi dengan services yang lain. Pada tahap ini saya mulai memahami bahwa membangun microservices tidak hanya sekadar memisahkan file menjadi beberapa folder, tetapi juga harus memperhatikan komunikasi antar service, dependensi, serta penanganan kegagalan layanan.

Ada juga kejadian dengan teman yang mengubah codingan akibat AI nya terlalu pintar, tetapi tidak sejalan/sesuai dengan apa yang dimau. Akhirnya diperbaiki ulang codingan yang terganti dengan menyesuaikannya, sehingga banyak memakan waktu dan menunda progres kelompok. Kejadian lain dari diri sendiri, yaitu konflik git dan proses merge antar branch. Karena backend mengalami banyak perubahan dalam waktu yang bersamaan, beberapa kali saya menghadapi merge conflict yang cukup membingungkan. Ada kondisi di mana file yang sebelumnya sudah berjalan dengan baik tiba-tiba hilang setelah proses merge atau stash. Beberapa fitur seperti logging, metrics, circuit breaker, dan health endpoint sempat harus diperiksa ulang satu per satu untuk memastikan tidak ada bagian yang terhapus secara tidak sengaja.

Sebenarnya yang bikin lama itu perbaikan dari proses codingan eror, ada sesuatu yang ga sengaja terubah dan berpengaruh ke yang lain, proses debugging, dan lain lain yang memakan waktu lama.

### Experience as Backend Developer

Sebagian besar pekerjaan saya berfokus pada pembuatan API, validasi data, pengelolaan database, dan integrasi antar service. Saya mengembangkan berbagai endpoint untuk autentikasi pengguna, pengelolaan kandidat, proses voting, hingga penyajian hasil voting yang nantinya digunakan frontend untuk menampilkan visualisasi data.

Saya juga cukup banyak menghabiskan waktu untuk melakukan testing dan debugging. Beberapa kali GitHub Actions menunjukkan status gagal meskipun aplikasi berjalan normal di komputer lokal. Salah satu kasus yang cukup membingungkan terjadi ketika seluruh endpoint terlihat berfungsi dengan baik, tetapi pipeline CI terus gagal karena perubahan kecil pada logika verifikasi pengguna. Dari pengalaman tersebut saya belajar bahwa proses testing otomatis sering kali mampu menemukan masalah yang tidak langsung terlihat selama pengembangan.

Selain coding, saya juga harus berkoordinasi dengan anggota frontend dan DevOps. Frontend sangat bergantung pada API yang saya sediakan, sehingga perubahan kecil pada response API dapat berdampak pada tampilan aplikasi. Sementara itu, DevOps membutuhkan konfigurasi backend yang stabil agar deployment dan monitoring dapat berjalan dengan baik.

### Experience as Backend Developer

Melalui proyek ini saya mendapatkan banyak pembelajaran yang sebelumnya belum pernah saya rasakan dalam proyek perkuliahan biasa.

Saya menjadi lebih memahami bagaimana sebuah sistem backend dirancang untuk mendukung aplikasi yang lebih besar dan kompleks. Saya belajar mengenai pemisahan service, komunikasi antar API, validasi data, autentikasi berbasis token, observability, monitoring, dan reliability pattern yang sebelumnya hanya saya ketahui secara teoritis.

Selain kemampuan teknis, proyek ini juga meningkatkan kemampuan problem solving saya. Sebagian besar waktu pengembangan backend ternyata bukan digunakan untuk menulis kode baru, melainkan untuk membaca error, menganalisis log, melakukan debugging, dan mencari akar penyebab suatu masalah. Dari proses tersebut saya belajar untuk lebih sabar dan sistematis ketika menghadapi kendala teknis.

Saya juga menjadi lebih memahami pentingnya penggunaan Git dalam proyek kolaboratif. Merge conflict, branch management, dan pull request yang sebelumnya terasa rumit kini menjadi bagian yang cukup sering saya gunakan selama pengembangan.

### Reflection

Jika waktu bisa diulang mungkin tidak akan membolos, tidak datang telat, dan memperhatikan saat praktikum cc ini hahaha. Karena terlewat dan tidak memperhatikan 1 week saja sudah bikin pusing sendiri dengan pengerjaan ini meskipun dengan bantuan AI juga. Meskipun selama pengerjaan proyek saya sering mengalami frustrasi akibat error yang sulit ditemukan, merge conflict yang berulang, serta debugging yang memakan waktu lama, pengalaman tersebut justru menjadi bagian yang paling berharga. Saya menyadari bahwa pekerjaan backend tidak hanya tentang membuat endpoint berjalan, tetapi juga memastikan sistem tetap stabil, aman, dan dapat diandalkan ketika digunakan oleh pengguna maupun service lain.

### Conclusion

Secara keseluruhan, proyek SiPilih memberikan pengalaman yang sangat berharga bagi saya sebagai Lead Backend. Saya tidak hanya belajar membangun API dan mengelola database, tetapi juga memahami bagaimana sebuah sistem backend modern dirancang, diintegrasikan, dan dipelihara dalam lingkungan cloud yang melibatkan banyak komponen.

Meskipun menghadapi berbagai tantangan mulai dari debugging, microservices, merge conflict, hingga kegagalan pipeline CI/CD, seluruh proses tersebut memberikan pengalaman nyata yang tidak saya dapatkan hanya dari teori di kelas. Proyek ini membantu saya mengembangkan kemampuan teknis, kemampuan problem solving, serta kemampuan bekerja dalam tim yang akan sangat berguna untuk proyek maupun pekerjaan di masa depan.