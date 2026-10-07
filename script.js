
(function(){
  const $ = (s,r)=> (r||document).querySelector(s);
  const $all = (s,r)=> Array.from((r||document).querySelectorAll(s));
  const app = $('#app');
  const backgroundMusic = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');

  function updateMusicButton(isPlaying){
    musicToggle.innerHTML = `${isPlaying ? '🔊' : '🔇'} <span>Musik</span>`;
    musicToggle.setAttribute('aria-label', isPlaying ? 'Jeda backsound' : 'Putar backsound');
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.classList.toggle('playing', isPlaying);
  }

  musicToggle.addEventListener('click', async ()=>{
    if(backgroundMusic.paused){
      try{
        await backgroundMusic.play();
        updateMusicButton(true);
      }catch{
        updateMusicButton(false);
      }
    }else{
      backgroundMusic.pause();
      updateMusicButton(false);
    }
  });
  backgroundMusic.volume = 0.35;
  backgroundMusic.addEventListener('pause', ()=> updateMusicButton(false));
  backgroundMusic.addEventListener('play', ()=> updateMusicButton(true));

  /* ---------- DATA ---------- */
  const charDB = {
    alex: { name:'Alex', role:'Ketua OSIS', avatar:'avatar-alex',
      personality:'Tenang, bertanggung jawab, sedikit protektif soal reputasi OSIS.',
      topics:{
        waktu:'"Aku ada di ruang guru dari jam 11.45 sampai 12.30, rapat sama Bu Sari buat acara perpisahan."',
        ruang:'"Aku memang pemegang kunci utama Ruang OSIS, tapi hari itu aku nggak sempat ke sana sampai piala dilaporkan hilang."',
        orang:'"Setahuku Naya sering mampir ke Ruang OSIS buat urusan sekretaris kelas. Raka juga kadang lewat situ kalau mau ke lapangan."'
      },
      reactions:{ default:'"Hmm, kalau itu benar, berarti memang ada yang masuk sekitar jam segitu. Aku sendiri nggak lihat apa-apa yang mencurigakan."' }
    },
    naya: { name:'Naya', role:'Sekretaris kelas', avatar:'avatar-naya',
      personality:'Teliti, suka mencatat detail, sedikit gugup kalau ditanya beruntun.',
      topics:{
        waktu:'"Aku terakhir lihat pialanya masih ada di rak sekitar jam 12.00, sebelum aku ke kantin bareng anak-anak sekelas."',
        ruang:'"Aku ke sana buat ambil map absensi kelas, itu rutin tiap istirahat pertama."',
        orang:'"Aku sempat papasan sama Sinta di depan perpus waktu jalan ke kantin. Nggak lihat Alex atau Raka sih."'
      },
      reactions:{ C:'"Iya, itu bener — aku emang lihat pialanya masih ada di rak jam segitu."', default:'"Aku nggak tahu soal itu, tapi semoga membantu penyelidikanmu."' }
    },
    raka: { name:'Raka', role:'Anggota ekstrakurikuler basket', avatar:'avatar-raka',
      personality:'Santai di permukaan, tapi jadi defensif kalau disinggung soal Ruang OSIS.',
      topics:{
        waktu:'"Aku di lapangan terus sepanjang istirahat, latihan basket, nggak ke mana-mana."',
        ruang:'"Ngapain aku ke Ruang OSIS? Aku bukan pengurus OSIS."',
        orang:'"Nggak tahu, aku fokus latihan aja tadi."'
      },
      reactions:{
        A:'"Oh... itu... latihan emang dibatalkan sih hari itu, tapi aku tetep ke lapangan kok, cuma... duduk-duduk aja."',
        D:'"Itu... itu bukan aku. Mungkin anak lain yang beli di sana."',
        E:'"Aku nggak lihat CCTV manapun waktu itu, aku di lapangan."',
        default:'"Nggak ada hubungannya sama aku deh."'
      }
    },
    sinta: { name:'Sinta', role:'Penjaga perpustakaan', avatar:'avatar-sinta',
      personality:'Pendiam, pengamat yang baik, jarang berasumsi tanpa bukti.',
      topics:{
        waktu:'"Aku jaga meja pinjam-kembali sepanjang istirahat."',
        ruang:'"Aku jarang ke sana, kecuali dipanggil OSIS buat urusan buku."',
        orang:'"Aku sempat lihat Naya lewat depan perpus bareng anak-anak sekelas, jalan ke arah kantin, sekitar jam 12.05."'
      },
      reactions:{ default:'"Aku nggak lihat langsung siapa yang ke Ruang OSIS, cuma dengar-dengar dari anak-anak."' }
    }
  };

  const clueDB = {
    A: { tag:'Catatan Jadwal', location:'Ruang OSIS — Meja', time:'09:42', text:'Sobekan kertas jadwal latihan ekstrakurikuler basket. Ada coretan: latihan hari ini DIBATALKAN karena lapangan dipakai acara lain.' },
    B: { tag:'Kunci di Lantai', location:'Ruang OSIS — Jendela', time:'09:47', text:'Sebuah kunci Ruang OSIS tergeletak dekat jendela, seolah terjatuh saat seseorang buru-buru keluar lewat sana.' },
    C: { tag:'Rak Kosong', location:'Ruang OSIS — Rak Piala', time:'09:50', text:'Bekas debu berbentuk piala masih terlihat di rak. Naya sempat bilang dia melihat piala masih ada sekitar jam 12.00.' },
    D: { tag:'Struk Kantin', location:'Ruang OSIS — Laci', time:'10:05', text:"Struk kantin dekat Ruang OSIS (bukan kantin utama) tercatat atas nama 'R', jam 12.15 — bertepatan dengan waktu piala terakhir terlihat." },
    E: { tag:'Cetakan CCTV', location:'Ruang OSIS — CCTV', time:'09:55', text:'Cetakan rekaman CCTV depan Ruang OSIS menunjukkan siluet seseorang berjaket olahraga masuk sekitar jam 12.15. Wajah tidak terlalu jelas.' }
  };

  const objects = [
    { id:'meja', label:'🪑 Periksa Meja', clue:'A' },
    { id:'lemari', label:'🗄️ Periksa Lemari', flavor:'Lemari berisi alat tulis dan berkas OSIS, tersusun rapi. Tidak ada yang aneh di sini.' },
    { id:'papan', label:'📋 Periksa Papan Pengumuman', flavor:'Papan berisi jadwal ekstrakurikuler dan agenda OSIS minggu ini. Sekilas tidak mencurigakan — tapi mungkin berguna dibandingkan dengan jadwal lain yang kamu temukan.' },
    { id:'pintu', label:'🚪 Periksa Pintu', flavor:'Pintu terkunci normal dari luar. Tidak ada tanda kerusakan atau paksaan.' },
    { id:'jendela', label:'🪟 Periksa Jendela', clue:'B' },
    { id:'rak', label:'🏆 Periksa Rak Piala', clue:'C' },
    { id:'cctv', label:'📹 Periksa CCTV', clue:'E' },
    { id:'laci', label:'🗃️ Periksa Laci (Terkunci)', clue:'D', puzzle:true },
    { id:'saksi', label:'👤 Bicara dengan Saksi', nav:'characterlist' },
    { id:'catatan', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  /* ---------- KASUS 2 DATA ---------- */
  const clueDB2 = {
    KA: { tag:'Jejak Sepatu', location:'Koridor', time:'08:12', text:'Jejak sepatu kecil mengarah dari pintu kelas 2B ke arah tangga, lalu menghilang di lorong yang ramai.' },
    KB: { tag:'Papan Jadwal Kelas', location:'Koridor', time:'08:14', text:'Papan jadwal menunjukkan kelas 2B piket pagi ini jam 08.00–08.15, sebelum jam pelajaran pertama.' },
    KC: { tag:'Rekaman CCTV Koridor', location:'Koridor', time:'08:20', text:'CCTV menunjukkan Dita berdiri di depan pintu kelas 2B sekitar jam 08.10, lalu masuk sebentar. Farel terlihat lewat koridor jam 08.20 tanpa masuk kelas.' },
    KD: { tag:'Catatan Peminjaman Kunci', location:'Koridor — Meja Piket', time:'08:16', text:"Catatan menunjukkan kunci cadangan kelas 2B dipinjam pukul 08.15. Nama peminjam tertulis buram, hanya terlihat inisial 'D'." },
    KE: { tag:'Catatan Piket', location:'Koridor — Papan Piket', time:'08:18', text:'Jadwal piket menunjukkan Dita bertugas piket kelas 2B pagi ini.' },
    BA: { tag:'Foto Kelas', location:'Kotak Misterius', time:'09:02', text:"Foto lama kelas 2B tahun lalu. Di baliknya tertulis: 'Buat kenangan, jangan sampai hilang.'" },
    BB: { tag:'Kartu Perpustakaan Lama', location:'Kotak Misterius', time:'09:02', text:'Kartu perpustakaan atas nama Dita, sudah tidak berlaku sejak tahun lalu.' },
    BC: { tag:'Potongan Kertas', location:'Kotak Misterius', time:'09:02', text:'Sobekan kertas yang jika disatukan dengan coretan di papan kelas, membentuk tulisan tangan yang sama persis.' },
    BD: { tag:'Salinan Jadwal Piket', location:'Kotak Misterius', time:'09:02', text:'Salinan jadwal piket kelas 2B yang menandai Dita sebagai petugas piket pagi ini.' },
  };

  const objects2 = [
    { id:'sepatu', label:'👟 Periksa Jejak Sepatu', clue:'KA' },
    { id:'papan2', label:'📋 Periksa Papan Jadwal', clue:'KB' },
    { id:'cctv2', label:'📹 Periksa CCTV Koridor', clue:'KC' },
    { id:'kunci2', label:'🔑 Periksa Catatan Kunci', clue:'KD' },
    { id:'piket', label:'📝 Periksa Catatan Piket', clue:'KE' },
    { id:'kotak', label:'📦 Periksa Kotak Misterius', puzzle:true },
    { id:'saksi2', label:'👤 Bicara dengan Saksi', nav:'characterlist2' },
    { id:'catatan2', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  const charDB2 = {
    dita: { name:'Dita', role:'Siswa kelas 2B', avatar:'avatar-dita',
      personality:'Ceria di depan orang, tapi gampang gugup kalau ditanya soal kelas 2B pagi itu.',
      topics:{
        waktu:'"Pagi tadi? Aku... di kantin sih, kayak biasa."',
        ruang:'"Aku sama sekali nggak masuk kelas 2B pagi ini."',
        orang:'"Farel sama Mira? Nggak tahu, aku nggak merhatiin."'
      },
      reactions:{
        KC:'"I-itu... mungkin aku emang lewat sebentar, tapi cuma naruh tas doang kok!"',
        KD:'"Bukan aku yang pinjam kunci! ...atau, mungkin iya, tapi itu buat piket doang."',
        BC:'"Itu... itu tulisan aku. Tapi bukan berarti aku yang kunci ruangannya!"',
        default:'"Aku nggak tahu apa-apa soal itu."'
      }
    },
    farel: { name:'Farel', role:'Siswa kelas 2B', avatar:'avatar-farel',
      personality:'Santai, jujur apa adanya, tidak banyak basa-basi.',
      topics:{
        waktu:'"Aku cuma lewat koridor pagi ini, mau ke kantin."',
        ruang:'"Aku cuma lewat depan kelas 2B, nggak masuk."',
        orang:'"Aku lihat Dita berdiri di depan pintu kelas sebentar, sekitar jam segitu."'
      },
      reactions:{ default:'"Aku nggak tahu lebih dari itu, aku emang cuma lewat."' }
    },
    mira: { name:'Mira', role:'Siswa kelas 2B', avatar:'avatar-mira',
      personality:'Tenang, suka baca, jawabannya selalu runtut.',
      topics:{
        waktu:'"Aku di perpustakaan dari jam 08.00 sampai bel masuk."',
        ruang:'"Aku nggak ke kelas 2B sama sekali pagi ini."',
        orang:'"Aku nggak lihat siapa-siapa, aku fokus baca di perpus."'
      },
      reactions:{ default:'"Itu di luar yang aku lihat, aku dari tadi di perpustakaan."' }
    }
  };

  const clueDB3 = {
    A: { tag:'Waktu Pesan Dikirim', location:'Grup Chat Sekolah', time:'06:02', text:'Pesan "Besok sekolah diliburkan" terkirim pukul 05.47 pagi — jauh lebih awal dari jam pengumuman resmi sekolah yang biasanya.' },
    B: { tag:'Nomor Pengirim', location:'Grup Chat Sekolah', time:'06:03', text:'Nomor pengirim memakai nama profil "Admin Sekolah", tapi nomornya tidak cocok dengan kontak resmi humas sekolah.' },
    C: { tag:'Gaya Bahasa Pesan', location:'Grup Chat Sekolah', time:'06:05', text:'Pesan ditulis santai dan penuh singkatan — jauh berbeda dari gaya pengumuman resmi sekolah yang biasanya formal dan baku.' },
    D: { tag:'Foto yang Digunakan', location:'Grup Chat Sekolah', time:'06:06', text:'Foto gerbang sekolah di pesan itu ternyata diambil dari acara study tour tahun lalu, bukan foto resmi humas sekolah.' },
    E: { tag:'Layar Kunci Komputer Lab', location:'Lab Komputer 07', time:'07:10', text:'Layar kunci komputer menunjukkan akun "kevin_22" terakhir login pukul 05.30, tidak lama sebelum pesan itu dikirim.' },
    F: { tag:'Buku Absen Gerbang', location:'Gerbang Sekolah', time:'07:15', text:'Buku absen manual satpam mencatat Reno masuk gerbang pukul 05.25, bahkan lebih awal dari Kevin yang tercatat pukul 05.28.' },
    G: { tag:'File Gambar Pengumuman', location:'Lab Komputer 07 — Folder Downloads', time:'07:25', text:'File gambar pengumuman palsu ditemukan tersimpan di folder Downloads komputer ini, dibuat pukul 05.40 — masih dalam sesi login akun kevin_22.' },
  };

  const objects3Pesan = [
    { id:'waktupesan', label:'⏰ Periksa Waktu Pesan', clue:'A' },
    { id:'nomorpengirim', label:'📞 Periksa Nomor Pengirim', clue:'B' },
    { id:'isipesan', label:'💬 Periksa Gaya Bahasa Pesan', clue:'C' },
    { id:'fotopesan', label:'🖼️ Periksa Foto di Pesan', clue:'D' },
    { id:'saksi3', label:'👤 Bicara dengan Tersangka', nav:'characterlist3' },
    { id:'catatan3', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];
  const objects3Lab = [
    { id:'prasasti', label:'🪧 Periksa Prasasti Sekolah', flavor:'Prasasti di dinding lab bertuliskan: "Sekolah ini berdiri sejak tahun 1998."' },
    { id:'pintulab', label:'🚪 Periksa Plat Nomor Ruang', flavor:'Plat di pintu bertuliskan: "LAB KOMPUTER 07".' },
    { id:'komputer', label:'💻 Periksa Komputer', puzzle:'sandi' },
  ];
  const objects3Gerbang = [
    { id:'bukuabsen', label:'📖 Periksa Buku Absen Gerbang', clue:'F' },
  ];
  const loc3Map = { pesan:objects3Pesan, lab:objects3Lab, gerbang:objects3Gerbang };

  const charDB3 = {
    kevin: { name:'Kevin', role:'Anggota klub IT', avatar:'avatar-kevin',
      personality:'Suka bantu-bantu teknis sekolah, tapi agak ceroboh soal keamanan akun.',
      topics:{
        waktu:'"Aku ke Lab 07 jam 05.30 buat ngeprint tugas, terus langsung balik ke kelas sekitar jam 05.35."',
        ruang:'"Aku emang sering pinjam Lab 07 pagi-pagi buat ngeprint, itu udah biasa buatku."',
        orang:'"Aku sempat lihat Reno di dekat lab pas aku mau keluar, tapi nggak merhatiin dia ngapain."'
      },
      reactions:{
        E:'"Oh iya, itu emang akunku. Tapi aku buru-buru banget waktu itu, mungkin aku lupa logout."',
        G:'"Itu bukan aku yang bikin! Aku beneran nggak tahu soal gambar itu."',
        default:'"Aku nggak tahu apa-apa soal pesan itu."'
      }
    },
    lala: { name:'Lala', role:'Ketua Kelas', avatar:'avatar-lala',
      personality:'Disiplin, datang tepat waktu, cukup khawatir soal reputasi kelasnya.',
      topics:{
        waktu:'"Aku baru sampai sekolah jam 06.15, kayak biasanya."',
        ruang:'"Aku nggak pernah ke Lab 07 pagi-pagi, itu bukan rutinitasku."',
        orang:'"Aku dengar banyak yang udah percaya pesan itu duluan sebelum aku sampai sekolah."'
      },
      reactions:{ default:'"Aku nggak tahu siapa yang bikin itu, aku aja baru tahu pas sampai sekolah."' }
    },
    reno: { name:'Reno', role:'Siswa yang suka bercanda', avatar:'avatar-reno',
      personality:'Humoris, suka bikin lelucon, tapi jadi gugup kalau ditanya detail waktu.',
      topics:{
        waktu:'"Aku baru sampai sekolah jam 06.00 kayak biasa, nggak ada yang aneh kok."',
        ruang:'"Aku? Ke Lab 07? Nggak pernah tuh."',
        orang:'"Aku lihat Kevin sok sibuk di dekat lab pagi itu sih."'
      },
      reactions:{
        F:'"A-aku... oke iya, aku emang datang lebih pagi dari biasanya. Tapi itu doang, aku nggak ngapa-ngapain!"',
        E:'"Itu akun Kevin, bukan punyaku. Aku nggak tahu soal itu."',
        G:'"Itu... itu cuma buat lucu-lucuan kok, nggak nyangka bakal jadi seheboh ini."',
        default:'"Aku nggak tahu apa-apa deh."'
      }
    },
    caca: { name:'Caca', role:'Anggota Mading Sekolah', avatar:'avatar-caca',
      personality:'Tenang, kritis, sering memperhatikan detail media dan komunikasi sekolah.',
      topics:{
        waktu:'"Aku masih di rumah pagi itu, nonton berita sambil sarapan."',
        ruang:'"Aku nggak ke lab, nggak ada urusan ke sana."',
        orang:'"Yang aku curigai sih gaya bahasanya, itu jelas beda banget dari pengumuman resmi sekolah."'
      },
      reactions:{ C:'"Iya bener, itu jelas beda gaya sama pengumuman mading kita. Aku curiga dari awal."', default:'"Aku nggak tahu siapa pelakunya pasti, tapi gaya pesannya mencurigakan."' }
    }
  };

  const clueDB4 = {
    A: { tag:'Residu di Meja Percobaan', location:'Laboratorium', time:'13:20', text:'Meja percobaan sudah dibersihkan rapi, tapi ada sedikit residu cairan kimia yang masih basah — tanda ada yang memakai meja ini lagi setelah jam praktikum resmi selesai.' },
    B: { tag:'Catatan Resmi Percobaan', location:'Laboratorium — Meja', time:'13:22', text:'Catatan resmi hasil percobaan: Percobaan 1 = 75, Percobaan 2 = 82, Percobaan 3 = 91, Percobaan 4 = 88.' },
    C: { tag:'Sobekan di Tempat Sampah', location:'Laboratorium — Tempat Sampah', time:'13:25', text:'Sobekan kertas di tempat sampah menunjukkan angka Percobaan 4 yang dicoret: awalnya tertulis 58, lalu ditimpa jadi angka lain.' },
    D: { tag:'Jam Laboratorium', location:'Laboratorium — Dinding', time:'13:15', text:'Jam dinding laboratorium menunjukkan pukul 13.15 saat kamu memeriksa — bertepatan dengan jadwal pemakaian Kelompok B siang ini.' },
    E: { tag:'Kertas Asli Percobaan 4', location:'Laci Laboratorium', time:'13:40', text:'Kertas asli hasil Percobaan 4 menunjukkan angka 58 — jauh berbeda dari catatan resmi yang beredar (88).' },
    F: { tag:'Pensil Bertuliskan Nama', location:'Laci Laboratorium', time:'13:40', text:"Pensil yang dipakai mencoret sobekan di tempat sampah sama persis dengan pensil bertuliskan nama 'Yoga' yang tergeletak di laci." },
    G: { tag:'Jadwal Penggunaan Lab', location:'Laci Laboratorium', time:'13:40', text:'Jadwal menunjukkan Kelompok A (termasuk Yoga) memakai lab pagi sampai jam 12.00. Jam 13.00–14.00 adalah jatah Kelompok B, bukan Kelompok A.' },
  };

  const objects4 = [
    { id:'meja4', label:'🧪 Periksa Meja Percobaan', clue:'A' },
    { id:'catatan4', label:'📋 Periksa Catatan', clue:'B' },
    { id:'sampah4', label:'🗑️ Periksa Tempat Sampah', clue:'C' },
    { id:'lemari4', label:'🧰 Periksa Lemari Alat', flavor:'Lemari alat tersusun rapi, semua peralatan percobaan lengkap. Tidak ada yang aneh di sini.' },
    { id:'jam4', label:'🕒 Periksa Jam Laboratorium', clue:'D' },
    { id:'laci4', label:'🗄️ Periksa Laci Laboratorium', puzzle:true },
    { id:'saksi4', label:'👤 Bicara dengan Saksi', nav:'characterlist4' },
    { id:'catatanbuku4', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  const charDB4 = {
    bima: { name:'Bima', role:'Kelompok A — praktikum pagi', avatar:'avatar-bima',
      personality:'Santai, to the point, tidak suka berlama-lama di lab.',
      topics:{
        waktu:'"Aku di lab pagi tadi doang, Kelompok A, selesai jam 12.00 langsung ke kantin."',
        ruang:'"Aku nggak balik lagi ke lab siang ini, ada pelajaran lain."',
        orang:'"Aku lihat Yoga masih di lab pas aku mau keluar sih, kayak lagi beresin sesuatu."'
      },
      reactions:{ default:'"Aku nggak tahu soal itu, aku udah keluar dari tadi."' }
    },
    sari: { name:'Sari', role:'Kelompok B — praktikum siang', avatar:'avatar-sari',
      personality:'Teliti dan tepat waktu, agak heran kalau jadwal tidak sesuai.',
      topics:{
        waktu:'"Aku Kelompok B, masuk lab jam 13.00 sesuai jadwal buat percobaan kelompokku."',
        ruang:'"Aku baru pertama kali pegang alat-alat itu siang ini."',
        orang:'"Pas aku masuk, aku lihat Yoga masih ada di lab, kayaknya belum pergi dari kelompok pagi."'
      },
      reactions:{ G:'"Iya bener, jadwalku emang jam 13.00, tapi aku kaget masih ada anak kelompok pagi di sana."', default:'"Aku nggak tahu lebih dari itu."' }
    },
    yoga: { name:'Yoga', role:'Kelompok A — praktikum pagi', avatar:'avatar-yoga',
      personality:'Gampang cemas soal nilai, jadi gugup kalau ditanya soal lab siang itu.',
      topics:{
        waktu:'"Aku datang lagi jam 13.00, cuma mau cek-cek hasil percobaan kelompokku."',
        ruang:'"Aku Kelompok A, harusnya udah selesai dari jam 12.00 sih, tapi aku balik lagi bentar."',
        orang:'"Aku nggak lihat siapa-siapa, sepi kok waktu itu."'
      },
      reactions:{
        C:'"I-itu bukan aku... mungkin anak lain yang buang itu."',
        F:'"Itu... itu pensilku sih, tapi bisa aja jatuh di sana dari kemarin."',
        G:'"Oh, jadwal Kelompok B jam segitu ya? Aku nggak tahu, kupikir masih bebas."',
        default:'"Aku nggak ngerti maksudmu."'
      }
    }
  };

  const clueDB5 = {
    A: { tag:'Catatan Peminjaman Kosong', location:'Perpustakaan', time:'10:05', text:'Tidak ada catatan peminjaman untuk buku kode L-17. Padahal biasanya semua peminjaman di perpustakaan ini tercatat rapi tanpa terkecuali.' },
    B: { tag:'Kunci Kecil', location:'Perpustakaan — Rak Tersembunyi', time:'10:20', text:'Di balik rak yang tidak tercatat di katalog, tersembunyi sebuah kunci kecil berkarat, seperti sudah lama tidak disentuh.' },
    C: { tag:'Surat Lama', location:'Perpustakaan — Laci Lama', time:'10:35', text:'Surat lama yang sudah menguning, ditulis tangan, membahas sesuatu yang disembunyikan di sekolah — tapi tidak ditandatangani.' },
    D: { tag:'Potongan Buku', location:'Perpustakaan — Laci Lama', time:'10:35', text:'Sobekan halaman buku tua berisi catatan singkat tentang kejadian-kejadian aneh di sekolah dari tahun-tahun sebelumnya.' },
    E: { tag:'Simbol Misterius', location:'Perpustakaan — Laci Lama', time:'10:35', text:'Selembar kertas kecil bertuliskan deretan simbol aneh yang belum bisa dibaca — sepertinya semacam kode.' },
    F: { tag:'Kode Rak Ditemukan', location:'Perpustakaan — Hasil Dekode', time:'10:50', text:'Setelah simbol berhasil diterjemahkan, muncul sebuah kode: RAK 7 — BUKU 23.' },
    G: { tag:'Buku Misterius', location:'Rak 7 — Buku 23', time:'11:00', text:'Buku ini berisi catatan tentang kejadian-kejadian lama di sekolah. Beberapa di antaranya memiliki pola yang sama — dan pola itu terasa familiar.' },
  };

  const objects5 = [
    { id:'catatanpinjam', label:'📋 Periksa Catatan Peminjaman', clue:'A' },
    { id:'carirak', label:'📚 Cari Rak yang Hilang', nav:'puzzle-rak' },
    { id:'lacilama', label:'🗄️ Periksa Laci Lama', gate:'B', clue3:['C','D','E'] },
    { id:'puzzlesimbol', label:'🧩 Terjemahkan Simbol', gate:'E', nav:'puzzle-simbol' },
    { id:'bukumisterius', label:'📖 Cari Buku Misterius', gate:'F', clue:'G' },
    { id:'hubungan5', label:'🔗 Renungkan Semua Petunjuk', gate:'G', nav:'hubungan5' },
    { id:'catatan5', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  const clueDB6 = {
    A: { tag:'CCTV Ruang OSIS', location:'Ruang OSIS', time:'13:40', text:'Rekaman CCTV di depan Ruang OSIS buram dan tidak bisa memastikan identitas siapa pun yang lewat sekitar jam 13.25. Bukti ini tidak bisa dipakai untuk memastikan apa-apa.' },
    B: { tag:'Catatan Perpustakaan', location:'Perpustakaan', time:'13:42', text:'Buku absen masuk perpustakaan mencatat Dea masuk jam 13.12. Tidak ada nama Nita tercatat masuk perpustakaan sama sekali siang itu.' },
    C: { tag:'Struk Kantin', location:'Kantin', time:'13:45', text:'Struk kantin menunjukkan Nita membeli minuman jam 13.10 — sebelum dia bilang langsung pergi ke perpustakaan.' },
    D: { tag:'Jadwal Kelas', location:'Ruang OSIS — Papan', time:'13:47', text:'Jadwal menunjukkan seluruh siswa kelas Nita, termasuk Nita sendiri, sudah harus ada di kelas untuk pelajaran jam 13.30.' },
    E: { tag:'Kesaksian Siswa', location:'Koridor OSIS', time:'13:50', text:'Seorang siswa mengaku melihat Nita berdiri di depan Ruang OSIS sekitar jam 13.20 — tidak lama sebelum dokumen dilaporkan hilang.' },
  };

  const objects6 = [
    { id:'cctv6', label:'📹 Periksa CCTV', clue:'A' },
    { id:'perpuscatatan6', label:'📖 Periksa Catatan Perpustakaan', clue:'B' },
    { id:'strukkantin6', label:'🧾 Periksa Struk Kantin', clue:'C' },
    { id:'jadwalkelas6', label:'📋 Periksa Jadwal Kelas', clue:'D' },
    { id:'kesaksian6', label:'👥 Periksa Kesaksian Siswa', clue:'E' },
    { id:'puzzlewaktu6', label:'🕒 Susun Garis Waktu', gate:'ALL5', nav:'puzzle-waktu6' },
    { id:'puzzlpernyataan6', label:'🟢🔴🟡 Uji Pernyataan', gate:'waktuSolved', nav:'puzzle-pernyataan6' },
    { id:'saksi6', label:'👤 Bicara dengan Tersangka', nav:'characterlist6' },
    { id:'catatan6', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  const charDB6 = {
    vino: { name:'Vino', role:'Siswa kelas OSIS', avatar:'avatar-vino',
      personality:'Santai, jawabannya singkat dan konsisten.',
      topics:{ alibi:'"Aku di kantin waktu itu, banyak yang lihat aku di sana."' },
      reactions:{ default:'"Aku nggak tahu, aku nggak lihat apa-apa yang aneh."' }
    },
    dea: { name:'Dea', role:'Anggota klub baca', avatar:'avatar-dea',
      personality:'Tenang, suka detail, jawabannya selalu bisa dicek.',
      topics:{ alibi:'"Aku lagi baca buku di perpustakaan, catatannya juga ada kok."' },
      reactions:{ default:'"Aku nggak tahu lebih dari itu, aku fokus baca buku terus."' }
    },
    aldi: { name:'Aldi', role:'Anggota klub futsal', avatar:'avatar-aldi',
      personality:'Ceria, agak cuek soal detail waktu.',
      topics:{ alibi:'"Aku lagi main futsal bareng anak-anak lain di lapangan."' },
      reactions:{ default:'"Aku nggak merhatiin siapa-siapa, sibuk main terus."' }
    },
    nita: { name:'Nita', role:'Sekretaris OSIS', avatar:'avatar-nita',
      personality:'Terlihat tenang dan meyakinkan, tapi jadi gugup kalau ditanya detail.',
      topics:{ alibi:'"Aku juga di perpustakaan kok, samaan sama Dea."' },
      reactions:{
        B:'"Lho? Masa nggak ada namaku... mungkin petugasnya lupa nyatet kali."',
        C:'"I-itu... iya aku emang mampir bentar beli minum, terus langsung ke perpus kok."',
        E:'"Itu... mungkin cuma mirip aku. Aku nggak pernah ke Ruang OSIS."',
        default:'"Aku nggak tahu apa-apa soal itu."'
      }
    }
  };

  const clueDB7 = {
    A: { tag:'Foto Piala Lama', location:'Ruang Rahasia', time:'—', text:'Sebuah foto lama menunjukkan piala sekolah dari Kasus 1, dengan nomor inventaris kecil terukir di alasnya: 204. Kamu tidak pernah menyadari nomor ini sebelumnya.' },
    B: { tag:'Catatan Kode', location:'Ruang Rahasia', time:'—', text:'Secarik catatan berisi ringkasan: "Kode CCTV = 32 • Kode Perpustakaan (Buku) = 23 • Simbol Lab = 102 • Nomor Kasus = 06". Seperti sengaja ditinggalkan untukmu.' },
    C: { tag:'Berkas Lama', location:'Ruang Rahasia', time:'—', text:'Berkas ini merangkum enam kasus yang pernah kamu selidiki. Di sudut setiap halaman, ada simbol misterius yang sama persis.' },
    D: { tag:'Berkas Rahasia Terbuka', location:'Ruang Rahasia', time:'—', text:'Setelah kode berhasil dimasukkan, sebuah berkas tersembunyi terbuka. Isinya membuktikan bahwa kejadian-kejadian sebelumnya bukan sepenuhnya kebetulan — seseorang sengaja meninggalkan rangkaian petunjuk ini untukmu.' },
  };

  const objects7 = [
    { id:'foto7', label:'📷 Periksa Foto', clue:'A' },
    { id:'catatankode7', label:'📜 Periksa Catatan', clue:'B' },
    { id:'berkaslama7', label:'📁 Periksa Berkas Lama', clue:'C' },
    { id:'kunci7', label:'🔑 Periksa Kunci', flavor:'Sebuah kunci tua yang entah membuka apa. Sepertinya lebih bersifat simbolis daripada fungsional.' },
    { id:'puzzlebesar7', label:'🧩 Puzzle Terakhir', gate:'ABC', nav:'puzzle-besar7' },
    { id:'pilihanterakhir7', label:'⚖️ Pilihan Terakhir', gate:'besarSolved', nav:'pilihan7' },
    { id:'analisisterakhir7', label:'🧠 Analisis Terakhir', gate:'choiceMade', nav:'puzzle-analisis7' },
    { id:'catatanbuku7', label:'📓 Buka Buku Catatan', nav:'notebook' },
  ];

  const caseList = [
    { id:'case1', icon:'🏆', name:'Misteri Hilangnya Piala', playable:true },
    { id:'case2', icon:'🔐', name:'Misteri Ruang Kelas Terkunci' },
    { id:'case3', icon:'📱', name:'Pesan Palsu' },
    { id:'case4', icon:'🧪', name:'Misteri Laboratorium' },
    { id:'case5', icon:'📚', name:'Rahasia Perpustakaan' },
    { id:'case6', icon:'🎭', name:'Alibi Sempurna' },
    { id:'case7', icon:'🕵️', name:'Misteri Terakhir' },
  ];

  /* ---------- STATE ---------- */
  let state = {
    clues:{}, charsRead:{}, puzzleSolved:false, puzzleAttempts:0, hearts:3,
    caseStatus:'locked', // locked | progress | done
    dialogueLog:{},
    case2:{
      clues:{}, charsRead:{}, kotakOpened:false, kotakAttempts:0,
      jadwalSolved:false, jadwalAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{}
    },
    case3:{
      clues:{}, charsRead:{}, sandiSolved:false, sandiAttempts:0,
      hearts:3, caseStatus:'locked', dialogueLog:{}, currentLoc:'pesan'
    },
    case4:{
      clues:{}, charsRead:{}, laciOpened:false, laciAttempts:0,
      hearts:3, caseStatus:'locked', dialogueLog:{}
    },
    case5:{
      clues:{}, rakSolved:false, rakAttempts:0, simbolSolved:false, simbolAttempts:0,
      hearts:3, caseStatus:'locked'
    },
    case6:{
      clues:{}, charsRead:{}, waktuSolved:false, waktuAttempts:0,
      pernyataanSolved:false, pernyataanAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{}
    },
    case7:{
      clues:{}, besarSolved:false, besarAttempts:0, choiceMade:null, choiceAttempts:0,
      analisisSolved:false, analisisAttempts:0, hearts:3, caseStatus:'locked'
    }
  };
  let stack = [];               // history of {screen, params}
  let current = { screen:'menu', params:{} };
  let saveExists = false;

  const browserStorage = {
    async get(key){
      try {
        if (window.storage && typeof window.storage.get === 'function') {
          return await window.storage.get(key, false);
        }
        const value = localStorage.getItem(key);
        return value === null ? null : { value };
      } catch (e) {
        return null;
      }
    },
    async set(key, value){
      try {
        if (window.storage && typeof window.storage.set === 'function') {
          await window.storage.set(key, value, false);
          return;
        }
        localStorage.setItem(key, value);
      } catch (e) {
        // best effort only
      }
    },
    async delete(key){
      try {
        if (window.storage && typeof window.storage.delete === 'function') {
          await window.storage.delete(key, false);
          return;
        }
        localStorage.removeItem(key);
      } catch (e) {
        // best effort only
      }
    }
  };

  /* ---------- STORAGE ---------- */
  async function saveProgress(){
    try{
      await browserStorage.set('mystery-school-progress', JSON.stringify({
        clues:state.clues, charsRead:state.charsRead, puzzleSolved:state.puzzleSolved,
        hearts:state.hearts, caseStatus:state.caseStatus,
        case2:state.case2, case3:state.case3, case4:state.case4, case5:state.case5, case6:state.case6, case7:state.case7
      }));
    }catch(e){ /* storage best-effort */ }
  }
  async function loadProgress(){
    try{
      const res = await browserStorage.get('mystery-school-progress');
      if(res && res.value){
        const data = JSON.parse(res.value);
        state.clues = data.clues || {};
        state.charsRead = data.charsRead || {};
        state.puzzleSolved = !!data.puzzleSolved;
        state.hearts = typeof data.hearts === 'number' ? data.hearts : 3;
        state.caseStatus = data.caseStatus || (Object.keys(state.clues).length ? 'progress' : 'locked');
        if(data.case2){
          state.case2 = Object.assign({
            clues:{}, charsRead:{}, kotakOpened:false, kotakAttempts:0,
            jadwalSolved:false, jadwalAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{}
          }, data.case2);
        }
        if(data.case3){
          state.case3 = Object.assign({
            clues:{}, charsRead:{}, sandiSolved:false, sandiAttempts:0,
            hearts:3, caseStatus:'locked', dialogueLog:{}, currentLoc:'pesan'
          }, data.case3);
        }
        if(data.case4){
          state.case4 = Object.assign({
            clues:{}, charsRead:{}, laciOpened:false, laciAttempts:0,
            hearts:3, caseStatus:'locked', dialogueLog:{}
          }, data.case4);
        }
        if(data.case5){
          state.case5 = Object.assign({
            clues:{}, rakSolved:false, rakAttempts:0, simbolSolved:false, simbolAttempts:0,
            hearts:3, caseStatus:'locked'
          }, data.case5);
        }
        if(data.case6){
          state.case6 = Object.assign({
            clues:{}, charsRead:{}, waktuSolved:false, waktuAttempts:0,
            pernyataanSolved:false, pernyataanAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{}
          }, data.case6);
        }
        if(data.case7){
          state.case7 = Object.assign({
            clues:{}, besarSolved:false, besarAttempts:0, choiceMade:null, choiceAttempts:0,
            analisisSolved:false, analisisAttempts:0, hearts:3, caseStatus:'locked'
          }, data.case7);
        }
        saveExists = Object.keys(state.clues).length > 0 || Object.keys(state.charsRead).length > 0
          || Object.keys(state.case2.clues).length > 0 || Object.keys(state.case2.charsRead).length > 0
          || Object.keys(state.case3.clues).length > 0 || Object.keys(state.case3.charsRead).length > 0
          || Object.keys(state.case4.clues).length > 0 || Object.keys(state.case4.charsRead).length > 0
          || Object.keys(state.case5.clues).length > 0
          || Object.keys(state.case6.clues).length > 0 || Object.keys(state.case6.charsRead).length > 0
          || Object.keys(state.case7.clues).length > 0;
      }
    }catch(e){ /* no save yet */ }
  }
  async function clearProgress(){
    try{ await browserStorage.delete('mystery-school-progress'); }catch(e){}
    state = {
      clues:{}, charsRead:{}, puzzleSolved:false, puzzleAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{},
      case2:{ clues:{}, charsRead:{}, kotakOpened:false, kotakAttempts:0, jadwalSolved:false, jadwalAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{} },
      case3:{ clues:{}, charsRead:{}, sandiSolved:false, sandiAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{}, currentLoc:'pesan' },
      case4:{ clues:{}, charsRead:{}, laciOpened:false, laciAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{} },
      case5:{ clues:{}, rakSolved:false, rakAttempts:0, simbolSolved:false, simbolAttempts:0, hearts:3, caseStatus:'locked' },
      case6:{ clues:{}, charsRead:{}, waktuSolved:false, waktuAttempts:0, pernyataanSolved:false, pernyataanAttempts:0, hearts:3, caseStatus:'locked', dialogueLog:{} },
      case7:{ clues:{}, besarSolved:false, besarAttempts:0, choiceMade:null, choiceAttempts:0, analisisSolved:false, analisisAttempts:0, hearts:3, caseStatus:'locked' }
    };
    saveExists = false;
  }

  /* ---------- NAV ---------- */
  function goTo(screen, params){
    stack.push(current);
    current = { screen, params: params||{} };
    render();
  }
  function switchTo(screen, params){
    current = { screen, params: params||{} };
    render();
  }
  function goBack(){
    if(stack.length === 0){ current = {screen:'menu', params:{}}; }
    else{ current = stack.pop(); }
    render();
  }
  function resetToMenu(){ stack = []; current = {screen:'menu', params:{}}; render(); }

  function inCase(){
    return ['casehub','location','object','characterlist','dialogue','puzzle','accusation','ending',
            'casehub2','location2','object2','characterlist2','dialogue2','puzzle-kotak','puzzle-jadwal','accusation2','ending2',
            'casehub3','location3','object3','characterlist3','dialogue3','puzzle-sandi','accusation3','ending3',
            'casehub4','location4','object4','characterlist4','dialogue4','puzzle-data','accusation4','ending4',
            'casehub5','location5','object5','puzzle-rak','puzzle-simbol','hubungan5','ending5',
            'casehub6','location6','object6','characterlist6','dialogue6','puzzle-waktu6','puzzle-pernyataan6','accusation6','ending6',
            'casehub7','location7','object7','puzzle-besar7','pilihan7','puzzle-analisis7','ending7'].includes(current.screen);
  }
  function isCase2Screen(){
    return ['casehub2','location2','object2','characterlist2','dialogue2','puzzle-kotak','puzzle-jadwal','accusation2','ending2'].includes(current.screen);
  }
  function isCase3Screen(){
    return ['casehub3','location3','object3','characterlist3','dialogue3','puzzle-sandi','accusation3','ending3'].includes(current.screen);
  }
  function isCase4Screen(){
    return ['casehub4','location4','object4','characterlist4','dialogue4','puzzle-data','accusation4','ending4'].includes(current.screen);
  }
  function isCase5Screen(){
    return ['casehub5','location5','object5','puzzle-rak','puzzle-simbol','hubungan5','ending5'].includes(current.screen);
  }
  function isCase6Screen(){
    return ['casehub6','location6','object6','characterlist6','dialogue6','puzzle-waktu6','puzzle-pernyataan6','accusation6','ending6'].includes(current.screen);
  }
  function isCase7Screen(){
    return ['casehub7','location7','object7','puzzle-besar7','pilihan7','puzzle-analisis7','ending7'].includes(current.screen);
  }

  function caseProgressPct(){
    const clueCount = Object.keys(state.clues).length;
    const charCount = Object.keys(state.charsRead).length;
    return Math.round(((clueCount/5)+(charCount/4))/2*100);
  }
  function caseProgressPct2(){
    const clueCount = Object.keys(state.case2.clues).length;
    const charCount = Object.keys(state.case2.charsRead).length;
    return Math.round(((clueCount/9)+(charCount/3))/2*100);
  }
  function caseProgressPct3(){
    const clueCount = Object.keys(state.case3.clues).length;
    const charCount = Object.keys(state.case3.charsRead).length;
    return Math.round(((clueCount/7)+(charCount/4))/2*100);
  }
  function caseProgressPct4(){
    const clueCount = Object.keys(state.case4.clues).length;
    const charCount = Object.keys(state.case4.charsRead).length;
    return Math.round(((clueCount/7)+(charCount/3))/2*100);
  }
  function caseProgressPct5(){
    const clueCount = Object.keys(state.case5.clues).length;
    return Math.round((clueCount/7)*100);
  }
  function caseProgressPct6(){
    const clueCount = Object.keys(state.case6.clues).length;
    const charCount = Object.keys(state.case6.charsRead).length;
    return Math.round(((clueCount/5)+(charCount/4))/2*100);
  }
  function caseProgressPct7(){
    const clueCount = Object.keys(state.case7.clues).length;
    return Math.round((clueCount/4)*100);
  }

  function allClueDB(){
    const out = {};
    const sets = [clueDB, clueDB2, clueDB3, clueDB4, clueDB5, clueDB6, clueDB7];
    sets.forEach((db, i)=>{ Object.keys(db).forEach(k=> out['c'+(i+1)+'_'+k] = db[k]); });
    return out;
  }
  function allCluesState(){
    const out = {};
    const sets = [state.clues, state.case2.clues, state.case3.clues, state.case4.clues, state.case5.clues, state.case6.clues, state.case7.clues];
    sets.forEach((s, i)=>{ Object.keys(s).forEach(k=> out['c'+(i+1)+'_'+k] = s[k]); });
    return out;
  }
  function allCharDB(){ return Object.assign({}, charDB, charDB2, charDB3, charDB4, charDB6); }

  /* ---------- RENDER HELPERS ---------- */
  function updateChrome(){
    const c2 = isCase2Screen();
    const c3 = isCase3Screen();
    const c4 = isCase4Screen();
    const c5 = isCase5Screen();
    const c6 = isCase6Screen();
    const c7 = isCase7Screen();
    const heartsVal = c7 ? state.case7.hearts : (c6 ? state.case6.hearts : (c5 ? state.case5.hearts : (c4 ? state.case4.hearts : (c3 ? state.case3.hearts : (c2 ? state.case2.hearts : state.hearts)))));
    const evVal = c7 ? Object.keys(state.case7.clues).length + '/4' : (c6 ? Object.keys(state.case6.clues).length + '/5' : (c5 ? Object.keys(state.case5.clues).length + '/7' : (c4 ? Object.keys(state.case4.clues).length + '/7' : (c3 ? Object.keys(state.case3.clues).length + '/7' : (c2 ? Object.keys(state.case2.clues).length + '/9' : Object.keys(state.clues).length + '/5')))));
    const progVal = (c7 ? caseProgressPct7() : (c6 ? caseProgressPct6() : (c5 ? caseProgressPct5() : (c4 ? caseProgressPct4() : (c3 ? caseProgressPct3() : (c2 ? caseProgressPct2() : caseProgressPct())))))) + '%';
    $('#hearts').style.display = inCase() ? 'inline-flex' : 'none';
    $('#hearts').innerHTML = '❤️'.repeat(heartsVal) + '🖤'.repeat(3-heartsVal);
    $('#badgeEvidence').style.display = inCase() ? 'inline-flex' : 'none';
    $('#evCount').textContent = evVal;
    $('#badgeProgress').style.display = inCase() ? 'inline-flex' : 'none';
    $('#progCount').textContent = progVal;
    $('#btnExitCase').style.display = inCase() ? 'inline-block' : 'none';
    $('#backrow').style.display = stack.length > 0 ? 'flex' : 'none';
    const titles = {
      menu:'Menu Utama', continue:'Lanjutkan Penyelidikan', caselist:'Daftar Kasus',
      casehub:'Kasus 01 — Misteri Hilangnya Piala', location:'Ruang OSIS', object:'Pemeriksaan',
      characterlist:'Bicara dengan Saksi', dialogue:'Percakapan', puzzle:'Laci Terkunci',
      notebook:'Buku Catatan', evidence:'Bukti', board:'Papan Investigasi', settings:'Pengaturan',
      accusation:'Ajukan Tuduhan', ending:'Hasil Kasus',
      casehub2:'Kasus 02 — Misteri Ruang Kelas Terkunci', location2:'Koridor', object2:'Pemeriksaan',
      characterlist2:'Bicara dengan Saksi', dialogue2:'Percakapan', 'puzzle-kotak':'Kotak Misterius',
      'puzzle-jadwal':'Susun Jadwal', accusation2:'Ajukan Tuduhan', ending2:'Hasil Kasus',
      casehub3:'Kasus 03 — Pesan Palsu', location3:'Investigasi', object3:'Pemeriksaan',
      characterlist3:'Bicara dengan Tersangka', dialogue3:'Percakapan', 'puzzle-sandi':'Komputer Terkunci',
      accusation3:'Ajukan Tuduhan', ending3:'Hasil Kasus',
      casehub4:'Kasus 04 — Misteri Laboratorium', location4:'Laboratorium', object4:'Pemeriksaan',
      characterlist4:'Bicara dengan Saksi', dialogue4:'Percakapan', 'puzzle-data':'Laci Laboratorium',
      accusation4:'Ajukan Tuduhan', ending4:'Hasil Kasus',
      casehub5:'Kasus 05 — Rahasia Perpustakaan', location5:'Perpustakaan', object5:'Pemeriksaan',
      'puzzle-rak':'Cari Rak Tersembunyi', 'puzzle-simbol':'Terjemahkan Simbol',
      hubungan5:'Benang Merah', ending5:'Kesimpulan',
      casehub6:'Kasus 06 — Alibi Sempurna', location6:'Investigasi Alibi', object6:'Pemeriksaan',
      characterlist6:'Bicara dengan Tersangka', dialogue6:'Percakapan', 'puzzle-waktu6':'Susun Garis Waktu',
      'puzzle-pernyataan6':'Uji Pernyataan', accusation6:'Ajukan Tuduhan', ending6:'Hasil Kasus',
      casehub7:'Kasus 07 — Misteri Terakhir', location7:'Ruang Rahasia', object7:'Pemeriksaan',
      'puzzle-besar7':'Puzzle Terakhir', pilihan7:'Pilihan Terakhir', 'puzzle-analisis7':'Analisis Terakhir',
      ending7:'Tamat'
    };
    $('#topSub').textContent = titles[current.screen] || '';
    $('#crumb').textContent = titles[current.screen] || '';
  }

  function renderClueList(){
    const div = document.createElement('div');
    const all = allClueDB(); const collectedAll = allCluesState();
    Object.keys(all).forEach(key=>{
      const collected = !!collectedAll[key];
      const row = document.createElement('div');
      row.className = 'notebook-item' + (collected ? ' collected' : '');
      row.innerHTML = '<span class="box">['+(collected?'✓':' ')+']</span><span>'+(collected ? all[key].tag : '???')+'</span>';
      div.appendChild(row);
    });
    return div;
  }

  /* ---------- SCREENS ---------- */
  function renderMenu(){
    app.innerHTML = `
      <div class="home-art" aria-label="Halaman awal Mystery School">
        <button class="home-hotspot home-start" data-nav="continue" aria-label="Mulai"></button>
        <button class="home-hotspot home-cases" data-nav="caselist" aria-label="Daftar Kasus"></button>
        <button class="home-hotspot home-notebook" data-nav="notebook" aria-label="Buku Catatan"></button>
        <button class="home-hotspot home-board" data-nav="board" aria-label="Papan Investigasi"></button>
        <button class="home-hotspot home-settings" data-nav="settings" aria-label="Pengaturan"></button>
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderContinue(){
    const pct = caseProgressPct();
    app.innerHTML = saveExists ? `
      <div class="card">
        <span class="eyebrow">Lanjutkan Penyelidikan</span>
        <h1>Kasus Terakhir</h1>
        <p><strong>"Misteri Hilangnya Piala"</strong><br>Lokasi terakhir: Ruang OSIS<br>Progress: ${pct}%</p>
        <div class="btn-row">
          <button class="btn" id="goContinue">▶️ Lanjutkan</button>
          <button class="btn secondary" id="goHome">← Kembali</button>
        </div>
      </div>` : `
      <div class="card">
        <span class="eyebrow">Lanjutkan Penyelidikan</span>
        <h1>Belum Ada Penyelidikan Tersimpan</h1>
        <p>Kamu belum memulai kasus apa pun. Buka Daftar Kasus untuk mulai menyelidiki.</p>
        <div class="btn-row">
          <button class="btn" id="goCaselist">📁 Daftar Kasus</button>
          <button class="btn secondary" id="goHome">← Kembali</button>
        </div>
      </div>`;
    const c = $('#goContinue'); if(c) c.addEventListener('click', ()=> goTo('casehub',{id:'case1'}));
    const cl = $('#goCaselist'); if(cl) cl.addEventListener('click', ()=> goTo('caselist'));
    $('#goHome').addEventListener('click', goBack);
  }

  function renderCaselist(){
    const rows = caseList.map((c,i)=>{
      let status, cls, playable=false;
      if(c.id === 'case1'){
        status = state.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.clues).length || Object.keys(state.charsRead).length ? '🔎 Sedang diselidiki' : '🔒 Belum dimulai');
        cls = state.caseStatus === 'done' ? 'done' : ''; playable = true;
      } else if(c.id === 'case2'){
        if(state.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case2.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.case2.clues).length || Object.keys(state.case2.charsRead).length ? '🔎 Sedang diselidiki' : '🔎 Siap diselidiki');
          cls = state.case2.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else if(c.id === 'case3'){
        if(state.case2.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case3.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.case3.clues).length || Object.keys(state.case3.charsRead).length ? '🔎 Sedang diselidiki' : '🔎 Siap diselidiki');
          cls = state.case3.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else if(c.id === 'case4'){
        if(state.case3.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case4.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.case4.clues).length || Object.keys(state.case4.charsRead).length ? '🔎 Sedang diselidiki' : '🔎 Siap diselidiki');
          cls = state.case4.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else if(c.id === 'case5'){
        if(state.case4.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case5.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.case5.clues).length ? '🔎 Sedang diselidiki' : '🔎 Siap diselidiki');
          cls = state.case5.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else if(c.id === 'case6'){
        if(state.case5.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case6.caseStatus === 'done' ? '🔓 Selesai' : (Object.keys(state.case6.clues).length || Object.keys(state.case6.charsRead).length ? '🔎 Sedang diselidiki' : '🔎 Siap diselidiki');
          cls = state.case6.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else if(c.id === 'case7'){
        if(state.case6.caseStatus !== 'done'){ status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
        else {
          status = state.case7.caseStatus === 'done' ? '🔓 Tamat' : (Object.keys(state.case7.clues).length ? '🔎 Sedang diselidiki' : '⭐ Siap diselidiki');
          cls = state.case7.caseStatus === 'done' ? 'done' : ''; playable = true;
        }
      } else { status = '🔒 Terkunci'; cls = 'locked'; playable = false; }
      const connector = i>0 ? '<div class="connector"></div>' : '';
      return connector + `<div class="case-row ${cls}" data-case="${c.id}" data-playable="${playable?1:0}">
        <span class="icon">${c.icon}</span>
        <div class="info"><span class="cname">Kasus 0${i+1} — ${c.name}</span><span class="cstatus">${status}</span></div>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Daftar Kasus</span><h1>Pilih Kasus</h1><p>Kasus berikutnya terkunci sampai kasus sebelumnya selesai.</p>${rows}</div>`;
    $all('.case-row', app).forEach(row=>{
      if(row.getAttribute('data-playable') === '1'){
        const cid = row.getAttribute('data-case');
        const hubMap = { case1:'casehub', case2:'casehub2', case3:'casehub3', case4:'casehub4', case5:'casehub5', case6:'casehub6', case7:'casehub7' };
        row.addEventListener('click', ()=> goTo(hubMap[cid], { id:cid }));
      }
    });
  }

  function renderCasehub(){
    const pct = caseProgressPct();
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Rabu, 09.45 — Ruang Guru</span>
        <h1>Kasus 01: Misteri Hilangnya Piala</h1>
        <p>Piala prestasi sekolah menghilang dari Ruang OSIS sejak istirahat kedua. Kamu diberi izin menyelidiki siapa pun dan lokasi mana pun yang relevan.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.clues).length}/5 &nbsp;•&nbsp; Saksi ditanyai: ${Object.keys(state.charsRead).length}/4</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location"><span>🏫 Ruang OSIS</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="accusation"><span>⚖️ Ajukan Tuduhan</span><span class="arrow">→</span></div>
        </div>
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderLocation(){
    const objHtml = objects.map(o=>{
      const done = o.clue ? !!state.clues[o.clue] : false;
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}">🔍 <span>${o.label.replace(/^\S+\s/,'')}</span></div>`;
    }).join('');
    const standeeHtml = Object.keys(charDB).map(k=>{
      const c = charDB[k];
      const read = !!state.charsRead[k];
      return `<div class="standee ${read?'read':''}" data-char="${k}">
        <span class="bicara">💬 Bicara</span><br>
        <svg class="avatar-icon stage"><use href="#${c.avatar}"></use></svg>
        <div class="ring"></div>
        <div class="sname">${c.name}</div>
      </div>`;
    }).join('');
    const locTabs = [
      {icon:'🏫', name:'Ruang OSIS', active:true},
      {icon:'🚪', name:'Koridor', active:false},
      {icon:'📖', name:'Kelas 2A', active:false},
      {icon:'📚', name:'Perpustakaan', active:false},
      {icon:'🍱', name:'Kantin', active:false},
      {icon:'🏃', name:'Lapangan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Temukan siapa yang menyembunyikan piala sekolah dan di mana piala itu berada.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Piala hilang antara 09.30–10.00</li>
              <li>Tidak ada tanda perusakan</li>
              <li>Pelaku mengetahui letak kunci cadangan</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Periksa semua objek dan bicaralah dengan semua siswa sebelum menuduh.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">🏫 RUANG OSIS</div>
          <div class="standees">${standeeHtml}</div>
          <div class="hotspot-grid">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object', { objId: obj.id });
      });
    });
    $all('.standee', app).forEach(el=>{
      el.addEventListener('click', ()=> goTo('dialogue', { charId: el.getAttribute('data-char') }));
    });
  }

  function renderObject(params){
    const obj = objects.find(o=> o.id === params.objId);
    if(obj.flavor){
      app.innerHTML = `<div class="card"><span class="eyebrow">Pemeriksaan</span><h1>${obj.label.replace(/^\S+\s/,'')}</h1><p>${obj.flavor}</p></div>`;
      return;
    }
    if(obj.puzzle && !state.puzzleSolved){
      goTo('puzzle', { objId: obj.id });
      // replace stack top so back doesn't loop to this transient object screen
      stack.pop();
      return;
    }
    const key = obj.clue;
    if(!state.clues[key]){
      state.clues[key] = true;
      saveProgress();
    }
    const c = clueDB[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzle(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Laci Terkunci</span>
        <h1>Buka Kode Laci</h1>
        <p>Ada sobekan kertas tertempel di laci, berisi deretan angka yang setengah pudar dan sebuah pola:</p>
        <div class="puzzle-box">
          <div class="puzzle-sequence">2 → 4 → 8 → 16 → ?</div>
          <p style="margin:0 0 6px; font-size:13px;">Masukkan angka selanjutnya dalam pola ini untuk membuka laci.</p>
          <input type="number" id="puzzleInput" placeholder="?">
          <button class="btn" id="submitPuzzle" style="margin-left:8px;">Coba Buka</button>
          <div class="puzzle-msg" id="puzzleMsg"></div>
        </div>
      </div>`;
    $('#submitPuzzle').addEventListener('click', ()=>{
      const val = parseInt($('#puzzleInput').value, 10);
      const msg = $('#puzzleMsg');
      if(val === 32){
        msg.textContent = 'Klik. Laci terbuka.';
        msg.className = 'puzzle-msg right';
        state.puzzleSolved = true;
        state.clues['D'] = true;
        saveProgress();
        setTimeout(goBack, 500);
      } else {
        state.puzzleAttempts++;
        state.hearts = Math.max(0, state.hearts-1);
        updateChrome();
        msg.textContent = 'Bukan itu. Perhatikan lagi polanya (dikali dua tiap langkah).';
        msg.className = 'puzzle-msg wrong';
      }
    });
  }

  function renderCharacterlist(){
    const rows = Object.keys(charDB).map(key=>{
      const c = charDB[key];
      const read = !!state.charsRead[key];
      return `<div class="char-row ${read?'read':''}" data-char="${key}">
        <svg class="avatar-icon"><use href="#${c.avatar}"></use></svg>
        <div class="char-info"><span class="name">${c.name}</span><span class="role">${c.role}</span></div>
        <span>💬</span>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Ruang Kelas</span><h1>Bicara dengan Saksi</h1><p>Tanyai siapa pun tentang keberadaan mereka. Bandingkan jawaban dengan bukti yang sudah kamu temukan.</p><div class="char-list">${rows}</div></div>`;
    $all('.char-row', app).forEach(el=> el.addEventListener('click', ()=> goTo('dialogue', { charId: el.getAttribute('data-char') })));
  }

  function renderDialogue(params){
    const key = params.charId;
    const c = charDB[key];
    if(!state.charsRead[key]){ state.charsRead[key] = true; saveProgress(); }
    if(!state.dialogueLog[key]) state.dialogueLog[key] = [];

    function draw(){
      const logHtml = state.dialogueLog[key].map(l=> `<div class="bubble q">${l.q}</div><div class="bubble">${l.a}</div>`).join('');
      app.innerHTML = `
        <div class="card">
          <div class="dialogue-head">
            <svg class="avatar-icon big"><use href="#${c.avatar}"></use></svg>
            <div class="who"><h2>${c.name}</h2><p style="margin:0; font-size:12px; color:var(--ink-soft);">${c.role} — <em>${c.personality}</em></p></div>
          </div>
          <div class="dlog">${logHtml}</div>
          <div class="topic-row">
            <button class="topic-btn" data-t="waktu">💬 Tanya tentang keberadaannya saat istirahat</button>
            <button class="topic-btn" data-t="ruang">💬 Tanya tentang Ruang OSIS</button>
            <button class="topic-btn" data-t="orang">💬 Tanya tentang orang lain</button>
            <button class="topic-btn" data-t="bukti">🔎 Tunjukkan bukti</button>
          </div>
        </div>`;
      $all('.topic-btn', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const t = btn.getAttribute('data-t');
          if(t === 'bukti'){ showEvidencePicker(); return; }
          const questions = { waktu:'Di mana kamu saat istirahat kedua?', ruang:'Ada urusan apa kamu dengan Ruang OSIS?', orang:'Lihat orang lain di sekitar situ?' };
          state.dialogueLog[key].push({ q: questions[t], a: c.topics[t] });
          draw();
        });
      });
    }

    function showEvidencePicker(){
      const collected = Object.keys(state.clues).filter(k=> state.clues[k]);
      if(collected.length === 0){
        state.dialogueLog[key].push({ q:'(Menunjukkan bukti)', a:'Kamu belum punya bukti apa pun untuk ditunjukkan.' });
        draw();
        return;
      }
      const options = collected.map(k=> `<button class="topic-btn" data-clue="${k}">${clueDB[k].tag}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pilih Bukti</span>
          <h1>Tunjukkan ke ${c.name}</h1>
          <div class="topic-row">${options}</div>
          <div class="btn-row"><button class="btn secondary" id="cancelEv">← Batal</button></div>
        </div>`;
      $all('[data-clue]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const ck = btn.getAttribute('data-clue');
          const reaction = c.reactions[ck] || c.reactions.default;
          state.dialogueLog[key].push({ q:'Menunjukkan bukti: '+clueDB[ck].tag, a:reaction });
          draw();
        });
      });
      $('#cancelEv').addEventListener('click', draw);
    }
    draw();
  }

  function renderNotebook(){
    app.innerHTML = `<div class="card"><span class="eyebrow">Detective Notebook</span><h1>Buku Catatan</h1><p>Ringkasan penyelidikanmu sejauh ini.</p><div id="clueListHolder"></div></div>`;
    $('#clueListHolder', app).appendChild(renderClueList());
  }

  function renderEvidence(){
    const all = allClueDB(); const collectedAll = allCluesState();
    const found = Object.keys(collectedAll).filter(k=> collectedAll[k]);
    const html = found.length === 0
      ? '<p>Belum ada bukti yang ditemukan. Mulai investigasi di kasus yang sedang berjalan.</p>'
      : found.map((k,i)=>{
          const c = all[k];
          return `<div class="evidence-card"><span class="ev-tag">BUKTI #${String(i+1).padStart(2,'0')} — ${c.tag}</span>
            <p style="margin:6px 0;">${c.text}</p>
            <span class="ev-meta">Lokasi: ${c.location} &nbsp;•&nbsp; Waktu ditemukan: ${c.time}</span></div>`;
        }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Berkas Bukti</span><h1>Bukti</h1>${html}</div>`;
  }

  function renderBoard(){
    const allChars = allCharDB();
    const avatars = Object.keys(allChars).map(k=> `<div class="board-avatar"><svg class="avatar-icon"><use href="#${allChars[k].avatar}"></use></svg><div class="name">${allChars[k].name}</div></div>`).join('');
    const all = allClueDB(); const collectedAll = allCluesState();
    const found = Object.keys(collectedAll).filter(k=> collectedAll[k]);
    const evHtml = found.length === 0 ? '<p>Papan masih kosong. Kumpulkan bukti untuk mengisinya.</p>' :
      found.map(k=> `<div class="evidence-card"><span class="ev-tag">${all[k].tag}</span></div>`).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Papan Investigasi</span>
        <h1>Susun Teorimu</h1>
        <div class="board-section"><h2>Orang yang Terlibat</h2><div class="board-avatars">${avatars}</div></div>
        <div class="board-section"><h2>Bukti Terkumpul</h2>${evHtml}</div>
        <p style="font-size:12px;">Bandingkan siapa yang pernyataannya paling bertentangan dengan bukti — itu petunjuk terkuatmu.</p>
      </div>`;
  }

  function renderSettings(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Pengaturan</span>
        <h1>Pengaturan</h1>
        <p>Prototype ini menyimpan progres Kasus 1 secara otomatis di perangkatmu.</p>
        <div class="btn-row"><button class="btn secondary" id="wipeBtn">🗑️ Hapus Semua Progress</button></div>
      </div>`;
    $('#wipeBtn').addEventListener('click', async ()=>{
      await clearProgress();
      resetToMenu();
    });
  }

  function renderAccusation(){
    const opts = Object.keys(charDB).map(k=>{
      const c = charDB[k];
      return `<button class="suspect-btn" data-suspect="${k}"><svg class="avatar-icon small"><use href="#${c.avatar}"></use></svg><span>${c.name} — ${c.role}</span></button>`;
    }).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Keputusan Akhir</span>
        <h1>Siapa Pelakunya?</h1>
        <p>Berdasarkan bukti dan kesaksian yang kamu kumpulkan, siapa yang menurutmu mengambil piala?</p>
        <div class="suspects">${opts}</div>
      </div>`;
    $all('.suspect-btn', app).forEach(btn=> btn.addEventListener('click', ()=> resolveEnding(btn.getAttribute('data-suspect'))));
  }

  function resolveEnding(suspect){
    const cluesFound = Object.keys(state.clues).length;
    const noMistakes = state.puzzleAttempts === 0;
    let stars = 1;
    if(cluesFound >= 5) stars++;
    if(noMistakes) stars++;

    let badgeClass, badgeText, title, text, nextLevel = false;
    if(suspect === 'raka' && cluesFound >= 5){
      badgeClass='ending-true'; badgeText='TRUE ENDING'; title='Kasus Terpecahkan';
      text = 'Kamu benar. Raka bilang dia di lapangan sepanjang istirahat — tapi struk kantin dekat Ruang OSIS, catatan latihan yang dibatalkan, dan kunci yang terjatuh dekat jendela semuanya membentuk satu garis waktu: Raka ada di TKP jam 12.15, lalu kabur lewat jendela. Ia mengaku memindahkan piala untuk "iseng" difoto sebelum acara perpisahan, lalu tidak sempat mengembalikannya sebelum ketahuan.';
      state.caseStatus = 'done'; nextLevel = true;
    } else if(suspect === 'raka' && cluesFound < 5){
      badgeClass='ending-incomplete'; badgeText='INCOMPLETE ENDING'; title='Tuduhan Benar, Bukti Kurang';
      text = 'Kamu menuduh orang yang tepat — Raka memang pelakunya. Tapi tanpa semua bukti terkumpul, Bu Sari masih ragu menerima kesimpulanmu sepenuhnya.';
      stars = Math.min(stars,2);
      state.caseStatus = 'done';
    } else {
      badgeClass='ending-wrong'; badgeText='WRONG ENDING'; title='Tersangka yang Salah';
      const wrongTexts = {
        alex:'Alex punya alibi yang konsisten — dia bersama Bu Sari sepanjang istirahat, jauh dari Ruang OSIS.',
        naya:'Naya memang orang terakhir yang melihat piala, tapi ceritanya cocok dengan semua bukti yang ada.',
        sinta:'Sinta tidak pernah meninggalkan meja perpustakaan, dan kesaksiannya justru mendukung bukti lain.'
      };
      text = (wrongTexts[suspect]||'') + ' Kembali periksa Buku Catatan dan bandingkan lagi kesaksian keempat orang ini.';
      stars = 0;
      state.caseStatus = state.caseStatus === 'done' ? 'done' : 'progress';
    }
    saveProgress();

    app.innerHTML = `
      <div class="card">
        <span class="ending-badge ${badgeClass}">${badgeText}</span>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p style="font-size:12px;">Bintang didapat dari: menuduh dengan tepat, mengumpulkan semua bukti, dan tidak salah di puzzle laci.</p>
        <div class="btn-row">
          <button class="btn" id="guessAgain">Tebak Lagi</button>
          <button class="btn secondary" id="backHub">Kembali ke Kasus 1</button>
        </div>
        ${nextLevel ? '<div class="btn-row"><button class="btn" id="toCaselist">Lihat Daftar Kasus →</button></div>' : ''}
      </div>`;
    $('#guessAgain').addEventListener('click', ()=> goTo('accusation'));
    $('#backHub').addEventListener('click', ()=> goTo('casehub',{id:'case1'}));
    const nl = $('#toCaselist'); if(nl) nl.addEventListener('click', ()=> goTo('caselist'));
  }

  /* ================= KASUS 2 SCREENS ================= */
  function renderCasehub2(){
    const pct = caseProgressPct2();
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Pagi ini — Ruang Guru Piket</span>
        <h1>Kasus 02: Misteri Ruang Kelas Terkunci</h1>
        <p>Ruang kelas 2B ditemukan terkunci dari luar, padahal pagi tadi masih digunakan. Di dalamnya ada sebuah kotak misterius. Guru piket memintamu menyelidiki.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case2.clues).length}/9 &nbsp;•&nbsp; Saksi ditanyai: ${Object.keys(state.case2.charsRead).length}/3</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location2"><span>🚪 Koridor</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="puzzle-jadwal"><span>🗓️ Susun Jadwal</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="accusation2"><span>⚖️ Ajukan Tuduhan</span><span class="arrow">→</span></div>
        </div>
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderLocation2(){
    const objHtml = objects2.map(o=>{
      const done = o.clue ? !!state.case2.clues[o.clue] : (o.id==='kotak' ? state.case2.kotakOpened : false);
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}">🔍 <span>${o.label.replace(/^\S+\s/,'')}</span></div>`;
    }).join('');
    const standeeHtml = Object.keys(charDB2).map(k=>{
      const c = charDB2[k];
      const read = !!state.case2.charsRead[k];
      return `<div class="standee ${read?'read':''}" data-char="${k}">
        <span class="bicara">💬 Bicara</span><br>
        <svg class="avatar-icon stage"><use href="#${c.avatar}"></use></svg>
        <div class="ring"></div>
        <div class="sname">${c.name}</div>
      </div>`;
    }).join('');
    const locTabs = [
      {icon:'🚪', name:'Koridor', active:true},
      {icon:'📖', name:'Kelas 2B', active:false},
      {icon:'🏫', name:'Ruang OSIS', active:false},
      {icon:'📚', name:'Perpustakaan', active:false},
      {icon:'🍱', name:'Kantin', active:false},
      {icon:'🏃', name:'Lapangan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Cari tahu kenapa kelas 2B tiba-tiba terkunci dan apa yang sebenarnya terjadi di dalamnya.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Ruang kelas 2B terkunci dari luar, padahal pagi tadi masih digunakan</li>
              <li>Kunci cadangan terakhir dipinjam pukul 08.15</li>
              <li>Di dalam kelas ada sebuah kotak misterius</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Cocokkan waktu di CCTV dengan pengakuan tiap siswa — salah satu pasti tidak sesuai.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">🚪 KORIDOR SEKOLAH</div>
          <div class="standees">${standeeHtml}</div>
          <div class="hotspot-grid">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects2.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object2', { objId: obj.id });
      });
    });
    $all('.standee', app).forEach(el=>{
      el.addEventListener('click', ()=> goTo('dialogue2', { charId: el.getAttribute('data-char') }));
    });
  }

  function renderObject2(params){
    const obj = objects2.find(o=> o.id === params.objId);
    if(obj.puzzle){
      goTo('puzzle-kotak');
      stack.pop();
      return;
    }
    const key = obj.clue;
    if(!state.case2.clues[key]){
      state.case2.clues[key] = true;
      saveProgress();
    }
    const c = clueDB2[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleKotak(){
    const keyColors = [ {n:1,name:'Merah',col:'#d9556b'}, {n:2,name:'Biru',col:'#6fb3e0'}, {n:3,name:'Kuning',col:'#e8b84b'}, {n:4,name:'Hijau',col:'#52c78a'} ];
    let clicked = [];
    const target = [3,1,4,2];

    function draw(){
      if(state.case2.kotakOpened){
        const items = ['BA','BB','BC','BD'].map(k=> `<div class="clue-popup show"><span class="tag">${clueDB2[k].tag}</span><p style="margin:0;">${clueDB2[k].text}</p></div>`).join('');
        app.innerHTML = `<div class="card"><span class="eyebrow">Kotak Terbuka</span><h1>Isi Kotak Misterius</h1>${items}<div class="btn-row"><button class="btn secondary" id="backObj">← Kembali</button></div></div>`;
        $('#backObj').addEventListener('click', goBack);
        return;
      }
      const keyBtns = keyColors.map(k=> `<button class="topic-btn" data-key="${k.n}" style="border-left:6px solid ${k.col};">🔑 Kunci ${k.name}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Kotak Misterius</span>
          <h1>Buka Kunci Berdasarkan Kode Warna</h1>
          <p>Ada catatan kecil di sisi kotak: <strong>KODE: 3 - 1 - 4 - 2</strong>. Klik empat kunci di bawah sesuai urutan angka itu.</p>
          <div class="puzzle-box">
            <div class="topic-row">${keyBtns}</div>
            <p style="margin:10px 0 0; font-size:12px;">Urutan yang sudah kamu klik: <strong>${clicked.map(n=> keyColors.find(k=>k.n===n).name).join(' → ') || '(belum ada)'}</strong></p>
            <div class="puzzle-msg" id="puzzleMsg2"></div>
            <div class="btn-row"><button class="btn secondary" id="resetSeq">Ulangi Urutan</button></div>
          </div>
        </div>`;
      $all('[data-key]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const n = parseInt(btn.getAttribute('data-key'),10);
          clicked.push(n);
          if(clicked.length === 4){
            if(JSON.stringify(clicked) === JSON.stringify(target)){
              state.case2.kotakOpened = true;
              ['BA','BB','BC','BD'].forEach(k=> state.case2.clues[k] = true);
              saveProgress();
              draw();
            } else {
              state.case2.kotakAttempts++;
              state.case2.hearts = Math.max(0, state.case2.hearts-1);
              updateChrome();
              clicked = [];
              draw();
              const m = $('#puzzleMsg2'); if(m){ m.textContent = 'Urutan salah, kunci belum terbuka. Coba lagi.'; m.className='puzzle-msg wrong'; }
            }
          } else { draw(); }
        });
      });
      $('#resetSeq').addEventListener('click', ()=>{ clicked = []; draw(); });
    }
    draw();
  }

  function renderPuzzleJadwal(){
    const people = [
      { id:'dita', name:'Dita', correct:'08.10' },
      { id:'farel', name:'Farel', correct:'08.20' },
      { id:'mira', name:'Mira', correct:'08.05' },
    ];
    const times = ['08.05','08.10','08.20'];
    let picks = {};

    function draw(){
      if(state.case2.jadwalSolved){
        app.innerHTML = `
          <div class="card">
            <span class="eyebrow">Jadwal Tersusun</span>
            <h1>Kesimpulan Waktu Kejadian</h1>
            <p>Dari susunan waktu ini, terlihat jelas: <strong>Dita</strong> berada di depan kelas 2B jam 08.10 — tepat sebelum kunci cadangan dipinjam jam 08.15. Farel hanya lewat jam 08.20, dan Mira sudah ada di perpustakaan sejak 08.05. Seseorang masuk ke kelas sebelum ruangan dikunci, dan itu bukan Farel maupun Mira.</p>
            <div class="btn-row"><button class="btn secondary" id="backHub2">Kembali ke Kasus 2</button></div>
          </div>`;
        $('#backHub2').addEventListener('click', ()=> goTo('casehub2',{id:'case2'}));
        return;
      }
      const rows = people.map(p=>{
        const opts = times.map(t=> `<button class="topic-btn ${picks[p.id]===t?'':''}" data-person="${p.id}" data-time="${t}" style="${picks[p.id]===t?'background:var(--purple-soft);':''}">${t}</button>`).join('');
        return `<div class="side-box" style="margin-bottom:10px;"><h3>${p.name}</h3><div class="topic-row" style="flex-direction:row; flex-wrap:wrap;">${opts}</div></div>`;
      }).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Susun Jadwal</span>
          <h1>Cocokkan Waktu, Orang, dan Lokasi</h1>
          <p>Berdasarkan CCTV dan kesaksian, pilih jam yang paling tepat untuk tiap orang.</p>
          ${rows}
          <div class="puzzle-msg" id="puzzleMsg3"></div>
          <div class="btn-row"><button class="btn" id="checkJadwal">Periksa Jadwal</button></div>
        </div>`;
      $all('[data-person]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          picks[btn.getAttribute('data-person')] = btn.getAttribute('data-time');
          draw();
        });
      });
      $('#checkJadwal').addEventListener('click', ()=>{
        const allCorrect = people.every(p=> picks[p.id] === p.correct);
        if(allCorrect){
          state.case2.jadwalSolved = true;
          saveProgress();
          draw();
        } else {
          state.case2.jadwalAttempts++;
          state.case2.hearts = Math.max(0, state.case2.hearts-1);
          updateChrome();
          const m = $('#puzzleMsg3'); m.textContent = 'Ada yang belum cocok. Bandingkan lagi dengan CCTV dan kesaksian.'; m.className='puzzle-msg wrong';
        }
      });
    }
    draw();
  }

  function renderCharacterlist2(){
    const rows = Object.keys(charDB2).map(key=>{
      const c = charDB2[key];
      const read = !!state.case2.charsRead[key];
      return `<div class="char-row ${read?'read':''}" data-char="${key}">
        <svg class="avatar-icon"><use href="#${c.avatar}"></use></svg>
        <div class="char-info"><span class="name">${c.name}</span><span class="role">${c.role}</span></div>
        <span>💬</span>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Kelas 2B</span><h1>Bicara dengan Saksi</h1><p>Tanyai ketiganya soal pagi ini. Bandingkan jawaban mereka dengan bukti yang sudah kamu temukan.</p><div class="char-list">${rows}</div></div>`;
    $all('.char-row', app).forEach(el=> el.addEventListener('click', ()=> goTo('dialogue2', { charId: el.getAttribute('data-char') })));
  }

  function renderDialogue2(params){
    const key = params.charId;
    const c = charDB2[key];
    if(!state.case2.charsRead[key]){ state.case2.charsRead[key] = true; saveProgress(); }
    if(!state.case2.dialogueLog[key]) state.case2.dialogueLog[key] = [];

    function draw(){
      const logHtml = state.case2.dialogueLog[key].map(l=> `<div class="bubble q">${l.q}</div><div class="bubble">${l.a}</div>`).join('');
      app.innerHTML = `
        <div class="card">
          <div class="dialogue-head">
            <svg class="avatar-icon big"><use href="#${c.avatar}"></use></svg>
            <div class="who"><h2>${c.name}</h2><p style="margin:0; font-size:12px; color:var(--text-muted);">${c.role} — <em>${c.personality}</em></p></div>
          </div>
          <div class="dlog">${logHtml}</div>
          <div class="topic-row">
            <button class="topic-btn" data-t="waktu">💬 Tanya di mana dia pagi ini</button>
            <button class="topic-btn" data-t="ruang">💬 Tanya tentang kelas 2B</button>
            <button class="topic-btn" data-t="orang">💬 Tanya tentang orang lain</button>
            <button class="topic-btn" data-t="bukti">🔎 Tunjukkan bukti</button>
          </div>
        </div>`;
      $all('.topic-btn', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const t = btn.getAttribute('data-t');
          if(t === 'bukti'){ showEvidencePicker(); return; }
          const questions = { waktu:'Di mana kamu pagi ini sebelum bel masuk?', ruang:'Ada urusan apa dengan kelas 2B?', orang:'Lihat orang lain di sekitar situ?' };
          state.case2.dialogueLog[key].push({ q: questions[t], a: c.topics[t] });
          draw();
        });
      });
    }

    function showEvidencePicker(){
      const collected = Object.keys(state.case2.clues).filter(k=> state.case2.clues[k]);
      if(collected.length === 0){
        state.case2.dialogueLog[key].push({ q:'(Menunjukkan bukti)', a:'Kamu belum punya bukti apa pun untuk ditunjukkan.' });
        draw();
        return;
      }
      const options = collected.map(k=> `<button class="topic-btn" data-clue="${k}">${clueDB2[k].tag}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pilih Bukti</span>
          <h1>Tunjukkan ke ${c.name}</h1>
          <div class="topic-row">${options}</div>
          <div class="btn-row"><button class="btn secondary" id="cancelEv">← Batal</button></div>
        </div>`;
      $all('[data-clue]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const ck = btn.getAttribute('data-clue');
          const reaction = c.reactions[ck] || c.reactions.default;
          state.case2.dialogueLog[key].push({ q:'Menunjukkan bukti: '+clueDB2[ck].tag, a:reaction });
          draw();
        });
      });
      $('#cancelEv').addEventListener('click', draw);
    }
    draw();
  }

  function renderAccusation2(){
    const opts = Object.keys(charDB2).map(k=>{
      const c = charDB2[k];
      return `<button class="suspect-btn" data-suspect="${k}"><svg class="avatar-icon small"><use href="#${c.avatar}"></use></svg><span>${c.name} — ${c.role}</span></button>`;
    }).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Keputusan Akhir</span>
        <h1>Siapa yang Mengunci Kelas?</h1>
        <p>Berdasarkan bukti, isi kotak, dan kesaksian yang kamu kumpulkan, siapa yang menurutmu mengunci kelas 2B?</p>
        <div class="suspects">${opts}</div>
      </div>`;
    $all('.suspect-btn', app).forEach(btn=> btn.addEventListener('click', ()=> resolveEnding2(btn.getAttribute('data-suspect'))));
  }

  function resolveEnding2(suspect){
    const cluesFound = Object.keys(state.case2.clues).length;
    const noMistakes = state.case2.kotakAttempts === 0 && state.case2.jadwalAttempts === 0;
    let stars = 1;
    if(cluesFound >= 9) stars++;
    if(noMistakes) stars++;

    let badgeClass, badgeText, title, text, caseSolved = false;
    if(suspect === 'dita' && cluesFound >= 9){
      badgeClass='ending-true'; badgeText='TRUE ENDING'; title='Kasus Terpecahkan';
      text = 'Kamu benar. Dita bilang dia sama sekali tidak masuk kelas — tapi CCTV menunjukkannya di depan pintu jam 08.10, catatan peminjaman kunci berinisial "D" jam 08.15, dan tulisan tangannya di potongan kertas cocok dengan coretan di papan kelas. Dita mengaku: dia menyembunyikan kotak berisi foto lama dan kartu perpustakaannya sendiri karena malu, lalu panik mengunci pintu saat menyadari ada yang mungkin melihatnya.';
      state.case2.caseStatus = 'done'; caseSolved = true;
    } else if(suspect === 'dita' && cluesFound < 9){
      badgeClass='ending-incomplete'; badgeText='INCOMPLETE ENDING'; title='Tuduhan Benar, Bukti Kurang';
      text = 'Kamu menuduh orang yang tepat — Dita memang yang mengunci kelas. Tapi tanpa semua bukti dan isi kotak terkumpul, guru piket masih ragu menerima kesimpulanmu sepenuhnya.';
      stars = Math.min(stars,2);
      state.case2.caseStatus = 'done';
    } else {
      badgeClass='ending-wrong'; badgeText='WRONG ENDING'; title='Tersangka yang Salah';
      const wrongTexts = {
        farel:'Farel cuma lewat koridor sebentar — CCTV dan kesaksiannya sendiri konsisten, dia tidak pernah masuk kelas.',
        mira:'Catatan perpustakaan membuktikan Mira ada di sana sepanjang pagi, jauh dari kelas 2B.'
      };
      text = (wrongTexts[suspect]||'') + ' Kembali periksa Buku Catatan, susun ulang jadwalnya, dan bandingkan lagi ketiga kesaksian ini.';
      stars = 0;
      state.case2.caseStatus = state.case2.caseStatus === 'done' ? 'done' : 'progress';
    }
    saveProgress();

    app.innerHTML = `
      <div class="card">
        <span class="ending-badge ${badgeClass}">${badgeText}</span>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p style="font-size:12px;">Bintang didapat dari: menuduh dengan tepat, mengumpulkan semua bukti, dan tidak salah di kedua puzzle.</p>
        <div class="btn-row">
          <button class="btn" id="guessAgain2">Tebak Lagi</button>
          <button class="btn secondary" id="backHub2b">Kembali ke Kasus 2</button>
        </div>
        ${caseSolved ? '<div class="btn-row"><button class="btn" id="toCaselist2">Lihat Daftar Kasus →</button></div>' : ''}
      </div>`;
    $('#guessAgain2').addEventListener('click', ()=> goTo('accusation2'));
    $('#backHub2b').addEventListener('click', ()=> goTo('casehub2',{id:'case2'}));
    const nl = $('#toCaselist2'); if(nl) nl.addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- KASUS 3 ---------- */
  function renderCasehub3(){
    const pct = caseProgressPct3();
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Pagi ini — Grup Chat Sekolah Heboh</span>
        <h1>Kasus 03: Pesan Palsu</h1>
        <p>Sebuah pesan tersebar ke semua siswa: "Besok sekolah diliburkan." Banyak yang percaya — tapi ternyata pesan itu palsu. Kamu harus mencari siapa yang membuat dan menyebarkannya.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case3.clues).length}/7 &nbsp;•&nbsp; Tersangka ditanyai: ${Object.keys(state.case3.charsRead).length}/4</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="pesan"><span>💬 Periksa Pesan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="lab"><span>💻 Lab Komputer</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="gerbang"><span>🚧 Gerbang Sekolah</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook2"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="accusation3"><span>⚖️ Ajukan Tuduhan</span><span class="arrow">→</span></div>
        </div>
      </div>`;
    $all('[data-nav]', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const nav = el.getAttribute('data-nav');
        if(nav === 'notebook2'){ goTo('notebook'); return; }
        if(nav === 'accusation3'){ goTo('accusation3'); return; }
        goTo('location3', { loc: nav });
      });
    });
  }

  function renderLocation3(params){
    const loc = (params && params.loc) || state.case3.currentLoc || 'pesan';
    state.case3.currentLoc = loc;
    const objs = loc3Map[loc];
    const objHtml = objs.map(o=>{
      let done = false;
      if(o.clue) done = !!state.case3.clues[o.clue];
      else if(o.puzzle) done = state.case3.sandiSolved;
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}">🔍 <span>${o.label.replace(/^\S+\s/,'')}</span></div>`;
    }).join('');
    const standeeHtml = loc === 'pesan' ? Object.keys(charDB3).map(k=>{
      const c = charDB3[k];
      const read = !!state.case3.charsRead[k];
      return `<div class="standee ${read?'read':''}" data-char="${k}">
        <span class="bicara">💬 Bicara</span><br>
        <svg class="avatar-icon stage"><use href="#${c.avatar}"></use></svg>
        <div class="ring"></div>
        <div class="sname">${c.name}</div>
      </div>`;
    }).join('') : '';
    const stageTitles = { pesan:'💬 GRUP CHAT SEKOLAH', lab:'💻 LAB KOMPUTER 07', gerbang:'🚧 GERBANG SEKOLAH' };
    const locTabs = [
      {id:'pesan', icon:'💬', name:'Pesan', active:loc==='pesan', playable:true},
      {id:'lab', icon:'💻', name:'Lab Komputer', active:loc==='lab', playable:true},
      {id:'gerbang', icon:'🚧', name:'Gerbang', active:loc==='gerbang', playable:true},
      {id:'x1', icon:'🏫', name:'Ruang OSIS', active:false, playable:false},
      {id:'x2', icon:'📖', name:'Kelas 2B', active:false, playable:false},
      {id:'x3', icon:'🏃', name:'Lapangan', active:false, playable:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':(l.playable?'':'locked')}" data-loc="${l.id}" data-playable="${l.playable?1:0}"><span class="lt-icon">${l.icon}</span>${l.name}${l.playable?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Temukan siapa yang membuat dan menyebarkan pesan palsu tentang libur sekolah.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Pesan terkirim pukul 05.47, sebelum jam sekolah</li>
              <li>Komputer Lab 07 dipakai untuk membuat gambar pengumuman</li>
              <li>Ada 4 orang yang dicurigai</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Cocokkan waktu login komputer dengan buku absen gerbang — pemilik akun belum tentu pelakunya.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">${stageTitles[loc]}</div>
          <div class="standees">${standeeHtml}</div>
          <div class="hotspot-grid">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objs.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object3', { objId: obj.id, loc });
      });
    });
    $all('.standee', app).forEach(el=>{
      el.addEventListener('click', ()=> goTo('dialogue3', { charId: el.getAttribute('data-char') }));
    });
    $all('.loc-tab', app).forEach(el=>{
      if(el.getAttribute('data-playable') === '1'){
        el.addEventListener('click', ()=> switchTo('location3', { loc: el.getAttribute('data-loc') }));
      }
    });
  }

  function renderObject3(params){
    const objs = loc3Map[params.loc];
    const obj = objs.find(o=> o.id === params.objId);
    if(obj.flavor){
      app.innerHTML = `<div class="card"><span class="eyebrow">Pemeriksaan</span><h1>${obj.label.replace(/^\S+\s/,'')}</h1><p>${obj.flavor}</p></div>`;
      return;
    }
    if(obj.puzzle){
      goTo('puzzle-sandi');
      stack.pop();
      return;
    }
    const key = obj.clue;
    if(!state.case3.clues[key]){
      state.case3.clues[key] = true;
      saveProgress();
    }
    const c = clueDB3[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleSandi(){
    function draw(){
      if(state.case3.sandiSolved){
        app.innerHTML = `
          <div class="card">
            <span class="eyebrow">Komputer Terbuka</span>
            <h1>${clueDB3.G.tag}</h1>
            <div class="clue-popup show"><span class="tag">Dicatat di Buku Catatan</span><p style="margin:0;">${clueDB3.G.text}</p></div>
            <div class="btn-row"><button class="btn secondary" id="backObj3">← Kembali</button></div>
          </div>`;
        $('#backObj3').addEventListener('click', goBack);
        return;
      }
      if(!state.case3.clues.E){ state.case3.clues.E = true; saveProgress(); }
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Layar Kunci</span>
          <h1>Komputer Terkunci</h1>
          <div class="clue-popup show"><span class="tag">${clueDB3.E.tag}</span><p style="margin:0;">${clueDB3.E.text}</p></div>
          <p>Ada catatan kecil ditempel di monitor: <strong>"Password = 2 digit terakhir tahun berdiri sekolah + nomor ruang ini"</strong>. Cari kedua info itu di sekitar Lab Komputer.</p>
          <div class="puzzle-box">
            <input type="text" id="sandiInput" placeholder="Masukkan sandi" maxlength="6">
            <button class="btn" id="submitSandi" style="margin-left:8px;">Buka</button>
            <div class="puzzle-msg" id="sandiMsg"></div>
          </div>
        </div>`;
      $('#submitSandi').addEventListener('click', ()=>{
        const val = $('#sandiInput').value.replace(/\D/g,'');
        const msg = $('#sandiMsg');
        if(val === '9807'){
          state.case3.sandiSolved = true;
          state.case3.clues.G = true;
          saveProgress();
          draw();
        } else {
          state.case3.sandiAttempts++;
          state.case3.hearts = Math.max(0, state.case3.hearts-1);
          updateChrome();
          msg.textContent = 'Sandi salah. Coba periksa lagi prasasti dan plat nomor ruang di Lab Komputer.';
          msg.className = 'puzzle-msg wrong';
        }
      });
    }
    draw();
  }

  function renderCharacterlist3(){
    const rows = Object.keys(charDB3).map(key=>{
      const c = charDB3[key];
      const read = !!state.case3.charsRead[key];
      return `<div class="char-row ${read?'read':''}" data-char="${key}">
        <svg class="avatar-icon"><use href="#${c.avatar}"></use></svg>
        <div class="char-info"><span class="name">${c.name}</span><span class="role">${c.role}</span></div>
        <span>💬</span>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Grup Chat Sekolah</span><h1>Bicara dengan Tersangka</h1><p>Tanyai keempat orang ini soal keberadaan mereka pagi itu.</p><div class="char-list">${rows}</div></div>`;
    $all('.char-row', app).forEach(el=> el.addEventListener('click', ()=> goTo('dialogue3', { charId: el.getAttribute('data-char') })));
  }

  function renderDialogue3(params){
    const key = params.charId;
    const c = charDB3[key];
    if(!state.case3.charsRead[key]){ state.case3.charsRead[key] = true; saveProgress(); }
    if(!state.case3.dialogueLog[key]) state.case3.dialogueLog[key] = [];

    function draw(){
      const logHtml = state.case3.dialogueLog[key].map(l=> `<div class="bubble q">${l.q}</div><div class="bubble">${l.a}</div>`).join('');
      app.innerHTML = `
        <div class="card">
          <div class="dialogue-head">
            <svg class="avatar-icon big"><use href="#${c.avatar}"></use></svg>
            <div class="who"><h2>${c.name}</h2><p style="margin:0; font-size:12px; color:var(--text-muted);">${c.role} — <em>${c.personality}</em></p></div>
          </div>
          <div class="dlog">${logHtml}</div>
          <div class="topic-row">
            <button class="topic-btn" data-t="waktu">💬 Tanya tentang keberadaannya pagi itu</button>
            <button class="topic-btn" data-t="ruang">💬 Tanya tentang Lab Komputer</button>
            <button class="topic-btn" data-t="orang">💬 Tanya tentang orang lain</button>
            <button class="topic-btn" data-t="bukti">🔎 Tunjukkan bukti</button>
          </div>
        </div>`;
      $all('.topic-btn', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const t = btn.getAttribute('data-t');
          if(t === 'bukti'){ showEvidencePicker(); return; }
          const questions = { waktu:'Kamu di mana pagi itu, sebelum pesan tersebar?', ruang:'Ada urusan apa kamu dengan Lab Komputer 07?', orang:'Lihat orang lain di sekitar situ?' };
          state.case3.dialogueLog[key].push({ q: questions[t], a: c.topics[t] });
          draw();
        });
      });
    }
    function showEvidencePicker(){
      const collected = Object.keys(state.case3.clues).filter(k=> state.case3.clues[k]);
      if(collected.length === 0){
        state.case3.dialogueLog[key].push({ q:'(Menunjukkan bukti)', a:'Kamu belum punya bukti apa pun untuk ditunjukkan.' });
        draw();
        return;
      }
      const options = collected.map(k=> `<button class="topic-btn" data-clue="${k}">${clueDB3[k].tag}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pilih Bukti</span>
          <h1>Tunjukkan ke ${c.name}</h1>
          <div class="topic-row">${options}</div>
          <div class="btn-row"><button class="btn secondary" id="cancelEv3">← Batal</button></div>
        </div>`;
      $all('[data-clue]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const ck = btn.getAttribute('data-clue');
          const reaction = c.reactions[ck] || c.reactions.default;
          state.case3.dialogueLog[key].push({ q:'Menunjukkan bukti: '+clueDB3[ck].tag, a:reaction });
          draw();
        });
      });
      $('#cancelEv3').addEventListener('click', draw);
    }
    draw();
  }

  function renderAccusation3(){
    const opts = Object.keys(charDB3).map(k=>{
      const c = charDB3[k];
      return `<button class="suspect-btn" data-suspect="${k}"><svg class="avatar-icon small"><use href="#${c.avatar}"></use></svg><span>${c.name} — ${c.role}</span></button>`;
    }).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Keputusan Akhir</span>
        <h1>Siapa Sumber Pesan Palsu Ini?</h1>
        <p>Berdasarkan bukti digital dan kesaksian yang kamu kumpulkan, siapa yang menurutmu membuat dan menyebarkan pesan itu?</p>
        <div class="suspects">${opts}</div>
      </div>`;
    $all('.suspect-btn', app).forEach(btn=> btn.addEventListener('click', ()=> resolveEnding3(btn.getAttribute('data-suspect'))));
  }

  function resolveEnding3(suspect){
    const cluesFound = Object.keys(state.case3.clues).length;
    const noMistakes = state.case3.sandiAttempts === 0;
    let stars = 1;
    if(cluesFound >= 7) stars++;
    if(noMistakes) stars++;

    let badgeClass, badgeText, title, text, caseSolved = false;
    if(suspect === 'reno' && cluesFound >= 7){
      badgeClass='ending-true'; badgeText='TRUE ENDING'; title='Kasus Terpecahkan';
      text = 'Kamu benar. Reno bilang dia baru sampai sekolah jam 06.00 — tapi buku absen gerbang mencatatnya sudah masuk jam 05.25, lebih awal dari Kevin sekalipun. Kevin memang login ke komputer Lab 07 jam 05.30 untuk mencetak tugas, tapi lupa logout saat buru-buru pergi. Reno memakai sesi yang masih terbuka itu untuk membuat gambar pengumuman palsu jam 05.40 dan mengirimnya jam 05.47. Reno akhirnya mengaku — dia cuma iseng ingin sekolah diliburkan, tidak menyangka pesannya akan dipercaya sebanyak itu.';
      state.case3.caseStatus = 'done'; caseSolved = true;
    } else if(suspect === 'reno' && cluesFound < 7){
      badgeClass='ending-incomplete'; badgeText='INCOMPLETE ENDING'; title='Tuduhan Benar, Bukti Kurang';
      text = 'Kamu menuduh orang yang tepat — Reno memang sumber pesan palsu itu. Tapi tanpa semua bukti terkumpul, pihak sekolah masih ragu menerima kesimpulanmu sepenuhnya.';
      stars = Math.min(stars,2);
      state.case3.caseStatus = 'done';
    } else {
      badgeClass='ending-wrong'; badgeText='WRONG ENDING'; title='Tersangka yang Salah';
      const wrongTexts = {
        kevin:'Kevin memang pemilik akun yang login ke komputer itu, tapi dia sendiri sudah kembali ke kelas sebelum pesan dibuat — akunnya cuma dipakai orang lain yang lupa dia logout.',
        lala:'Lala baru sampai sekolah jam 06.15, jauh setelah pesan itu terkirim jam 05.47. Alibinya konsisten dengan semua bukti.',
        caca:'Caca terbukti masih di rumah pagi itu, dan justru dialah yang pertama curiga soal gaya bahasa pesan yang aneh.'
      };
      text = (wrongTexts[suspect]||'') + ' Kembali periksa Buku Catatan dan bandingkan lagi waktu login komputer dengan buku absen gerbang.';
      stars = 0;
      state.case3.caseStatus = state.case3.caseStatus === 'done' ? 'done' : 'progress';
    }
    saveProgress();

    app.innerHTML = `
      <div class="card">
        <span class="ending-badge ${badgeClass}">${badgeText}</span>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p style="font-size:12px;">Bintang didapat dari: menuduh dengan tepat, mengumpulkan semua bukti, dan tidak salah membuka sandi komputer.</p>
        <div class="btn-row">
          <button class="btn" id="guessAgain3">Tebak Lagi</button>
          <button class="btn secondary" id="backHub3b">Kembali ke Kasus 3</button>
        </div>
        ${caseSolved ? '<div class="btn-row"><button class="btn" id="toCaselist3">Lihat Daftar Kasus →</button></div>' : ''}
      </div>`;
    $('#guessAgain3').addEventListener('click', ()=> goTo('accusation3'));
    $('#backHub3b').addEventListener('click', ()=> goTo('casehub3',{id:'case3'}));
    const nl = $('#toCaselist3'); if(nl) nl.addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- KASUS 4 ---------- */
  function renderCasehub4(){
    const pct = caseProgressPct4();
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Siang ini — Sebelum Pemeriksaan Guru</span>
        <h1>Kasus 04: Misteri Laboratorium</h1>
        <p>Saat guru hendak memeriksa laboratorium, catatan hasil percobaan ternyata sudah berubah. Beberapa data tidak sesuai dengan hasil sebenarnya. Kamu diminta mencari tahu siapa yang mengubahnya.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case4.clues).length}/7 &nbsp;•&nbsp; Saksi ditanyai: ${Object.keys(state.case4.charsRead).length}/3</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location4"><span>🧪 Laboratorium</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="accusation4"><span>⚖️ Ajukan Tuduhan</span><span class="arrow">→</span></div>
        </div>
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderLocation4(){
    const objHtml = objects4.map(o=>{
      let done = false;
      if(o.clue) done = !!state.case4.clues[o.clue];
      else if(o.puzzle) done = state.case4.laciOpened;
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}">🔍 <span>${o.label.replace(/^\S+\s/,'')}</span></div>`;
    }).join('');
    const standeeHtml = Object.keys(charDB4).map(k=>{
      const c = charDB4[k];
      const read = !!state.case4.charsRead[k];
      return `<div class="standee ${read?'read':''}" data-char="${k}">
        <span class="bicara">💬 Bicara</span><br>
        <svg class="avatar-icon stage"><use href="#${c.avatar}"></use></svg>
        <div class="ring"></div>
        <div class="sname">${c.name}</div>
      </div>`;
    }).join('');
    const locTabs = [
      {icon:'🧪', name:'Laboratorium', active:true},
      {icon:'🏫', name:'Ruang OSIS', active:false},
      {icon:'📖', name:'Kelas 2B', active:false},
      {icon:'💬', name:'Grup Chat', active:false},
      {icon:'🚧', name:'Gerbang', active:false},
      {icon:'🏃', name:'Lapangan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Cari tahu siapa yang mengubah isi catatan hasil percobaan laboratorium.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Catatan resmi Percobaan 4 = 88</li>
              <li>Laci lab terkunci dengan pola angka</li>
              <li>Jam 13.00–14.00 adalah jatah Kelompok B</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Bandingkan angka di catatan resmi dengan sobekan di tempat sampah dan isi laci.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">🧪 LABORATORIUM</div>
          <div class="standees">${standeeHtml}</div>
          <div class="hotspot-grid">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects4.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object4', { objId: obj.id });
      });
    });
    $all('.standee', app).forEach(el=>{
      el.addEventListener('click', ()=> goTo('dialogue4', { charId: el.getAttribute('data-char') }));
    });
  }

  function renderObject4(params){
    const obj = objects4.find(o=> o.id === params.objId);
    if(obj.flavor){
      app.innerHTML = `<div class="card"><span class="eyebrow">Pemeriksaan</span><h1>${obj.label.replace(/^\S+\s/,'')}</h1><p>${obj.flavor}</p></div>`;
      return;
    }
    if(obj.puzzle && !state.case4.laciOpened){
      goTo('puzzle-data');
      stack.pop();
      return;
    }
    const key = obj.clue;
    if(!state.case4.clues[key]){
      state.case4.clues[key] = true;
      saveProgress();
    }
    const c = clueDB4[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleData(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Laci Laboratorium</span>
        <h1>Temukan Angka yang Hilang</h1>
        <p>Catatan resmi menunjukkan pola hasil percobaan: <strong>75, 82, 91, ?</strong>. Perhatikan baik-baik selisih antar angkanya.</p>
        <div class="puzzle-box">
          <div class="puzzle-sequence">75 → 82 → 91 → ?</div>
          <p style="margin:0 0 6px; font-size:13px;">Masukkan angka yang seharusnya melanjutkan pola ini untuk membuka laci.</p>
          <input type="number" id="dataInput" placeholder="?">
          <button class="btn" id="submitData" style="margin-left:8px;">Coba Buka</button>
          <div class="puzzle-msg" id="dataMsg"></div>
        </div>
      </div>`;
    $('#submitData').addEventListener('click', ()=>{
      const val = parseInt($('#dataInput').value, 10);
      const msg = $('#dataMsg');
      if(val === 102){
        msg.textContent = 'Klik. Laci terbuka.';
        msg.className = 'puzzle-msg right';
        state.case4.laciOpened = true;
        ['E','F','G'].forEach(k=> state.case4.clues[k] = true);
        saveProgress();
        setTimeout(goBack, 500);
      } else {
        state.case4.laciAttempts++;
        state.case4.hearts = Math.max(0, state.case4.hearts-1);
        updateChrome();
        msg.textContent = 'Bukan itu. Perhatikan lagi selisih antar angkanya: 75→82 itu +7, 82→91 itu +9...';
        msg.className = 'puzzle-msg wrong';
      }
    });
  }

  function renderCharacterlist4(){
    const rows = Object.keys(charDB4).map(key=>{
      const c = charDB4[key];
      const read = !!state.case4.charsRead[key];
      return `<div class="char-row ${read?'read':''}" data-char="${key}">
        <svg class="avatar-icon"><use href="#${c.avatar}"></use></svg>
        <div class="char-info"><span class="name">${c.name}</span><span class="role">${c.role}</span></div>
        <span>💬</span>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Laboratorium</span><h1>Bicara dengan Saksi</h1><p>Tanyai siswa yang memakai lab hari ini tentang keberadaan mereka.</p><div class="char-list">${rows}</div></div>`;
    $all('.char-row', app).forEach(el=> el.addEventListener('click', ()=> goTo('dialogue4', { charId: el.getAttribute('data-char') })));
  }

  function renderDialogue4(params){
    const key = params.charId;
    const c = charDB4[key];
    if(!state.case4.charsRead[key]){ state.case4.charsRead[key] = true; saveProgress(); }
    if(!state.case4.dialogueLog[key]) state.case4.dialogueLog[key] = [];

    function draw(){
      const logHtml = state.case4.dialogueLog[key].map(l=> `<div class="bubble q">${l.q}</div><div class="bubble">${l.a}</div>`).join('');
      app.innerHTML = `
        <div class="card">
          <div class="dialogue-head">
            <svg class="avatar-icon big"><use href="#${c.avatar}"></use></svg>
            <div class="who"><h2>${c.name}</h2><p style="margin:0; font-size:12px; color:var(--text-muted);">${c.role} — <em>${c.personality}</em></p></div>
          </div>
          <div class="dlog">${logHtml}</div>
          <div class="topic-row">
            <button class="topic-btn" data-t="waktu">💬 Tanya tentang keberadaannya siang ini</button>
            <button class="topic-btn" data-t="ruang">💬 Tanya tentang Laboratorium</button>
            <button class="topic-btn" data-t="orang">💬 Tanya tentang orang lain</button>
            <button class="topic-btn" data-t="bukti">🔎 Tunjukkan bukti</button>
          </div>
        </div>`;
      $all('.topic-btn', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const t = btn.getAttribute('data-t');
          if(t === 'bukti'){ showEvidencePicker(); return; }
          const questions = { waktu:'Kamu di mana siang ini?', ruang:'Ada urusan apa kamu dengan laboratorium?', orang:'Lihat orang lain di sekitar situ?' };
          state.case4.dialogueLog[key].push({ q: questions[t], a: c.topics[t] });
          draw();
        });
      });
    }
    function showEvidencePicker(){
      const collected = Object.keys(state.case4.clues).filter(k=> state.case4.clues[k]);
      if(collected.length === 0){
        state.case4.dialogueLog[key].push({ q:'(Menunjukkan bukti)', a:'Kamu belum punya bukti apa pun untuk ditunjukkan.' });
        draw();
        return;
      }
      const options = collected.map(k=> `<button class="topic-btn" data-clue="${k}">${clueDB4[k].tag}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pilih Bukti</span>
          <h1>Tunjukkan ke ${c.name}</h1>
          <div class="topic-row">${options}</div>
          <div class="btn-row"><button class="btn secondary" id="cancelEv4">← Batal</button></div>
        </div>`;
      $all('[data-clue]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const ck = btn.getAttribute('data-clue');
          const reaction = c.reactions[ck] || c.reactions.default;
          state.case4.dialogueLog[key].push({ q:'Menunjukkan bukti: '+clueDB4[ck].tag, a:reaction });
          draw();
        });
      });
      $('#cancelEv4').addEventListener('click', draw);
    }
    draw();
  }

  function renderAccusation4(){
    const opts = Object.keys(charDB4).map(k=>{
      const c = charDB4[k];
      return `<button class="suspect-btn" data-suspect="${k}"><svg class="avatar-icon small"><use href="#${c.avatar}"></use></svg><span>${c.name} — ${c.role}</span></button>`;
    }).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Keputusan Akhir</span>
        <h1>Siapa yang Mengubah Data?</h1>
        <p>Berdasarkan bukti dan kesaksian yang kamu kumpulkan, siapa yang menurutmu mengubah catatan hasil percobaan?</p>
        <div class="suspects">${opts}</div>
      </div>`;
    $all('.suspect-btn', app).forEach(btn=> btn.addEventListener('click', ()=> resolveEnding4(btn.getAttribute('data-suspect'))));
  }

  function resolveEnding4(suspect){
    const cluesFound = Object.keys(state.case4.clues).length;
    const noMistakes = state.case4.laciAttempts === 0;
    let stars = 1;
    if(cluesFound >= 7) stars++;
    if(noMistakes) stars++;

    let badgeClass, badgeText, title, text, caseSolved = false;
    if(suspect === 'yoga' && cluesFound >= 7){
      badgeClass='ending-true'; badgeText='TRUE ENDING'; title='Kasus Terpecahkan';
      text = 'Kamu benar. Yoga bilang dia cuma balik lagi jam 13.00 buat cek hasil percobaan — tapi jadwal menunjukkan jam segitu adalah jatah Kelompok B, bukan kelompoknya. Sobekan angka asli (58) di tempat sampah, dicoret pakai pensil bertuliskan namanya sendiri, terbukti berbeda jauh dari catatan resmi yang beredar (88). Yoga akhirnya mengaku: dia mengubah datanya karena takut mendapat nilai buruk.';
      state.case4.caseStatus = 'done'; caseSolved = true;
    } else if(suspect === 'yoga' && cluesFound < 7){
      badgeClass='ending-incomplete'; badgeText='INCOMPLETE ENDING'; title='Tuduhan Benar, Bukti Kurang';
      text = 'Kamu menuduh orang yang tepat — Yoga memang yang mengubah data. Tapi tanpa semua bukti terkumpul, guru pembimbing masih ragu menerima kesimpulanmu sepenuhnya.';
      stars = Math.min(stars,2);
      state.case4.caseStatus = 'done';
    } else {
      badgeClass='ending-wrong'; badgeText='WRONG ENDING'; title='Tersangka yang Salah';
      const wrongTexts = {
        bima:'Bima sudah keluar dari lab sejak jam 12.00 dan tidak pernah kembali lagi siang itu — tidak ada bukti yang bertentangan dengan ceritanya.',
        sari:'Sari memang masuk lab jam 13.00, tapi itu sesuai jadwal resmi Kelompok B. Dia bahkan yang pertama curiga ada anak kelompok pagi masih di sana.'
      };
      text = (wrongTexts[suspect]||'') + ' Kembali periksa Buku Catatan dan bandingkan lagi jadwal penggunaan lab dengan kesaksian ketiga orang ini.';
      stars = 0;
      state.case4.caseStatus = state.case4.caseStatus === 'done' ? 'done' : 'progress';
    }
    saveProgress();

    app.innerHTML = `
      <div class="card">
        <span class="ending-badge ${badgeClass}">${badgeText}</span>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p style="font-size:12px;">Bintang didapat dari: menuduh dengan tepat, mengumpulkan semua bukti, dan tidak salah membuka laci.</p>
        <div class="btn-row">
          <button class="btn" id="guessAgain4">Tebak Lagi</button>
          <button class="btn secondary" id="backHub4b">Kembali ke Kasus 4</button>
        </div>
        ${caseSolved ? '<div class="btn-row"><button class="btn" id="toCaselist4">Lihat Daftar Kasus →</button></div>' : ''}
      </div>`;
    $('#guessAgain4').addEventListener('click', ()=> goTo('accusation4'));
    $('#backHub4b').addEventListener('click', ()=> goTo('casehub4',{id:'case4'}));
    const nl = $('#toCaselist4'); if(nl) nl.addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- KASUS 5 ---------- */
  function renderCasehub5(){
    const pct = caseProgressPct5();
    const ready = !!state.case5.clues.G;
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Siang ini — Perpustakaan Sekolah</span>
        <h1>Kasus 05: Rahasia Perpustakaan</h1>
        <p>Penjaga perpustakaan menemukan sebuah buku tua berkode L-17 hilang — tanpa catatan peminjaman sama sekali. Kasus ini terasa lebih rumit dari sebelumnya.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case5.clues).length}/7</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location5"><span>📚 Perpustakaan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          ${ready ? '<div class="menu-item" data-nav="ending5" style="--item-color:linear-gradient(135deg,#7a5fd0,#6247ad);"><span>🔗 Simpulkan Kasus</span><span class="arrow">→</span></div>' : ''}
        </div>
        ${!ready ? '<p style="font-size:11px; opacity:0.7;">Temukan Buku Misterius (Rak 7 — Buku 23) dulu sebelum bisa menyimpulkan kasus ini.</p>' : ''}
      </div>`;
    $all('[data-nav]', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const nav = el.getAttribute('data-nav');
        goTo(nav);
      });
    });
  }

  function renderLocation5(){
    const objHtml = objects5.map(o=>{
      let done = false;
      if(o.clue) done = !!state.case5.clues[o.clue];
      else if(o.clue3) done = o.clue3.every(k=> state.case5.clues[k]);
      const locked = o.gate && !state.case5.clues[o.gate];
      return `<div class="hotspot-chip ${done?'done':''} ${locked?'':''}" data-obj="${o.id}" style="${locked?'opacity:0.55;':''}">🔍 <span>${o.label.replace(/^\S+\s/,'')}${locked?' 🔒':''}</span></div>`;
    }).join('');
    const locTabs = [
      {icon:'📚', name:'Perpustakaan', active:true},
      {icon:'🏫', name:'Ruang OSIS', active:false},
      {icon:'📖', name:'Kelas 2B', active:false},
      {icon:'💬', name:'Grup Chat', active:false},
      {icon:'🧪', name:'Lab Komputer', active:false},
      {icon:'🏃', name:'Lapangan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Temukan buku misterius berkode L-17 yang hilang tanpa catatan peminjaman.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Rak: A → B → C → D → ?</li>
              <li>"Temukan tempat yang tidak tercatat"</li>
              <li>Ada kunci kecil tersembunyi di suatu tempat</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Beberapa objek baru terbuka setelah objek lain diperiksa lebih dulu — ikuti urutannya.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">📚 PERPUSTAKAAN</div>
          <div class="hotspot-grid" style="margin-top:8px;">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects5.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.gate && !state.case5.clues[obj.gate]){
          goTo('object5', { objId:'__locked__', msg:`Kamu belum bisa memeriksa ini. Selesaikan dulu langkah sebelumnya di Perpustakaan.` });
          return;
        }
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object5', { objId: obj.id });
      });
    });
  }

  function renderObject5(params){
    if(params.objId === '__locked__'){
      app.innerHTML = `<div class="card"><span class="eyebrow">Belum Bisa Diperiksa</span><h1>Masih Terkunci</h1><p>${params.msg}</p></div>`;
      return;
    }
    const obj = objects5.find(o=> o.id === params.objId);
    if(obj.clue3){
      const already = obj.clue3.every(k=> state.case5.clues[k]);
      if(!already){
        obj.clue3.forEach(k=> state.case5.clues[k] = true);
        saveProgress();
      }
      const items = obj.clue3.map(k=> `<div class="clue-popup show" style="margin-top:10px;"><span class="tag">${clueDB5[k].tag}</span><p style="margin:0;">${clueDB5[k].text}</p></div>`).join('');
      app.innerHTML = `<div class="card"><span class="eyebrow">Laci Lama Terbuka</span><h1>Isi Laci</h1>${items}</div>`;
      return;
    }
    const key = obj.clue;
    if(!state.case5.clues[key]){
      state.case5.clues[key] = true;
      saveProgress();
    }
    const c = clueDB5[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleRak(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Cari Rak yang Hilang</span>
        <h1>Rak: A → B → C → D → ?</h1>
        <p>Petunjuk yang tertinggal berbunyi: <em>"Temukan tempat yang tidak tercatat."</em> Rak mana yang kamu periksa?</p>
        <div class="suspects">
          <button class="suspect-btn" data-rak="A"><span>Rak A</span></button>
          <button class="suspect-btn" data-rak="B"><span>Rak B</span></button>
          <button class="suspect-btn" data-rak="C"><span>Rak C</span></button>
          <button class="suspect-btn" data-rak="D"><span>Rak D</span></button>
          <button class="suspect-btn" data-rak="E"><span>Rak E</span></button>
          <button class="suspect-btn" data-rak="X"><span>Bagian rak yang tidak tercatat di katalog</span></button>
        </div>
        <div class="puzzle-msg" id="rakMsg"></div>
      </div>`;
    $all('[data-rak]', app).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const val = btn.getAttribute('data-rak');
        const msg = $('#rakMsg');
        if(val === 'X'){
          state.case5.rakSolved = true;
          state.case5.clues.B = true;
          saveProgress();
          msg.textContent = 'Benar. Di balik rak yang tidak tercatat itu, ada sesuatu tersembunyi.';
          msg.className = 'puzzle-msg right';
          setTimeout(goBack, 600);
        } else {
          state.case5.rakAttempts++;
          state.case5.hearts = Math.max(0, state.case5.hearts-1);
          updateChrome();
          msg.textContent = 'Bukan di situ. Ingat petunjuknya — cari yang TIDAK tercatat di katalog.';
          msg.className = 'puzzle-msg wrong';
        }
      });
    });
  }

  function renderPuzzleSimbol(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Terjemahkan Simbol</span>
        <h1>Cocokkan Simbol dengan Huruf</h1>
        <p>Kunci penerjemahan simbol yang kamu temukan:</p>
        <div class="puzzle-box">
          <p style="margin:0 0 10px; font-family:'Baloo 2',sans-serif; font-weight:700; letter-spacing:2px;">
            ✦ = K &nbsp;&nbsp; ▲ = U &nbsp;&nbsp; ● = N &nbsp;&nbsp; ■ = C &nbsp;&nbsp; ◆ = I
          </p>
          <div class="puzzle-sequence" style="letter-spacing:10px;">✦ ▲ ● ■ ◆</div>
          <p style="margin:10px 0 6px; font-size:13px;">Ketik hasil terjemahannya di bawah ini.</p>
          <input type="text" id="simbolInput" maxlength="10" style="text-transform:uppercase;">
          <button class="btn" id="submitSimbol" style="margin-left:8px;">Terjemahkan</button>
          <div class="puzzle-msg" id="simbolMsg"></div>
        </div>
      </div>`;
    $('#submitSimbol').addEventListener('click', ()=>{
      const val = $('#simbolInput').value.trim().toUpperCase();
      const msg = $('#simbolMsg');
      if(val === 'KUNCI'){
        state.case5.simbolSolved = true;
        state.case5.clues.F = true;
        saveProgress();
        msg.textContent = 'Benar — "KUNCI". Sebuah kode muncul: RAK 7 — BUKU 23.';
        msg.className = 'puzzle-msg right';
        setTimeout(goBack, 800);
      } else {
        state.case5.simbolAttempts++;
        state.case5.hearts = Math.max(0, state.case5.hearts-1);
        updateChrome();
        msg.textContent = 'Belum tepat. Cocokkan tiap simbol satu per satu dengan kuncinya.';
        msg.className = 'puzzle-msg wrong';
      }
    });
  }

  function renderHubungan5(){
    const links = [
      {icon:'🏆', name:'Kasus 1 — Misteri Hilangnya Piala'},
      {icon:'🔐', name:'Kasus 2 — Misteri Ruang Kelas Terkunci'},
      {icon:'📱', name:'Kasus 3 — Pesan Palsu'},
      {icon:'🧪', name:'Kasus 4 — Misteri Laboratorium'},
      {icon:'📚', name:'Kasus 5 — Rahasia Perpustakaan'},
    ].map(l=> `<div class="board-avatar" style="width:auto; text-align:left; display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="font-size:20px;">${l.icon}</span><span class="name" style="margin:0;">${l.name}</span></div>`).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Renungkan Semua Petunjuk</span>
        <h1>Benang Merah</h1>
        <p>Kamu membuka Buku Misterius, dan sesuatu terasa aneh. Kamu mulai membandingkan semua kasus yang pernah kamu selidiki...</p>
        <div class="board-section">${links}</div>
        <p><strong>Semuanya memiliki simbol yang sama.</strong> Simbol yang sama persis dengan yang kamu terjemahkan di laci lama perpustakaan.</p>
        <div class="btn-row"><button class="btn secondary" id="backLoc5">← Kembali</button></div>
      </div>`;
    $('#backLoc5').addEventListener('click', goBack);
  }

  function renderEnding5(){
    state.case5.caseStatus = 'done';
    saveProgress();
    app.innerHTML = `
      <div class="card">
        <span class="ending-badge" style="background:var(--purple); color:#fff;">MISTERI BELUM SELESAI</span>
        <h1>Seseorang Sengaja Meninggalkan Petunjuk</h1>
        <p>Kamu berhasil menemukan Buku Misterius di Rak 7 — Buku 23. Isinya berisi catatan kejadian-kejadian lama di sekolah, dan beberapa di antaranya memiliki pola yang sama dengan kasus-kasus yang baru saja kamu selidiki.</p>
        <p>Piala, ruang kelas terkunci, pesan palsu, laboratorium, dan sekarang perpustakaan — semuanya menyimpan simbol misterius yang sama. Seseorang tampaknya sengaja meninggalkan jejak ini untukmu.</p>
        <p><strong>Tapi siapa? Untuk sekarang, itu masih belum diketahui...</strong></p>
        <div class="btn-row">
          <button class="btn secondary" id="backHub5c">Kembali ke Kasus 5</button>
          <button class="btn" id="toCaselist5">Lihat Daftar Kasus →</button>
        </div>
      </div>`;
    $('#backHub5c').addEventListener('click', ()=> goTo('casehub5',{id:'case5'}));
    $('#toCaselist5').addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- KASUS 6 ---------- */
  function renderCasehub6(){
    const pct = caseProgressPct6();
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Siang ini — Sebelum Rapat OSIS</span>
        <h1>Kasus 06: Alibi Sempurna</h1>
        <p>Sebuah dokumen penting OSIS hilang. Ada 4 orang yang berada di sekolah saat kejadian — dan semuanya punya alibi. Masalahnya, alibi yang sempurna belum tentu benar semuanya.</p>
        <p style="font-size:12px;">Progress penyelidikan: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case6.clues).length}/5 &nbsp;•&nbsp; Tersangka ditanyai: ${Object.keys(state.case6.charsRead).length}/4</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location6"><span>🎭 Investigasi Alibi</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="accusation6"><span>⚖️ Ajukan Tuduhan</span><span class="arrow">→</span></div>
        </div>
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderLocation6(){
    const objHtml = objects6.map(o=>{
      let done = false;
      if(o.clue) done = !!state.case6.clues[o.clue];
      let locked = false;
      if(o.gate === 'ALL5') locked = !['A','B','C','D','E'].every(k=> state.case6.clues[k]);
      else if(o.gate === 'waktuSolved') locked = !state.case6.waktuSolved;
      if(o.gate === 'ALL5' && !locked) done = state.case6.waktuSolved;
      if(o.gate === 'waktuSolved' && !locked) done = state.case6.pernyataanSolved;
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}" style="${locked?'opacity:0.55;':''}">🔍 <span>${o.label.replace(/^\S+\s/,'')}${locked?' 🔒':''}</span></div>`;
    }).join('');
    const standeeHtml = Object.keys(charDB6).map(k=>{
      const c = charDB6[k];
      const read = !!state.case6.charsRead[k];
      return `<div class="standee ${read?'read':''}" data-char="${k}">
        <span class="bicara">💬 Bicara</span><br>
        <svg class="avatar-icon stage"><use href="#${c.avatar}"></use></svg>
        <div class="ring"></div>
        <div class="sname">${c.name}</div>
      </div>`;
    }).join('');
    const locTabs = [
      {icon:'🎭', name:'Investigasi', active:true},
      {icon:'🏫', name:'Ruang OSIS', active:false},
      {icon:'📖', name:'Kelas 2B', active:false},
      {icon:'💬', name:'Grup Chat', active:false},
      {icon:'🧪', name:'Lab Komputer', active:false},
      {icon:'📚', name:'Perpustakaan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Temukan siapa yang berbohong, meskipun semua orang punya alibi yang terlihat masuk akal.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>13.10 → Kantin, 13.20 → Perpustakaan</li>
              <li>13.25 → Ruang OSIS, 13.30 → Lapangan</li>
              <li>Tidak semua bukti bisa dipercaya begitu saja</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Semua orang mengatakan sesuatu yang benar — kecuali satu orang, dan kebohongannya sangat kecil.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">🎭 INVESTIGASI ALIBI</div>
          <div class="standees">${standeeHtml}</div>
          <div class="hotspot-grid">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects6.find(o=> o.id === el.getAttribute('data-obj'));
        if(obj.gate === 'ALL5' && !['A','B','C','D','E'].every(k=> state.case6.clues[k])){
          goTo('object6', { objId:'__locked__', msg:'Kumpulkan dulu kelima bukti (CCTV, catatan perpustakaan, struk kantin, jadwal kelas, kesaksian siswa) sebelum menyusun garis waktu.' });
          return;
        }
        if(obj.gate === 'waktuSolved' && !state.case6.waktuSolved){
          goTo('object6', { objId:'__locked__', msg:'Susun garis waktu dulu sebelum menguji pernyataan-pernyataan ini.' });
          return;
        }
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object6', { objId: obj.id });
      });
    });
    $all('.standee', app).forEach(el=>{
      el.addEventListener('click', ()=> goTo('dialogue6', { charId: el.getAttribute('data-char') }));
    });
  }

  function renderObject6(params){
    if(params.objId === '__locked__'){
      app.innerHTML = `<div class="card"><span class="eyebrow">Belum Bisa Diperiksa</span><h1>Masih Terkunci</h1><p>${params.msg}</p></div>`;
      return;
    }
    const obj = objects6.find(o=> o.id === params.objId);
    const key = obj.clue;
    if(!state.case6.clues[key]){
      state.case6.clues[key] = true;
      saveProgress();
    }
    const c = clueDB6[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleWaktu6(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Susun Garis Waktu</span>
        <h1>13.10 → Kantin, 13.20 → Perpustakaan, 13.25 → Ruang OSIS, 13.30 → Lapangan</h1>
        <p>Berdasarkan seluruh bukti yang kamu kumpulkan, siapa yang secara logis TIDAK MUNGKIN berada di tempat sesuai alibinya sendiri pada waktu-waktu itu?</p>
        <div class="suspects">
          <button class="suspect-btn" data-p="vino"><svg class="avatar-icon small"><use href="#avatar-vino"></use></svg><span>Vino</span></button>
          <button class="suspect-btn" data-p="dea"><svg class="avatar-icon small"><use href="#avatar-dea"></use></svg><span>Dea</span></button>
          <button class="suspect-btn" data-p="aldi"><svg class="avatar-icon small"><use href="#avatar-aldi"></use></svg><span>Aldi</span></button>
          <button class="suspect-btn" data-p="nita"><svg class="avatar-icon small"><use href="#avatar-nita"></use></svg><span>Nita</span></button>
        </div>
        <div class="puzzle-msg" id="waktuMsg"></div>
      </div>`;
    $all('[data-p]', app).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const val = btn.getAttribute('data-p');
        const msg = $('#waktuMsg');
        if(val === 'nita'){
          state.case6.waktuSolved = true;
          saveProgress();
          msg.textContent = 'Benar. Nita bilang langsung ke perpustakaan setelah kantin — tapi dia juga terlihat di depan Ruang OSIS. Waktunya tidak masuk akal.';
          msg.className = 'puzzle-msg right';
          setTimeout(goBack, 700);
        } else {
          state.case6.waktuAttempts++;
          state.case6.hearts = Math.max(0, state.case6.hearts-1);
          updateChrome();
          msg.textContent = 'Coba periksa lagi buku catatanmu — bandingkan tiap waktu dengan lokasi yang diklaim masing-masing orang.';
          msg.className = 'puzzle-msg wrong';
        }
      });
    });
  }

  function renderPuzzlePernyataan6(){
    const statements = [
      { text:'CCTV bisa memastikan siapa yang lewat Ruang OSIS jam 13.25.', answer:'SALAH' },
      { text:'Dea tercatat masuk perpustakaan jam 13.12.', answer:'BENAR' },
      { text:'Nita juga tercatat masuk perpustakaan seperti kata Dea.', answer:'SALAH' },
      { text:'Aldi benar-benar ada di lapangan saat kejadian.', answer:'BELUM TERBUKTI' },
    ];
    let idx = 0;
    function draw(){
      if(idx >= statements.length){
        state.case6.pernyataanSolved = true;
        saveProgress();
        app.innerHTML = `
          <div class="card">
            <span class="eyebrow">Selesai</span>
            <h1>Semua Pernyataan Teruji</h1>
            <p>Kamu sudah menguji semua pernyataan. Satu pola kebohongan kecil mulai terlihat jelas.</p>
            <div class="btn-row"><button class="btn secondary" id="backObj6">← Kembali</button></div>
          </div>`;
        $('#backObj6').addEventListener('click', goBack);
        return;
      }
      const s = statements[idx];
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pernyataan ${idx+1} dari ${statements.length}</span>
          <h1>Uji Pernyataan Ini</h1>
          <div class="clue-popup show"><p style="margin:0;">"${s.text}"</p></div>
          <div class="btn-row">
            <button class="btn" id="pBenar" style="background:linear-gradient(135deg,#52c78a,#3a9c68);">🟢 BENAR</button>
            <button class="btn" id="pSalah" style="background:linear-gradient(135deg,#d9556b,#b03c50);">🔴 SALAH</button>
            <button class="btn" id="pBelum" style="background:linear-gradient(135deg,#e8b84b,#c99a35); color:#332204;">🟡 BELUM TERBUKTI</button>
          </div>
          <div class="puzzle-msg" id="pMsg"></div>
        </div>`;
      function check(choice){
        const msg = $('#pMsg');
        if(choice === s.answer){
          msg.textContent = 'Tepat.';
          msg.className = 'puzzle-msg right';
          idx++;
          setTimeout(draw, 500);
        } else {
          state.case6.pernyataanAttempts++;
          state.case6.hearts = Math.max(0, state.case6.hearts-1);
          updateChrome();
          msg.textContent = 'Belum tepat, coba periksa lagi buktinya.';
          msg.className = 'puzzle-msg wrong';
        }
      }
      $('#pBenar').addEventListener('click', ()=> check('BENAR'));
      $('#pSalah').addEventListener('click', ()=> check('SALAH'));
      $('#pBelum').addEventListener('click', ()=> check('BELUM TERBUKTI'));
    }
    draw();
  }

  function renderCharacterlist6(){
    const rows = Object.keys(charDB6).map(key=>{
      const c = charDB6[key];
      const read = !!state.case6.charsRead[key];
      return `<div class="char-row ${read?'read':''}" data-char="${key}">
        <svg class="avatar-icon"><use href="#${c.avatar}"></use></svg>
        <div class="char-info"><span class="name">${c.name}</span><span class="role">${c.role}</span></div>
        <span>💬</span>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="card"><span class="eyebrow">Ruang OSIS</span><h1>Bicara dengan Tersangka</h1><p>Keempat orang ini ada di sekolah saat dokumen hilang.</p><div class="char-list">${rows}</div></div>`;
    $all('.char-row', app).forEach(el=> el.addEventListener('click', ()=> goTo('dialogue6', { charId: el.getAttribute('data-char') })));
  }

  function renderDialogue6(params){
    const key = params.charId;
    const c = charDB6[key];
    if(!state.case6.charsRead[key]){ state.case6.charsRead[key] = true; saveProgress(); }
    if(!state.case6.dialogueLog[key]) state.case6.dialogueLog[key] = [];

    function draw(){
      const logHtml = state.case6.dialogueLog[key].map(l=> `<div class="bubble q">${l.q}</div><div class="bubble">${l.a}</div>`).join('');
      app.innerHTML = `
        <div class="card">
          <div class="dialogue-head">
            <svg class="avatar-icon big"><use href="#${c.avatar}"></use></svg>
            <div class="who"><h2>${c.name}</h2><p style="margin:0; font-size:12px; color:var(--text-muted);">${c.role} — <em>${c.personality}</em></p></div>
          </div>
          <div class="dlog">${logHtml}</div>
          <div class="topic-row">
            <button class="topic-btn" data-t="alibi">💬 Tanya soal alibinya saat kejadian</button>
            <button class="topic-btn" data-t="bukti">🔎 Tunjukkan bukti</button>
          </div>
        </div>`;
      $all('.topic-btn', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const t = btn.getAttribute('data-t');
          if(t === 'bukti'){ showEvidencePicker(); return; }
          state.case6.dialogueLog[key].push({ q:'Kamu di mana saat dokumen itu hilang?', a: c.topics.alibi });
          draw();
        });
      });
    }
    function showEvidencePicker(){
      const collected = Object.keys(state.case6.clues).filter(k=> state.case6.clues[k]);
      if(collected.length === 0){
        state.case6.dialogueLog[key].push({ q:'(Menunjukkan bukti)', a:'Kamu belum punya bukti apa pun untuk ditunjukkan.' });
        draw();
        return;
      }
      const options = collected.map(k=> `<button class="topic-btn" data-clue="${k}">${clueDB6[k].tag}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pilih Bukti</span>
          <h1>Tunjukkan ke ${c.name}</h1>
          <div class="topic-row">${options}</div>
          <div class="btn-row"><button class="btn secondary" id="cancelEv6">← Batal</button></div>
        </div>`;
      $all('[data-clue]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const ck = btn.getAttribute('data-clue');
          const reaction = c.reactions[ck] || c.reactions.default;
          state.case6.dialogueLog[key].push({ q:'Menunjukkan bukti: '+clueDB6[ck].tag, a:reaction });
          draw();
        });
      });
      $('#cancelEv6').addEventListener('click', draw);
    }
    draw();
  }

  function renderAccusation6(){
    const opts = Object.keys(charDB6).map(k=>{
      const c = charDB6[k];
      return `<button class="suspect-btn" data-suspect="${k}"><svg class="avatar-icon small"><use href="#${c.avatar}"></use></svg><span>${c.name} — ${c.role}</span></button>`;
    }).join('');
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Keputusan Akhir</span>
        <h1>Siapa yang Berbohong?</h1>
        <p>Semua orang punya alibi yang terlihat masuk akal. Tapi berdasarkan bukti dan garis waktu, siapa yang menurutmu sebenarnya berbohong?</p>
        <div class="suspects">${opts}</div>
      </div>`;
    $all('.suspect-btn', app).forEach(btn=> btn.addEventListener('click', ()=> resolveEnding6(btn.getAttribute('data-suspect'))));
  }

  function resolveEnding6(suspect){
    const cluesFound = Object.keys(state.case6.clues).length;
    const noMistakes = state.case6.waktuAttempts === 0 && state.case6.pernyataanAttempts === 0;
    let stars = 1;
    if(cluesFound >= 5) stars++;
    if(noMistakes) stars++;

    let badgeClass, badgeText, title, text, caseSolved = false;
    if(suspect === 'nita' && cluesFound >= 5){
      badgeClass='ending-true'; badgeText='TRUE ENDING'; title='Kasus Terpecahkan';
      text = 'Kamu benar. Nita bilang dia langsung ke perpustakaan setelah membeli minum di kantin — tapi namanya tidak pernah tercatat masuk perpustakaan, sementara seorang siswa melihatnya di depan Ruang OSIS sekitar jam 13.20. Kebohongannya kecil, hanya soal satu tempat yang "terlewat" diceritakan, tapi cukup untuk membongkar semuanya. Nita akhirnya mengaku. Namun sebelum pergi, dia meninggalkan secarik pesan: "Kamu sudah semakin dekat." Di bawahnya, tertulis simbol misterius yang sama persis dengan yang kamu temukan di perpustakaan.';
      state.case6.caseStatus = 'done'; caseSolved = true;
    } else if(suspect === 'nita' && cluesFound < 5){
      badgeClass='ending-incomplete'; badgeText='INCOMPLETE ENDING'; title='Tuduhan Benar, Bukti Kurang';
      text = 'Kamu menuduh orang yang tepat — Nita memang yang berbohong. Tapi tanpa semua bukti terkumpul, kesimpulanmu belum benar-benar meyakinkan semua orang.';
      stars = Math.min(stars,2);
      state.case6.caseStatus = 'done';
    } else {
      badgeClass='ending-wrong'; badgeText='WRONG ENDING'; title='Tersangka yang Salah';
      const wrongTexts = {
        vino:'Vino memang mengaku di kantin, dan tidak ada satu pun bukti yang benar-benar bertentangan dengan ceritanya.',
        dea:'Dea justru satu-satunya yang alibinya terkonfirmasi langsung oleh catatan resmi perpustakaan — dia bukan orang yang kamu cari.',
        aldi:'Alibi Aldi di lapangan memang belum terbukti sepenuhnya, tapi "belum terbukti" bukan berarti dia berbohong.'
      };
      text = (wrongTexts[suspect]||'') + ' Kembali periksa Buku Catatan dan bandingkan lagi garis waktu dengan pernyataan keempat orang ini.';
      stars = 0;
      state.case6.caseStatus = state.case6.caseStatus === 'done' ? 'done' : 'progress';
    }
    saveProgress();

    app.innerHTML = `
      <div class="card">
        <span class="ending-badge ${badgeClass}">${badgeText}</span>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p style="font-size:12px;">Bintang didapat dari: menuduh dengan tepat, mengumpulkan semua bukti, dan tidak salah di puzzle garis waktu maupun pernyataan.</p>
        <div class="btn-row">
          <button class="btn" id="guessAgain6">Tebak Lagi</button>
          <button class="btn secondary" id="backHub6b">Kembali ke Kasus 6</button>
        </div>
        ${caseSolved ? '<div class="btn-row"><button class="btn" id="toCaselist6">Lihat Daftar Kasus →</button></div>' : ''}
      </div>`;
    $('#guessAgain6').addEventListener('click', ()=> goTo('accusation6'));
    $('#backHub6b').addEventListener('click', ()=> goTo('casehub6',{id:'case6'}));
    const nl = $('#toCaselist6'); if(nl) nl.addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- KASUS 7 (FINAL) ---------- */
  function renderCasehub7(){
    const pct = caseProgressPct7();
    const abcDone = ['A','B','C'].every(k=> state.case7.clues[k]);
    const ready = state.case7.analisisSolved;
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">⭐ Kasus Terakhir</span>
        <h1>Kasus 07: Misteri Terakhir</h1>
        <p>Buku catatanmu otomatis terbuka, menampilkan enam kasus yang pernah kamu selidiki — dan satu kesamaan yang selalu muncul di setiap kasus: <strong>simbol misterius</strong>. Sekarang saatnya menemukan jawaban terakhir.</p>
        <p style="font-size:12px;">Progress: ${pct}% &nbsp;•&nbsp; Bukti: ${Object.keys(state.case7.clues).length}/4</p>
        <div class="menu-grid">
          <div class="menu-item" data-nav="location7"><span>🕵️ Ruang Rahasia</span><span class="arrow">→</span></div>
          <div class="menu-item" data-nav="notebook"><span>📓 Buku Catatan</span><span class="arrow">→</span></div>
          ${ready ? '<div class="menu-item" data-nav="ending7" style="--item-color:linear-gradient(135deg,#e8b84b,#c99a35);"><span>🏆 Akhir Permainan</span><span class="arrow">→</span></div>' : ''}
        </div>
        ${!abcDone ? '<p style="font-size:11px; opacity:0.7;">Periksa Foto, Catatan, dan Berkas Lama di Ruang Rahasia terlebih dulu.</p>' : ''}
      </div>`;
    $all('[data-nav]', app).forEach(el=> el.addEventListener('click', ()=> goTo(el.getAttribute('data-nav'))));
  }

  function renderLocation7(){
    function isLocked(o){
      if(o.gate === 'ABC') return !['A','B','C'].every(k=> state.case7.clues[k]);
      if(o.gate === 'besarSolved') return !state.case7.besarSolved;
      if(o.gate === 'choiceMade') return !state.case7.choiceMade;
      return false;
    }
    const objHtml = objects7.map(o=>{
      let done = false;
      if(o.clue) done = !!state.case7.clues[o.clue];
      const locked = isLocked(o);
      if(o.gate === 'ABC' && !locked) done = state.case7.besarSolved;
      if(o.gate === 'besarSolved' && !locked) done = !!state.case7.choiceMade;
      if(o.gate === 'choiceMade' && !locked) done = state.case7.analisisSolved;
      return `<div class="hotspot-chip ${done?'done':''}" data-obj="${o.id}" style="${locked?'opacity:0.55;':''}">🔍 <span>${o.label.replace(/^\S+\s/,'')}${locked?' 🔒':''}</span></div>`;
    }).join('');
    const locTabs = [
      {icon:'🕵️', name:'Ruang Rahasia', active:true},
      {icon:'🏫', name:'Ruang OSIS', active:false},
      {icon:'📖', name:'Kelas 2B', active:false},
      {icon:'💬', name:'Grup Chat', active:false},
      {icon:'🧪', name:'Lab Komputer', active:false},
      {icon:'📚', name:'Perpustakaan', active:false},
    ].map(l=> `<div class="loc-tab ${l.active?'active':'locked'}"><span class="lt-icon">${l.icon}</span>${l.name}${l.active?'':' 🔒'}</div>`).join('');

    app.innerHTML = `
      <div class="scene-layout">
        <div class="scene-sidebar">
          <div class="side-box">
            <h3>Tujuan Kasus</h3>
            <p style="font-size:12px; margin:0;">Gabungkan semua informasi dari Kasus 1–6 untuk mengungkap identitas di balik simbol misterius.</p>
          </div>
          <div class="side-box">
            <h3>Petunjuk Utama</h3>
            <ul>
              <li>Nomor Kasus = 06</li>
              <li>Kode CCTV (Kasus 1) = 32</li>
              <li>Kode Perpustakaan (Kasus 5) = 23</li>
            </ul>
          </div>
          <div class="side-box tip">
            <h3>💡 Tips</h3>
            <p style="font-size:12px; margin:0;">Periksa Foto dan Catatan dulu — semua angka yang kamu butuhkan sudah dirangkum di sana.</p>
          </div>
        </div>
        <div class="stage">
          <div class="stage-window"></div>
          <div class="stage-title">🕵️ RUANG RAHASIA</div>
          <div class="hotspot-grid" style="margin-top:8px;">${objHtml}</div>
          <div class="loc-tabs">${locTabs}</div>
        </div>
      </div>`;

    $all('.hotspot-chip', app).forEach(el=>{
      el.addEventListener('click', ()=>{
        const obj = objects7.find(o=> o.id === el.getAttribute('data-obj'));
        if(isLocked(obj)){
          const msgs = {
            ABC:'Periksa dulu Foto, Catatan, dan Berkas Lama sebelum mencoba puzzle terakhir.',
            besarSolved:'Selesaikan dulu Puzzle Terakhir sebelum membuat pilihan.',
            choiceMade:'Buat dulu pilihanmu di atas sebelum menjawab pertanyaan analisis.'
          };
          goTo('object7', { objId:'__locked__', msg: msgs[obj.gate] });
          return;
        }
        if(obj.nav){ goTo(obj.nav); return; }
        goTo('object7', { objId: obj.id });
      });
    });
  }

  function renderObject7(params){
    if(params.objId === '__locked__'){
      app.innerHTML = `<div class="card"><span class="eyebrow">Belum Bisa Diperiksa</span><h1>Masih Terkunci</h1><p>${params.msg}</p></div>`;
      return;
    }
    const obj = objects7.find(o=> o.id === params.objId);
    if(obj.flavor){
      app.innerHTML = `<div class="card"><span class="eyebrow">Pemeriksaan</span><h1>${obj.label.replace(/^\S+\s/,'')}</h1><p>${obj.flavor}</p></div>`;
      return;
    }
    const key = obj.clue;
    if(!state.case7.clues[key]){
      state.case7.clues[key] = true;
      saveProgress();
    }
    const c = clueDB7[key];
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Bukti Ditemukan</span>
        <h1>${c.tag}</h1>
        <div class="clue-popup show">
          <span class="tag">Dicatat di Buku Catatan</span>
          <p style="margin:0;">${c.text}</p>
        </div>
      </div>`;
  }

  function renderPuzzleBesar7(){
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Puzzle Terakhir</span>
        <h1>Gabungkan Semua Kode</h1>
        <p>Gunakan semua informasi dari Kasus 1–6 yang sudah kamu kumpulkan:</p>
        <div class="puzzle-box">
          <p style="margin:0 0 10px; font-family:'Baloo 2',sans-serif; font-weight:700; line-height:1.9;">
            Nomor Piala &nbsp;→ 204<br>
            Kode CCTV &nbsp;&nbsp;&nbsp;&nbsp;→ 32<br>
            Kode Perpustakaan → 23<br>
            Simbol Lab &nbsp;&nbsp;&nbsp;&nbsp;→ 102 <span style="font-size:11px; font-weight:400; opacity:0.7;">(ingat pola angka di Kasus 4)</span><br>
            Nomor Kasus &nbsp;→ 06
          </p>
          <p style="margin:0 0 6px; font-size:13px;">Jumlahkan semua angka itu untuk menemukan kode terakhir.</p>
          <input type="number" id="besarInput" placeholder="?">
          <button class="btn" id="submitBesar" style="margin-left:8px;">Buka Berkas</button>
          <div class="puzzle-msg" id="besarMsg"></div>
        </div>
      </div>`;
    $('#submitBesar').addEventListener('click', ()=>{
      const val = parseInt($('#besarInput').value, 10);
      const msg = $('#besarMsg');
      if(val === 367){
        state.case7.besarSolved = true;
        state.case7.clues.D = true;
        saveProgress();
        msg.textContent = 'Klik. Berkas rahasia terbuka.';
        msg.className = 'puzzle-msg right';
        setTimeout(goBack, 700);
      } else {
        state.case7.besarAttempts++;
        state.case7.hearts = Math.max(0, state.case7.hearts-1);
        updateChrome();
        msg.textContent = 'Bukan itu. Coba jumlahkan lagi kelima angka di atas satu per satu.';
        msg.className = 'puzzle-msg wrong';
      }
    });
  }

  function renderPilihan7(){
    if(!state.case7.besarSolved){
      app.innerHTML = `<div class="card"><span class="eyebrow">Belum Saatnya</span><h1>Selesaikan Puzzle Terakhir Dulu</h1><p>Kembali ke Ruang Rahasia dan buka berkas rahasianya terlebih dahulu.</p><div class="btn-row"><button class="btn secondary" id="backP7">← Kembali</button></div></div>`;
      $('#backP7').addEventListener('click', goBack);
      return;
    }
    app.innerHTML = `
      <div class="card">
        <span class="eyebrow">Pilihan Terakhir</span>
        <h1>Apa yang Sebenarnya Terjadi?</h1>
        <p>Berkas rahasia terbuka. Kejadian-kejadian sebelumnya ternyata bukan sepenuhnya kebetulan. Berdasarkan semua bukti yang kamu kumpulkan sepanjang enam kasus, menurutmu mana yang benar?</p>
        <div class="suspects">
          <button class="suspect-btn" data-c="A"><span>A. Semua kejadian dilakukan oleh satu orang yang sama.</span></button>
          <button class="suspect-btn" data-c="B"><span>B. Setiap kejadian dilakukan oleh orang berbeda, tapi seseorang sengaja menghubungkan semuanya lewat simbol yang sama.</span></button>
        </div>
        <div class="puzzle-msg" id="pilihMsg"></div>
      </div>`;
    $all('[data-c]', app).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const val = btn.getAttribute('data-c');
        const msg = $('#pilihMsg');
        if(val === 'B'){
          state.case7.choiceMade = 'B';
          saveProgress();
          msg.textContent = 'Benar. Ingat lagi: Raka, Dita, Reno, Yoga, dan Nita — semuanya orang yang berbeda, dengan motif berbeda-beda.';
          msg.className = 'puzzle-msg right';
          setTimeout(goBack, 900);
        } else {
          state.case7.choiceAttempts++;
          state.case7.hearts = Math.max(0, state.case7.hearts-1);
          updateChrome();
          msg.textContent = 'Coba pikirkan lagi — ingat, pelaku di tiap kasus sebelumnya selalu berbeda orang.';
          msg.className = 'puzzle-msg wrong';
        }
      });
    });
  }

  function renderPuzzleAnalisis7(){
    if(!state.case7.choiceMade){
      app.innerHTML = `<div class="card"><span class="eyebrow">Belum Saatnya</span><h1>Buat Pilihanmu Dulu</h1><p>Kembali ke Ruang Rahasia dan buat pilihan terakhirmu terlebih dahulu.</p><div class="btn-row"><button class="btn secondary" id="backA7">← Kembali</button></div></div>`;
      $('#backA7').addEventListener('click', goBack);
      return;
    }
    const questions = [
      { text:'Siapa yang pertama kali meninggalkan petunjuk?', options:['Alex dari Kasus 1','Sosok yang belum pernah kamu temui secara langsung','Wali kelasmu sendiri'], answer:1 },
      { text:'Mengapa simbol itu muncul di setiap kasus?', options:['Kebetulan semata','Sebagai jejak yang sengaja ditinggalkan untuk diikuti','Kesalahan cetak dari sekolah'], answer:1 },
      { text:'Apa hubungan antara keenam kasus?', options:['Semuanya dilakukan satu orang yang sama','Pelakunya berbeda-beda, tapi sengaja dihubungkan lewat simbol yang sama','Tidak ada hubungan sama sekali'], answer:1 },
      { text:'Apa tujuan sebenarnya dari rangkaian misteri ini?', options:['Membuat masalah besar di sekolah','Menguji dan melatih calon detektif sekolah','Balas dendam pada guru'], answer:1 },
    ];
    let idx = 0;
    function draw(){
      if(idx >= questions.length){
        state.case7.analisisSolved = true;
        saveProgress();
        app.innerHTML = `
          <div class="card">
            <span class="eyebrow">Analisis Selesai</span>
            <h1>Semua Terjawab</h1>
            <p>Kamu berhasil menyimpulkan semuanya. Saatnya kembali ke Kasus 7 untuk melihat akhir permainan.</p>
            <div class="btn-row"><button class="btn secondary" id="backObj7">← Kembali</button></div>
          </div>`;
        $('#backObj7').addEventListener('click', goBack);
        return;
      }
      const q = questions[idx];
      const opts = q.options.map((o,i)=> `<button class="topic-btn" data-i="${i}">${o}</button>`).join('');
      app.innerHTML = `
        <div class="card">
          <span class="eyebrow">Pertanyaan ${idx+1} dari ${questions.length}</span>
          <h1>${q.text}</h1>
          <div class="topic-row">${opts}</div>
          <div class="puzzle-msg" id="aMsg"></div>
        </div>`;
      $all('[data-i]', app).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const msg = $('#aMsg');
          if(parseInt(btn.getAttribute('data-i'),10) === q.answer){
            msg.textContent = 'Tepat.';
            msg.className = 'puzzle-msg right';
            idx++;
            setTimeout(draw, 500);
          } else {
            state.case7.analisisAttempts++;
            state.case7.hearts = Math.max(0, state.case7.hearts-1);
            updateChrome();
            msg.textContent = 'Belum tepat. Coba renungkan lagi semua yang sudah kamu temukan.';
            msg.className = 'puzzle-msg wrong';
          }
        });
      });
    }
    draw();
  }

  function renderEnding7(){
    state.case7.caseStatus = 'done';
    saveProgress();
    const all = allClueDB(); const collectedAll = allCluesState();
    const totalClues = Object.keys(all).length;
    const foundClues = Object.keys(collectedAll).filter(k=> collectedAll[k]).length;
    app.innerHTML = `
      <div class="card" style="text-align:center;">
        <span class="ending-badge" style="background:linear-gradient(135deg, var(--gold), var(--gold-soft)); color:#332204;">🎉 SELAMAT!</span>
        <h1>Semua Kasus Terpecahkan</h1>
        <p>Kamu bukan hanya menemukan jawaban di tiap kasus... kamu menemukan hubungan di balik semua misteri.</p>
        <div class="menu-grid" style="text-align:left;">
          <div class="menu-item" style="cursor:default;"><span class="m-icon">🏆</span><span class="m-text">7/7 KASUS<span class="m-sub">Semua kasus diselesaikan</span></span></div>
          <div class="menu-item" style="cursor:default;"><span class="m-icon">🔎</span><span class="m-text">${foundClues}/${totalClues} PETUNJUK<span class="m-sub">Total bukti ditemukan sepanjang permainan</span></span></div>
          <div class="menu-item" style="cursor:default;"><span class="m-icon">🧩</span><span class="m-text">SEMUA TEKA-TEKI SELESAI<span class="m-sub">Termasuk puzzle besar terakhir</span></span></div>
          <div class="menu-item" style="cursor:default;"><span class="m-icon">📓</span><span class="m-text">BUKU CATATAN LENGKAP<span class="m-sub">Bisa dibuka kapan saja dari Menu Utama</span></span></div>
        </div>
        <h2 style="margin-top:22px;">🕵️ DETEKTIF SEKOLAH</h2>
        <p style="font-size:12px; opacity:0.75;">Selamat, kamu telah menamatkan Mystery School.</p>
        <div class="btn-row" style="justify-content:center;">
          <button class="btn secondary" id="backHub7c">Kembali ke Kasus 7</button>
          <button class="btn" id="toCaselist7">Lihat Daftar Kasus</button>
        </div>
      </div>`;
    $('#backHub7c').addEventListener('click', ()=> goTo('casehub7',{id:'case7'}));
    $('#toCaselist7').addEventListener('click', ()=> goTo('caselist'));
  }

  /* ---------- ROUTER ---------- */
  function render(){
    document.body.classList.toggle('home-page', current.screen === 'menu');
    updateChrome();
    switch(current.screen){
      case 'menu': renderMenu(); break;
      case 'continue': renderContinue(); break;
      case 'caselist': renderCaselist(); break;
      case 'casehub': renderCasehub(); break;
      case 'location': renderLocation(); break;
      case 'object': renderObject(current.params); break;
      case 'puzzle': renderPuzzle(); break;
      case 'characterlist': renderCharacterlist(); break;
      case 'dialogue': renderDialogue(current.params); break;
      case 'notebook': renderNotebook(); break;
      case 'evidence': renderEvidence(); break;
      case 'board': renderBoard(); break;
      case 'settings': renderSettings(); break;
      case 'accusation': renderAccusation(); break;
      case 'casehub2': renderCasehub2(); break;
      case 'location2': renderLocation2(); break;
      case 'object2': renderObject2(current.params); break;
      case 'puzzle-kotak': renderPuzzleKotak(); break;
      case 'puzzle-jadwal': renderPuzzleJadwal(); break;
      case 'characterlist2': renderCharacterlist2(); break;
      case 'dialogue2': renderDialogue2(current.params); break;
      case 'accusation2': renderAccusation2(); break;
      case 'casehub3': renderCasehub3(); break;
      case 'location3': renderLocation3(current.params); break;
      case 'object3': renderObject3(current.params); break;
      case 'puzzle-sandi': renderPuzzleSandi(); break;
      case 'characterlist3': renderCharacterlist3(); break;
      case 'dialogue3': renderDialogue3(current.params); break;
      case 'accusation3': renderAccusation3(); break;
      case 'casehub4': renderCasehub4(); break;
      case 'location4': renderLocation4(); break;
      case 'object4': renderObject4(current.params); break;
      case 'puzzle-data': renderPuzzleData(); break;
      case 'characterlist4': renderCharacterlist4(); break;
      case 'dialogue4': renderDialogue4(current.params); break;
      case 'accusation4': renderAccusation4(); break;
      case 'casehub5': renderCasehub5(); break;
      case 'location5': renderLocation5(); break;
      case 'object5': renderObject5(current.params); break;
      case 'puzzle-rak': renderPuzzleRak(); break;
      case 'puzzle-simbol': renderPuzzleSimbol(); break;
      case 'hubungan5': renderHubungan5(); break;
      case 'ending5': renderEnding5(); break;
      case 'casehub6': renderCasehub6(); break;
      case 'location6': renderLocation6(); break;
      case 'object6': renderObject6(current.params); break;
      case 'puzzle-waktu6': renderPuzzleWaktu6(); break;
      case 'puzzle-pernyataan6': renderPuzzlePernyataan6(); break;
      case 'characterlist6': renderCharacterlist6(); break;
      case 'dialogue6': renderDialogue6(current.params); break;
      case 'accusation6': renderAccusation6(); break;
      case 'casehub7': renderCasehub7(); break;
      case 'location7': renderLocation7(); break;
      case 'object7': renderObject7(current.params); break;
      case 'puzzle-besar7': renderPuzzleBesar7(); break;
      case 'pilihan7': renderPilihan7(); break;
      case 'puzzle-analisis7': renderPuzzleAnalisis7(); break;
      case 'ending7': renderEnding7(); break;
      default: renderMenu();
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ---------- CHROME BUTTONS ---------- */
  $('#btnBack').addEventListener('click', goBack);
  $('#btnNotebook').addEventListener('click', ()=> goTo('notebook'));
  $('#btnEvidence').addEventListener('click', ()=> goTo('evidence'));
  $('#btnBoard').addEventListener('click', ()=> goTo('board'));
  $('#btnExitCase').addEventListener('click', ()=>{
    $('#modalBox').innerHTML = `
      <h2>Keluar dari penyelidikan?</h2>
      <p>Progress kamu sudah tersimpan.</p>
      <div class="btn-row">
        <button class="btn secondary" id="stayBtn">Tetap Bermain</button>
        <button class="btn" id="exitBtn">Keluar</button>
      </div>`;
    $('#modalBackdrop').classList.add('show');
    $('#stayBtn').addEventListener('click', ()=> $('#modalBackdrop').classList.remove('show'));
    $('#exitBtn').addEventListener('click', ()=>{ $('#modalBackdrop').classList.remove('show'); resetToMenu(); });
  });

  /* ---------- INIT ---------- */
  (async function init(){
    await loadProgress();
    render();
  })();
})();
