const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let kind = "Murid";
let role = "anggota";
let username = "Anggota";
let page = "dashboard";

const perms = {
  sekretaris:["pengumuman","tugas","denah","absensi","jadwal","pakaian"],
  bendahara:["tagihan"],
  ketua:["*"],
  anggota:[],
  guru:["*"]
};

const passwords = {
  sekretaris:"PWSS",
  bendahara:"KASX",
  ketua:"KETUAX",
  guru:"SSSG"
};

const data = {

  announcements:[
    {
      title:"Persiapan kelas",
      desc:"Jaga kebersihan dan kerapian kelas.",
      date:"Hari ini"
    }
  ],

  tasks:[
    {
      title:"Matematika — Inversi Fungsi",
      desc:"Pelajari materi dan selesaikan latihan.",
      due:"Besok"
    },
    {
      title:"Kimia — Laporan Praktikum",
      desc:"Kumpulkan laporan praktikum.",
      due:"2 hari"
    }
  ],

  bills:[
    {
      name:"Kas kelas",
      amount:10000,
      person:"Semua anggota",
      paid:false
    }
  ],

  attendance:[],

  seats:Array(15).fill(""),

  songs:[
    "Lagu Kenangan Kelas",
    "Semangat Pagi",
    "Lagu Favorit XI-G"
  ],

  profiles:[
    {
      name:"Najib",
      role:"Anggota",
      quote:"Satu kelas, banyak cerita."
    }
  ],

  gallery:[],

  schedule:[
    ["07.30–08.00","Matematika"],
    ["08.00–10.00","Bahasa Indonesia"],
    ["10.45–12.15","Kimia"],
    ["13.00–14.30","Sejarah"]
  ]

};


const labels = {
  dashboard:"Dashboard",
  denah:"Denah Kelas",
  pengumuman:"Pengumuman",
  absensi:"Absensi",
  tugas:"Tugas",
  tagihan:"Tagihan",
  anggota:"Profil Anggota",
  gallery:"Gallery XI-G",
  playlist:"Playlist Kelas",
  saluran:"Sosmed & Saluran",
  jadwal:"Jadwal Pelajaran",
  pakaian:"Jadwal Pakaian"
};


/* =========================
   LOGIN
========================= */

$$(".role-btn").forEach(button => {

  button.onclick = () => {

    kind = button.dataset.kind;

    $$(".role-btn").forEach(item => {
      item.classList.toggle(
        "active",
        item === button
      );
    });

    $("#loginRole").innerHTML =
      kind === "Guru"
        ? '<option value="guru">Guru</option>'
        :
          '<option value="anggota">Anggota</option>' +
          '<option value="sekretaris">Sekretaris</option>' +
          '<option value="bendahara">Bendahara</option>' +
          '<option value="ketua">Ketua</option>';

    const nameField = $("#username");

    if(nameField){

      nameField.value = "";

      const nameLabel =
        nameField.closest("label");

      if(nameLabel){
        nameLabel.style.display = "none";
      }
    }

    $("#password").value = "";

    $("#password").required =
      kind === "Guru" ||
      $("#loginRole").value !== "anggota";

    $("#loginRole").onchange = () => {

      $("#password").required =
        kind === "Guru" ||
        $("#loginRole").value !== "anggota";

      $("#password").value = "";

      msg("");
    };

    msg("");
  };

});


$("#loginBtn").onclick = () => {

  role = $("#loginRole").value;

  const pw = $("#password").value;

  if(kind === "Murid" && role === "anggota"){

    username = "Anggota";

  }else{

    if(!pw){
      return msg(
        "Masukkan kata sandi terlebih dahulu."
      );
    }

    if(pw !== passwords[role]){
      return msg(
        "Kata sandi tidak sesuai."
      );
    }

    username =
      kind === "Guru"
        ? "Guru"
        : role.charAt(0).toUpperCase() +
          role.slice(1);
  }

  $("#loginScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");

  $("#userLabel").textContent =
    username;

  $("#roleLabel").textContent =
    kind === "Guru"
      ? "Guru"
      : role.charAt(0).toUpperCase() +
        role.slice(1);

  render();
};


function msg(text){
  $("#loginMsg").textContent = text;
}


/* =========================
   LOGOUT
========================= */

$("#logoutBtn").onclick = () => {

  $("#app").classList.add("hidden");
  $("#loginScreen").classList.remove("hidden");

  $("#password").value = "";

  $(".sidebar")?.classList.remove("open");

};


/* =========================
   MOBILE MENU
========================= */

$("#menuBtn").onclick = () => {

  $(".sidebar").classList.toggle("open");

};


/* =========================
   NAVIGATION
========================= */

$("#nav").onclick = event => {

  const button =
    event.target.closest("[data-page]");

  if(!button) return;

  page = button.dataset.page;

  $$(".nav-item").forEach(item => {

    item.classList.toggle(
      "active",
      item === button
    );

  });

  $(".sidebar").classList.remove("open");

  render();

};


/* =========================
   PERMISSION
========================= */

function canEdit(target){

  const allowed =
    perms[role] || [];

  return (
    allowed.includes("*") ||
    allowed.includes(target)
  );
}


/* =========================
   BUTTON
========================= */

function btn(
  text,
  action,
  cls = "muted-btn"
){

  return `
    <button
      class="${cls}"
      onclick="${action}">
      ${text}
    </button>
  `;
}


/* =========================
   FORM
========================= */

function addForm(
  title,
  fields,
  fn
){

  return `
    <div class="panel">

      <h2>${title}</h2>

      <form onsubmit="${fn};return false">

        <div class="form-row">
          ${fields}
        </div>

        <button
          class="primary"
          style="margin-top:12px">
          Tambah
        </button>

      </form>

    </div>
  `;
}


/* =========================
   RENDER
========================= */

function render(){

  const content =
    $("#pageContent");

  const pages = {

    dashboard,
    denah,
    pengumuman:announcements,
    absensi:attendance,
    tugas:tasks,
    tagihan:bills,
    anggota:members,
    playlist,
    gallery,
    saluran:channels,
    jadwal:schedule,
    pakaian:clothes

  };

  const pageFunction =
    pages[page] || dashboard;

  content.innerHTML = `

    <div class="section-head">

      <h1>
        ${labels[page]}
      </h1>

      <span class="tag">
        ${
          kind === "Guru"
            ? "Akses Guru"
            : role
        }
      </span>

    </div>

    ${pageFunction()}

  `;

}


/* =========================
   DASHBOARD
========================= */

function dashboard(){

  return `

    <section class="dashboard-hero">

      <div>

        <p>MAN 4 BANJAR · XI-G</p>

        <h2>
          Our Class XI-G
        </h2>

        <p>
          Satu kelas, banyak cerita.
        </p>

      </div>

    </section>


    <div class="quick-grid">

      ${quickCard(
        "◉",
        "Pengumuman",
        "Lihat informasi kelas",
        "pengumuman"
      )}

      ${quickCard(
        "▤",
        "Tugas",
        "Tugas dan tenggat",
        "tugas"
      )}

      ${quickCard(
        "✓",
        "Absensi",
        "Catatan kehadiran",
        "absensi"
      )}

      ${quickCard(
        "Rp",
        "Tagihan",
        "Kas dan pembayaran",
        "tagihan"
      )}

      ${quickCard(
        "▣",
        "Jadwal",
        "Jadwal pelajaran",
        "jadwal"
      )}

      ${quickCard(
        "▧",
        "Gallery",
        "Kenangan XI-G",
        "gallery"
      )}

      ${quickCard(
        "♫",
        "Playlist",
        "Lagu pilihan kelas",
        "playlist"
      )}

      ${quickCard(
        "♙",
        "Anggota",
        "Profil anggota",
        "anggota"
      )}

    </div>


    <div class="stats-grid">

      <div class="stat-card">
        <strong>30</strong>
        <span>Anggota kelas</span>
      </div>

      <div class="stat-card">
        <strong>${data.tasks.length}</strong>
        <span>Tugas aktif</span>
      </div>

      <div class="stat-card">
        <strong>${data.announcements.length}</strong>
        <span>Pengumuman</span>
      </div>

    </div>


    <div class="panel">

      <h2>Aktivitas Kelas</h2>

      <div class="list-row">
        <b>Pengumuman kelas</b>
        <small>
          ${data.announcements.length} informasi
        </small>
      </div>

      <div class="list-row">
        <b>Tugas</b>
        <small>
          ${data.tasks.length} tugas aktif
        </small>
      </div>

      <div class="list-row">
        <b>Absensi</b>
        <small>
          ${data.attendance.length} catatan
        </small>
      </div>

    </div>


    <div class="panel">

      <h2>💭 Catatan Kelas</h2>

      <p class="muted">
        Jaga kebersihan, kekompakan,
        dan suasana belajar yang nyaman.
      </p>

    </div>

  `;
}


function quickCard(
  icon,
  title,
  desc,
  target
){

  return `

    <button
      class="quick-card"
      onclick="openDashboardPage('${target}')">

      <b>${icon} ${title}</b>

      <span>${desc}</span>

    </button>

  `;
}


function openDashboardPage(target){

  page = target;

  $$(".nav-item").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.page === target
    );

  });

  $(".sidebar")?.classList.remove("open");

  render();

}


/* =========================
   DENAH
========================= */

function denah(){

  return `

    <p class="muted">
      Isi nama siswa pada setiap meja.
      Perubahan tersimpan sementara selama
      halaman terbuka.
    </p>

    <div class="teacher-seat">
      Meja Guru
    </div>

    <div class="desk-grid">

      ${data.seats.map((name,index) => `

        <div class="desk">

          <small>
            Meja ${index + 1}
          </small>

          <input
            aria-label="Nama meja ${index + 1}"
            value="${escapeHTML(name)}"
            placeholder="Nama siswa"
            onchange="data.seats[${index}]=this.value">

        </div>

      `).join("")}

    </div>

    <p>

      ${btn(
        "Kosongkan denah",
        "data.seats.fill('');render()"
      )}

    </p>

  `;
}


/* =========================
   PENGUMUMAN
========================= */

function announcements(){

  return `

    ${
      canEdit("pengumuman")
        ?
        addForm(
          "Tambah pengumuman",

          `
            <label>
              Judul
              <input
                id="aTitle"
                required>
            </label>

            <label>
              Isi
              <input
                id="aDesc"
                required>
            </label>
          `,

          "addAnnouncement()"
        )
        :
        ""
    }


    <div class="cards">

      ${
        data.announcements.length
          ?

        data.announcements.map(
          (item,index) => `

            <article class="item-card">

              <span class="tag">
                ${escapeHTML(item.date)}
              </span>

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <p>
                ${escapeHTML(item.desc)}
              </p>

              ${
                canEdit("pengumuman")
                  ?
                  btn(
                    "Hapus",
                    `data.announcements.splice(${index},1);render()`,
                    "action danger"
                  )
                  :
                  ""
              }

            </article>

          `
        ).join("")

        :

        `<div class="panel">
          <div class="empty">
            Belum ada pengumuman.
          </div>
        </div>`

      }

    </div>

  `;
}


function addAnnouncement(){

  data.announcements.unshift({

    title:$("#aTitle").value,

    desc:$("#aDesc").value,

    date:"Baru"

  });

  render();

}


/* =========================
   ABSENSI
========================= */

function attendance(){

  return `

    <div class="panel">

      <h2>Catat kehadiran</h2>

      <form onsubmit="
        saveAttendance();
        return false
      ">

        <div class="form-row">

          <label>
            Nama siswa

            <input
              id="attName"
              required
              placeholder="Nama lengkap">

          </label>

          <label>
            Status

            <select id="attStatus">

              <option>Hadir</option>
              <option>Izin</option>
              <option>Sakit</option>
              <option>Alpa</option>

            </select>

          </label>

        </div>

        <button class="primary">
          Simpan absensi
        </button>

      </form>

    </div>


    <div
      class="panel"
      style="margin-top:15px">

      <h2>Riwayat absensi</h2>

      ${
        data.attendance.length

        ?

        data.attendance.map(item => `

          <div class="list-row">

            <b>
              ${escapeHTML(item.name)}
            </b>

            <small>
              ${escapeHTML(item.status)}
              ·
              ${escapeHTML(item.date)}
            </small>

          </div>

        `).join("")

        :

        `
          <div class="empty">
            Belum ada absensi yang dicatat.
          </div>
        `
      }

    </div>

  `;
}


function saveAttendance(){

  data.attendance.unshift({

    name:$("#attName").value,

    status:$("#attStatus").value,

    date:new Date()
      .toLocaleDateString("id-ID")

  });

  render();

}


/* =========================
   TUGAS
========================= */

function tasks(){

  return `

    ${
      canEdit("tugas")
        ?
        addForm(
          "Tambah tugas",

          `
            <label>
              Nama tugas

              <input
                id="tTitle"
                required>
            </label>

            <label>
              Tenggat

              <input
                id="tDue"
                placeholder="Contoh: Jumat"
                required>
            </label>
          `,

          "addTask()"
        )
        :
        ""
    }


    <div class="cards">

      ${
        data.tasks.length

        ?

        data.tasks.map(
          (item,index) => `

            <article class="item-card">

              <span class="tag">
                ${escapeHTML(item.due)}
              </span>

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <p>
                ${escapeHTML(item.desc)}
              </p>

              ${
                canEdit("tugas")
                  ?
                  btn(
                    "Selesai / hapus",
                    `data.tasks.splice(${index},1);render()`,
                    "action"
                  )
                  :
                  ""
              }

            </article>

          `
        ).join("")

        :

        `<div class="panel">
          <div class="empty">
            Tidak ada tugas.
          </div>
        </div>`

      }

    </div>

  `;
}


function addTask(){

  data.tasks.push({

    title:$("#tTitle").value,

    desc:"Tugas kelas",

    due:$("#tDue").value

  });

  render();

}


/* =========================
   TAGIHAN
========================= */

function bills(){

  return `

    ${
      canEdit("tagihan")

        ?

        addForm(
          "Tambah tagihan",

          `
            <label>
              Nama tagihan

              <input
                id="bName"
                required
                placeholder="Kas / buku / acara">
            </label>

            <label>
              Nominal (Rp)

              <input
                id="bAmount"
                type="number"
                min="0"
                required>
            </label>
          `,

          "addBill()"
        )

        :

        ""
    }


    <div class="panel">

      <h2>Daftar tagihan</h2>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Tagihan</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>

          </thead>

          <tbody>

            ${
              data.bills.map(
                (item,index) => `

                  <tr>

                    <td>
                      ${escapeHTML(item.name)}
                    </td>

                    <td>
                      Rp ${Number(item.amount)
                        .toLocaleString("id-ID")}
                    </td>

                    <td>

                      <span class="tag">
                        ${
                          item.paid
                            ? "Lunas"
                            : "Belum lunas"
                        }
                      </span>

                    </td>

                    <td>

                      ${
                        canEdit("tagihan")

                        ?

                        btn(
                          item.paid
                            ? "Batalkan"
                            : "Lunasi",

                          `data.bills[${index}].paid=!data.bills[${index}].paid;render()`,

                          "action"
                        )

                        +

                        " " +

                        btn(
                          "Hapus",

                          `data.bills.splice(${index},1);render()`,

                          "action danger"
                        )

                        :

                        "—"
                      }

                    </td>

                  </tr>

                `
              ).join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;
}


function addBill(){

  data.bills.push({

    name:$("#bName").value,

    amount:Number(
      $("#bAmount").value
    ),

    person:"Anggota",

    paid:false

  });

  render();

}


/* =========================
   MEMBERS
========================= */

function members(){

  return `

    <div class="profile-grid">

      ${
        data.profiles.map(item => `

          <article class="profile">

            <div class="avatar">
              ${escapeHTML(
                item.name[0].toUpperCase()
              )}
            </div>

            <h3>
              ${escapeHTML(item.name)}
            </h3>

            <p>
              ${escapeHTML(item.role)}
            </p>

            <p style="margin-top:10px">
              ${escapeHTML(item.quote)}
            </p>

          </article>

        `).join("")
      }

    </div>


    <div
      class="panel"
      style="margin-top:15px">

      <h2>Info profil</h2>

      <p class="muted">
        Profil dapat dikembangkan dengan foto,
        tanggal lahir, hobi, prestasi, akun sosial,
        kutipan, dan tautan lagu Spotify.
      </p>

    </div>

  `;
}


/* =========================
   PLAYLIST
========================= */

function playlist(){

  return `

    <div class="panel playlist-card">

      <h2>
        🎵 Playlist Kelas XI-G
      </h2>

      <div class="playlist-content">

        <img
          src="./aset/Screenshot_20261010-155852.jpg"
          alt="Logo Playlist XI-G"
          class="playlist-logo">

        <h3>
          Playlist XI-G
        </h3>

        <p>
          Kumpulan lagu pilihan untuk menemani
          hari-hari kelas XI-G.
        </p>

        <a
          class="primary playlist-link"
          href="https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link"
          target="_blank"
          rel="noopener noreferrer">

          🎧 Buka Playlist di Spotify

        </a>

      </div>

    </div>

  `;
}


function openSpotify(){

  window.open(
    "https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link",
    "_blank"
  );

}


/* =========================
   SOSMED & SALURAN
========================= */

function channels(){

  return `

    <section class="ig-profile">

      <div class="ig-cover">

        <div class="ig-cover-label">
          ✦ OUR CLASS XI-G ✦
        </div>

        <div class="ig-cover-year">
          MAN 4 BANJAR · 2026/2027
        </div>

      </div>


      <div class="ig-profile-main">

        <div class="ig-profile-top">

          <img
            src="./aset/Icon.jpg"
            alt="Foto profil XI-G"
            class="ig-avatar">


          <div class="ig-profile-info">

            <h2>
              graphene.xig
            </h2>

            <p class="ig-display-name">
              GRAPHENE · XI-G
            </p>

            <div class="ig-stats">

              <div>
                <strong>30</strong>
                <span>Minds</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Frequency</span>
              </div>

              <div>
                <strong>XI-G</strong>
                <span>Class</span>
              </div>

            </div>

          </div>

        </div>


        <div class="panel" style="margin-top:20px">

          <h2>
            Sosmed & Saluran
          </h2>

          <p class="muted">
            Temukan berbagai media dan saluran
            resmi kelas XI-G.
          </p>

          <div class="channel-list">

            <article class="channel-card">

              <h3>📸 Instagram</h3>

              <p>
                Dokumentasi dan aktivitas
                kelas XI-G.
              </p>

              <div class="channel-buttons">

                <a
                  class="primary"
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer">

                  Buka Instagram

                </a>

              </div>

            </article>


            <article class="channel-card">

              <h3>🎵 Spotify</h3>

              <p>
                Playlist lagu pilihan
                kelas XI-G.
              </p>

              <div class="channel-buttons">

                <a
                  class="primary"
                  href="https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link"
                  target="_blank"
                  rel="noopener noreferrer">

                  Buka Playlist

                </a>

              </div>

            </article>


            <article class="channel-card">

              <h3>💬 Grup Kelas</h3>

              <p>
                Saluran komunikasi dan informasi
                internal kelas.
              </p>

              <div class="channel-buttons">

                <button
                  class="muted-btn"
                  onclick="alert('Tautan grup belum ditambahkan.')">

                  Buka Grup

                </button>

              </div>

            </article>


            <article class="channel-card">

              <h3>📢 Saluran XI-G</h3>

              <p>
                Tempat berbagi pengumuman
                dan informasi kelas.
              </p>

              <div class="channel-buttons">

                <button
                  class="muted-btn"
                  onclick="alert('Tautan saluran belum ditambahkan.')">

                  Buka Saluran

                </button>

              </div>

            </article>


            <article class="channel-card">

              <h3>🖼️ Gallery XI-G</h3>

              <p>
                Kumpulan foto dan kenangan
                kelas.
              </p>

              <div class="channel-buttons">

                <button
                  class="primary"
                  onclick="openDashboardPage('gallery')">

                  Lihat Gallery

                </button>

              </div>

            </article>


            <article class="channel-card">

              <h3>📚 Website Kelas</h3>

              <p>
                Semua fitur kelas XI-G
                tersedia di sini.
              </p>

              <div class="channel-buttons">

                <button
                  class="muted-btn"
                  onclick="openDashboardPage('dashboard')">

                  Dashboard

                </button>

              </div>

            </article>

          </div>

        </div>

      </div>

    </section>

  `;
}


/* =========================
   SCHEDULE
========================= */

const scheduleDays = {

  Senin:[
    ["1","Matematika",""],
    ["2–3","Bahasa Indonesia",""],
    ["4","Kimia",""],
    ["5","Matematika Umum",""],
    ["6","Fisika",""],
    ["7–8","Bahasa Inggris",""],
    ["9","Sejarah",""]
  ],

  Selasa:[
    ["1–2","Bahasa Inggris",""],
    ["3","Akidah Akhlak",""],
    ["4–5","Kimia",""],
    ["6","Matematika",""],
    ["7–8","Bahasa Indonesia",""],
    ["9","PJOK",""]
  ],

  Rabu:[
    ["1–2","Fisika",""],
    ["3","Sejarah",""],
    ["4–5","Matematika Umum",""],
    ["6","Bahasa Indonesia",""],
    ["7–8","Kimia",""],
    ["9","Akidah Akhlak",""]
  ],

  Kamis:[
    ["1–2","Bahasa Indonesia",""],
    ["3","Matematika",""],
    ["4–5","Fisika",""],
    ["6","Kimia",""],
    ["7","Sejarah",""],
    ["8–9","Bahasa Inggris",""]
  ],

  Jumat:[
    ["1","Jumat Taqwa / Sehat",""],
    ["2–3","Pendidikan Pancasila","Siti Masriah, S.Pd."],
    ["4","Fisika","Hj. Siti Asmah Khairiyah, M.Sc."],
    ["5","Matematika Umum","Muzahir, S.Pd.I."],
    ["6–8","Istirahat Sholat Jumat",""],
    ["9","Akidah Akhlak","H. Zahrani, S.Ag."]
  ]

};


function schedule(){

  const days =
    Object.keys(scheduleDays);

  return `

    <div class="panel">

      <h2>
        Jadwal Pelajaran XI-G
      </h2>

      <p class="muted">
        Pilih hari untuk melihat jadwal.
      </p>

      <div
        class="schedule-tabs"
        id="scheduleTabs">

        ${
          days.map(
            (day,index) => `

              <button
                class="${index === 0 ? "active" : ""}"
                onclick="showScheduleDay(${index},this)">

                ${day}

              </button>

            `
          ).join("")
        }

      </div>


      <div id="scheduleDayContent">

        ${scheduleDayContent(
          days[0],
          0
        )}

      </div>

    </div>


    <div class="panel">

      <h2>
        Jadwal Asli XI-G
      </h2>

      <p class="muted">
        Ketuk gambar untuk memperbesar.
      </p>

      <img
        src="./aset/Jadwal-xig.jpg"
        alt="Jadwal Pelajaran XI-G"
        class="schedule-image"
        onclick="openScheduleImage()">

    </div>

  `;
}


function scheduleDayContent(
  day,
  index
){

  const rows =
    scheduleDays[day] || [];

  return `

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Jam</th>
            <th>Mata Pelajaran</th>
            <th>Guru</th>
          </tr>

        </thead>

        <tbody>

          ${
            rows.map(row => `

              <tr>

                <td>
                  ${escapeHTML(row[0])}
                </td>

                <td>
                  <b>
                    ${escapeHTML(row[1])}
                  </b>
                </td>

                <td>
                  ${escapeHTML(row[2] || "—")}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;
}


function showScheduleDay(
  index,
  button
){

  const days =
    Object.keys(scheduleDays);

  $$("#scheduleTabs button")
    .forEach(item => {
      item.classList.remove("active");
    });

  button.classList.add("active");

  $("#scheduleDayContent").innerHTML =
    scheduleDayContent(
      days[index],
      index
    );

}


function openScheduleImage(){

  const viewer =
    document.createElement("div");

  viewer.className =
    "schedule-viewer";

  viewer.id =
    "scheduleViewer";

  viewer.innerHTML = `

    <button
      class="schedule-close"
      onclick="closeScheduleImage()">

      ×

    </button>

    <img
      src="./aset/Jadwal-xig.jpg"
      alt="Jadwal Pelajaran XI-G">

  `;

  document.body.appendChild(viewer);

}


function closeScheduleImage(){

  $("#scheduleViewer")?.remove();

}


/* =========================
   PAKAIAN
========================= */

function clothes(){

  return `

    <div class="panel">

      <h2>
        Jadwal Pakaian
      </h2>

      <div class="list-row">
        <b>Senin</b>
        <span>Seragam sekolah</span>
      </div>

      <div class="list-row">
        <b>Selasa</b>
        <span>Seragam sekolah</span>
      </div>

      <div class="list-row">
        <b>Rabu</b>
        <span>Seragam Pramuka</span>
      </div>

      <div class="list-row">
        <b>Kamis</b>
        <span>Seragam sekolah</span>
      </div>

      <div class="list-row">
        <b>Jumat</b>
        <span>Pakaian muslim / sesuai ketentuan</span>
      </div>

    </div>

  `;
}


/* =========================
   GALLERY
========================= */

function gallery(){

  return `

    <div class="panel">

      <h2>
        Gallery XI-G
      </h2>

      <p class="muted">
        Kumpulan foto dan kenangan kelas XI-G.
      </p>

      ${
        canEdit("gallery")

        ?

        `
          <label>
            Tambahkan foto

            <input
              type="file"
              id="galleryInput"
              accept="image/*"
              multiple
              onchange="uploadGalleryPhotos()">

          </label>
        `

        :

        ""
      }

    </div>


    ${
      data.gallery.length

      ?

      `
        <div class="gallery-grid">

          ${
            data.gallery.map(
              (photo,index) => `

                <div class="gallery-photo">

                  <img
                    src="${photo.src}"
                    alt="${escapeHTML(
                      photo.name || "Foto XI-G"
                    )}"
                    onclick="viewGalleryPhoto(${index})">

                  ${
                    canEdit("gallery")
                      ?

                      btn(
                        "×",
                        `deleteGalleryPhoto(${index})`,
                        "action danger"
                      )

                      :

                      ""
                  }

                </div>

              `
            ).join("")
          }

        </div>
      `

      :

      `
        <div class="panel">

          <div class="empty">
            Belum ada foto di gallery.
          </div>

        </div>
      `

    }

  `;
}


function uploadGalleryPhotos(){

  const input =
    $("#galleryInput");

  if(!input || !input.files.length){
    return;
  }

  [...input.files].forEach(file => {

    const reader =
      new FileReader();

    reader.onload = event => {

      data.gallery.push({

        src:event.target.result,

        name:file.name

      });

      render();

    };

    reader.readAsDataURL(file);

  });

}


function viewGalleryPhoto(index){

  const photo =
    data.gallery[index];

  if(!photo) return;

  const viewer =
    document.createElement("div");

  viewer.className =
    "schedule-viewer";

  viewer.id =
    "galleryViewer";

  viewer.innerHTML = `

    <button
      class="schedule-close"
      onclick="$('#galleryViewer')?.remove()">

      ×

    </button>

    <img
      src="${photo.src}"
      alt="Gallery XI-G">

  `;

  document.body.appendChild(viewer);

}


function deleteGalleryPhoto(index){

  if(!confirm(
    "Hapus foto ini dari gallery?"
  )){
    return;
  }

  data.gallery.splice(index,1);

  render();

}


/* =========================
   SEARCH
========================= */

$("#searchInput")?.addEventListener(
  "input",
  function(){

    const query =
      this.value
        .toLowerCase()
        .trim();

    if(!query){
      render();
      return;
    }

    const content =
      $("#pageContent");

    const searchable = {

      pengumuman:
        data.announcements.map(
          x => `${x.title} ${x.desc}`
        ),

      tugas:
        data.tasks.map(
          x => `${x.title} ${x.desc}`
        ),

      anggota:
        data.profiles.map(
          x => `${x.name} ${x.role} ${x.quote}`
        )

    };

    let results = [];

    Object.entries(searchable)
      .forEach(([type,items]) => {

        items.forEach((text,index) => {

          if(
            text
              .toLowerCase()
              .includes(query)
          ){

            results.push({
              type,
              index,
              text
            });

          }

        });

      });


    content.innerHTML = `

      <div class="section-head">

        <h1>
          Hasil Pencarian
        </h1>

        <span class="tag">
          ${results.length} hasil
        </span>

      </div>


      <div class="panel">

        ${
          results.length

          ?

          results.map(result => `

            <div class="list-row">

              <b>
                ${escapeHTML(result.text)}
              </b>

              <button
                class="muted-btn"
                onclick="openDashboardPage('${result.type === "anggota" ? "anggota" : result.type}')">

                Buka

              </button>

            </div>

          `).join("")

          :

          `
            <div class="empty">
              Tidak ditemukan hasil untuk
              "${escapeHTML(query)}".
            </div>
          `
        }

      </div>

    `;

  }
);


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


/* =========================
   INITIAL STATE
========================= */

if($("#loginRole")){

  $("#loginRole").onchange = () => {

    $("#password").required =
      kind === "Guru" ||
      $("#loginRole").value !== "anggota";

    $("#password").value = "";

    msg("");

  };

}

render();