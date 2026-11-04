const $=s=>document.querySelector(s),
$$=s=>[...document.querySelectorAll(s)];

let kind="Murid", role="anggota", username="Anggota", page="dashboard";

const perms={
  sekretaris:["pengumuman","tugas","denah","absensi","jadwal","pakaian"],
  bendahara:["tagihan"],
  ketua:["*"],
  anggota:[],
  guru:["*"]
};

const data={
  announcements:[
    {title:"Persiapan kelas",desc:"Jaga kebersihan dan kerapian kelas.",date:"Hari ini"}
  ],
  tasks:[
    {title:"Matematika — Inversi Fungsi",desc:"Pelajari materi dan selesaikan latihan.",due:"Besok"},
    {title:"Kimia — Laporan Praktikum",desc:"Kumpulkan laporan praktikum.",due:"2 hari"}
  ],
  bills:[
    {name:"Kas kelas",amount:10000,person:"Semua anggota",paid:false}
  ],
  attendance:[],
  seats:Array(15).fill(""),
  songs:["Lagu Kenangan Kelas","Semangat Pagi","Lagu Favorit XI-G"],
  profiles:[
    {name:"Najib",role:"Anggota",quote:"Satu kelas, banyak cerita."}
  ],
  gallery:[],
  schedule:[
    ["07.30–08.00","Matematika"],
    ["08.00–10.00","Bahasa Indonesia"],
    ["10.45–12.15","Kimia"],
    ["13.00–14.30","Sejarah"]
  ]
};

const labels={
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

const passwords={
  sekretaris:"PWSS",
  bendahara:"KASX",
  ketua:"KETUAX",
  guru:"SSSG"
};

// Mengatur pilihan Murid dan Guru
$$(".role-btn").forEach(b=>{
  b.onclick=()=>{
    kind=b.dataset.kind;

    $$(".role-btn").forEach(x=>
      x.classList.toggle("active",x===b)
    );

    $("#loginRole").innerHTML=kind==="Guru"
      ? '<option value="guru">Guru</option>'
      : '<option value="anggota">Anggota</option>'+
        '<option value="sekretaris">Sekretaris</option>'+
        '<option value="bendahara">Bendahara</option>'+
        '<option value="ketua">Ketua</option>';

    const nameField=$("#username");
    if(nameField){
      nameField.value="";
      const nameLabel=nameField.closest("label");
      if(nameLabel) nameLabel.style.display="none";
    }

    $("#password").value="";
    $("#password").required=
      kind==="Guru" || $("#loginRole").value!=="anggota";

    $("#loginRole").onchange=()=>{
      $("#password").required=
        kind==="Guru" || $("#loginRole").value!=="anggota";
      $("#password").value="";
      msg("");
    };

    msg("");
  };
});

// Proses login
$("#loginBtn").onclick=()=>{
  role=$("#loginRole").value;
  const pw=$("#password").value;

  // Anggota tidak memerlukan nama atau password
  if(kind==="Murid" && role==="anggota"){
    username="Anggota";
  }else{
    if(!pw){
      return msg("Masukkan kata sandi terlebih dahulu.");
    }

    if(pw!==passwords[role]){
      return msg("Kata sandi tidak sesuai.");
    }

    username=kind==="Guru"
      ? "Guru"
      : role.charAt(0).toUpperCase()+role.slice(1);
  }

  $("#loginScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  $("#userLabel").textContent=username;
  $("#roleLabel").textContent=
    kind==="Guru"
      ? "Guru"
      : role.charAt(0).toUpperCase()+role.slice(1);

  render();
};

function msg(t){
  $("#loginMsg").textContent=t;
}

$("#logoutBtn").onclick=()=>{
  $("#app").classList.add("hidden");
  $("#loginScreen").classList.remove("hidden");
  $("#password").value="";
};

$("#menuBtn").onclick=()=>{
  $(".sidebar").classList.toggle("open");
};

$("#nav").onclick=e=>{
  const b=e.target.closest("[data-page]");
  if(!b)return;

  page=b.dataset.page;
  $$(".nav-item").forEach(n=>
    n.classList.toggle("active",n===b)
  );

  $(".sidebar").classList.remove("open");
  render();
};

function canEdit(p){
  const a=perms[role]||[];
  return a.includes("*")||a.includes(p);
}

function btn(t,fn,cls="muted-btn"){
  return `<button class="${cls}" onclick="${fn}">${t}</button>`;
}

function addForm(title,fields,fn){
  return `<div class="panel"><h2>${title}</h2>
    <form onsubmit="${fn};return false">
      <div class="form-row">${fields}</div>
      <button class="primary" style="margin-top:12px">Tambah</button>
    </form>
  </div>`;
}

// Menampilkan halaman
function render(){
  const c=$("#pageContent");

  c.innerHTML=
    `<div class="section-head">
      <h1>${labels[page]}</h1>
      <span class="tag">${kind==="Guru"?"Akses Guru":role}</span>
    </div>`+
    ({
      dashboard:dashboard,
      denah:denah,
      pengumuman:announcements,
      absensi:attendance,
      tugas:tasks,
      tagihan:bills,
      anggota:members,
      playlist:playlist,
      gallery:gallery,
      saluran:channels,
      jadwal:schedule,
      pakaian:clothes
    }[page]||dashboard)();

  c.querySelectorAll("form").forEach(f=>
    f.addEventListener("submit",e=>e.preventDefault())
  );
}

function dashboard(){
  const safe = value => String(value ?? "").replace(
    /[&<>"']/g,
    ch => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[ch])
  );

  const money = value =>
    "Rp " + Number(value || 0).toLocaleString("id-ID");

  const pendingBills = data.bills.filter(x => !x.paid);
  const unpaidTotal = pendingBills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0), 0
  );

  const recentTasks = data.tasks.slice(0, 3);
  const recentAnnouncements = data.announcements.slice(0, 3);

  const attendanceToday = data.attendance.filter(x =>
    x.date === new Date().toLocaleDateString("id-ID")
  );

  const presentToday = attendanceToday.filter(
    x => x.status === "Hadir"
  ).length;

  const quickLinks = [
    {icon:"📢",title:"Pengumuman",desc:"Informasi kelas",page:"pengumuman"},
    {icon:"📚",title:"Daftar Tugas",desc:"Tugas dan tenggat",page:"tugas"},
    {icon:"✓",title:"Absensi",desc:"Catatan kehadiran",page:"absensi"},
    {icon:"💰",title:"Tagihan",desc:"Status pembayaran",page:"tagihan"},
    {icon:"📅",title:"Jadwal",desc:"Pelajaran kelas",page:"jadwal"},
    {icon:"📸",title:"Gallery",desc:"Foto kenangan",page:"gallery"},
    {icon:"🎵",title:"Playlist",desc:"Musik kelas",page:"playlist"},
    {icon:"♙",title:"Anggota",desc:"Profil teman",page:"anggota"}
  ];

  return `
    <section class="dash-hero">
      <div class="dash-hero-overlay"></div>

      <div class="dash-hero-content">
        <span class="dash-eyebrow">
          ✦ MAN 4 BANJAR · TAHUN AJARAN 2026/2027
        </span>

        <h1>Our Class XI-G</h1>

        <p>
          Halo, ${safe(username)}! 👋<br>
          Satu kelas, banyak cerita. Mari buat hari ini bermakna.
        </p>

        <button class="dash-hero-button"
          onclick="openDashboardPage('gallery')">
          📸 Jelajahi Kenangan
        </button>
      </div>

      <div class="dash-hero-decoration">XI-G</div>
    </section>

    <section class="dash-section">
      <div class="dash-section-heading">
        <div>
          <p class="dash-section-kicker">CLASS OVERVIEW</p>
          <h2>Ringkasan Kelas</h2>
        </div>
        <span class="dash-heading-mark">✦</span>
      </div>

      <div class="dash-stats">
        <article class="dash-stat-card">
          <div class="dash-stat-icon stat-members">♙</div>
          <div>
            <span>Anggota</span>
            <strong>30</strong>
            <small>Anggota kelas</small>
          </div>
        </article>

        <article class="dash-stat-card">
          <div class="dash-stat-icon stat-tasks">📚</div>
          <div>
            <span>Tugas</span>
            <strong>${data.tasks.length}</strong>
            <small>Tugas tercatat</small>
          </div>
        </article>

        <article class="dash-stat-card">
          <div class="dash-stat-icon stat-announcements">📢</div>
          <div>
            <span>Pengumuman</span>
            <strong>${data.announcements.length}</strong>
            <small>Info tercatat</small>
          </div>
        </article>
      </div>
    </section>

    <section class="dash-section">
      <div class="dash-section-heading">
        <div>
          <p class="dash-section-kicker">YOUR CLASS TOOLS</p>
          <h2>Akses Cepat</h2>
        </div>
      </div>

      <div class="dash-quick-grid">
        ${quickLinks.map(item => `
          <button class="dash-quick-card"
            onclick="openDashboardPage('${item.page}')">
            <span class="dash-quick-icon">${item.icon}</span>
            <span class="dash-quick-title">${item.title}</span>
            <span class="dash-quick-desc">${item.desc}</span>
            <span class="dash-quick-arrow">↗</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="dash-section">
      <div class="dash-section-heading">
        <div>
          <p class="dash-section-kicker">STAY ORGANIZED</p>
          <h2>Aktivitas Kelas</h2>
        </div>
      </div>

      <div class="dash-activity-grid">
        <article class="dash-activity-card">
          <div class="dash-activity-top">
            <span class="dash-activity-icon">📚</span>
            <span class="tag">${data.tasks.length} tugas</span>
          </div>

          <h3>Tugas Terbaru</h3>

          ${recentTasks.length ? `
            <div class="dash-mini-list">
              ${recentTasks.map(task => `
                <div class="dash-mini-item">
                  <b>${safe(task.title)}</b>
                  <small>⏰ ${safe(task.due || "Belum ditentukan")}</small>
                </div>
              `).join("")}
            </div>
          ` : `
            <p class="dash-muted">Belum ada tugas tercatat.</p>
          `}

          <button class="dash-text-button"
            onclick="openDashboardPage('tugas')">
            Buka daftar tugas ↗
          </button>
        </article>

        <article class="dash-activity-card">
          <div class="dash-activity-top">
            <span class="dash-activity-icon">💰</span>
            <span class="tag">${pendingBills.length} belum lunas</span>
          </div>

          <h3>Ringkasan Tagihan</h3>

          <strong class="dash-money">${money(unpaidTotal)}</strong>

          <p class="dash-muted">
            Total nominal tagihan yang belum lunas.
          </p>

          <button class="dash-text-button"
            onclick="openDashboardPage('tagihan')">
            Periksa tagihan ↗
          </button>
        </article>

        <article class="dash-activity-card">
          <div class="dash-activity-top">
            <span class="dash-activity-icon">✓</span>
            <span class="tag">Hari ini</span>
          </div>

          <h3>Absensi Hari Ini</h3>

          <strong class="dash-money">
            ${presentToday} hadir
          </strong>

          <p class="dash-muted">
            ${attendanceToday.length} catatan kehadiran tersimpan hari ini.
          </p>

          <button class="dash-text-button"
            onclick="openDashboardPage('absensi')">
            Buka absensi ↗
          </button>
        </article>
      </div>
    </section>

    <section class="dash-section">
      <div class="dash-section-heading">
        <div>
          <p class="dash-section-kicker">LATEST UPDATES</p>
          <h2>Pengumuman Terbaru</h2>
        </div>

        <button class="dash-text-button"
          onclick="openDashboardPage('pengumuman')">
          Lihat semua ↗
        </button>
      </div>

      ${recentAnnouncements.length ? `
        <div class="dash-announcement-list">
          ${recentAnnouncements.map(item => `
            <article class="dash-announcement-card">
              <div class="dash-announcement-icon">📢</div>
              <div class="dash-announcement-content">
                <h3>${safe(item.title)}</h3>
                <p>${safe(item.desc)}</p>
                <small>◷ ${safe(item.date || "Pengumuman kelas")}</small>
              </div>
            </article>
          `).join("")}
        </div>
      ` : `
        <div class="dash-empty">
          <span>📭</span>
          <p>Belum ada pengumuman.</p>
        </div>
      `}
    </section>

    <section class="dash-section">
      <div class="dash-section-heading">
        <div>
          <p class="dash-section-kicker">OUR MEMORIES</p>
          <h2>Kenangan XI-G 📸</h2>
        </div>
        <button class="dash-text-button"
          onclick="openDashboardPage('gallery')">
          Buka Gallery ↗
        </button>
      </div>

      <button class="dash-memory-card"
        onclick="openDashboardPage('gallery')">
        <img
          src="aset/Screenshot_20261010-155852.jpg"
          alt="Kenangan kelas XI-G"
          onerror="this.style.display='none'">

        <div class="dash-memory-overlay">
          <span>✦ OUR STORY</span>
          <h3>Different People,<br>One Frequency.</h3>
          <p>Setiap momen adalah bagian dari cerita kita.</p>
          <span class="dash-memory-cta">Lihat Gallery ↗</span>
        </div>
      </button>
    </section>

    <section class="dash-quote">
      <span>“</span>
      <p>Satu kelas, banyak cerita.</p>
      <small>OUR CLASS XI-G · MAN 4 BANJAR</small>
    </section>
  `;
}


  const latestAnnouncements = [...data.announcements]
    .sort((a,b)=>Number(!!b.important)-Number(!!a.important))
    .slice(0,3)
      

function openDashboardPage(target){
  page = target;

  document.querySelectorAll(".nav-item").forEach(button=>{
    button.classList.toggle("active",button.dataset.page===target);
  });

  document.querySelector(".sidebar")?.classList.remove("open");
  render();
}


function denah(){
  return `<p class="muted">Isi nama siswa pada setiap meja. Perubahan tersimpan sementara selama halaman terbuka.</p>
    <div class="teacher-seat">Meja Guru</div>
    <div class="desk-grid">
      ${data.seats.map((n,i)=>
        `<div class="desk">
          <small>Meja ${i+1}</small>
          <input aria-label="Nama meja ${i+1}" value="${n}" placeholder="Nama siswa"
            onchange="data.seats[${i}]=this.value">
        </div>`
      ).join("")}
    </div>
    <p>${btn("Kosongkan denah","data.seats.fill('');render()")}</p>`;
}

function announcements(){
  return `${canEdit("pengumuman")?
    addForm("Tambah pengumuman",
      '<label>Judul<input id="aTitle" required></label><label>Isi<input id="aDesc" required></label>',
      "addAnnouncement()"):""}
    <div class="cards">
      ${data.announcements.map((x,i)=>
        `<article class="item-card">
          <span class="tag">${x.date}</span>
          <h3>${x.title}</h3><p>${x.desc}</p>
          ${canEdit("pengumuman")?
            btn("Hapus",`data.announcements.splice(${i},1);render()`,"action danger"):""}
        </article>`
      ).join("")}
    </div>`;
}

function addAnnouncement(){
  data.announcements.unshift({
    title:$("#aTitle").value,
    desc:$("#aDesc").value,
    date:"Baru"
  });
  render();
}

function attendance(){
  return `<div class="panel">
    <h2>Catat kehadiran</h2>
    <form onsubmit="saveAttendance();return false">
      <div class="form-row">
        <label>Nama siswa<input id="attName" required placeholder="Nama lengkap"></label>
        <label>Status<select id="attStatus">
          <option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alpa</option>
        </select></label>
      </div>
      <button class="primary">Simpan absensi</button>
    </form>
  </div>
  <div class="panel" style="margin-top:15px">
    <h2>Riwayat absensi</h2>
    ${data.attendance.length?
      data.attendance.map(x=>
        `<div class="list-row"><b>${x.name}</b><small>${x.status} · ${x.date}</small></div>`
      ).join(""):'<div class="empty">Belum ada absensi yang dicatat.</div>'}
  </div>`;
}

function saveAttendance(){
  data.attendance.unshift({
    name:$("#attName").value,
    status:$("#attStatus").value,
    date:new Date().toLocaleDateString("id-ID")
  });
  render();
}

function tasks(){
  return `${canEdit("tugas")?
    addForm("Tambah tugas",
      '<label>Nama tugas<input id="tTitle" required></label><label>Tenggat<input id="tDue" placeholder="Contoh: Jumat" required></label>',
      "addTask()"):""}
    <div class="cards">
      ${data.tasks.map((x,i)=>
        `<article class="item-card">
          <span class="tag">${x.due}</span>
          <h3>${x.title}</h3><p>${x.desc}</p>
          ${canEdit("tugas")?
            btn("Selesai / hapus",`data.tasks.splice(${i},1);render()`,"action"):""}
        </article>`
      ).join("")}
    </div>`;
}

function addTask(){
  data.tasks.push({
    title:$("#tTitle").value,
    desc:"Tugas kelas",
    due:$("#tDue").value
  });
  render();
}

function bills(){
  return `${canEdit("tagihan")?
    addForm("Tambah tagihan",
      '<label>Nama tagihan<input id="bName" required placeholder="Kas / buku / acara"></label><label>Nominal (Rp)<input id="bAmount" type="number" min="0" required></label>',
      "addBill()"):""}
    <div class="panel">
      <h2>Daftar tagihan</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Tagihan</th><th>Nominal</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          ${data.bills.map((x,i)=>
            `<tr>
              <td>${x.name}</td>
              <td>Rp ${Number(x.amount).toLocaleString("id-ID")}</td>
              <td><span class="tag">${x.paid?"Lunas":"Belum lunas"}</span></td>
              <td>${canEdit("tagihan")?
                btn(x.paid?"Batalkan":"Lunasi",`data.bills[${i}].paid=!data.bills[${i}].paid;render()`,"action")+" "+
                btn("Hapus",`data.bills.splice(${i},1);render()`,"action danger"):"—"}</td>
            </tr>`
          ).join("")}
        </tbody>
      </table></div>
    </div>`;
}

function addBill(){
  data.bills.push({
    name:$("#bName").value,
    amount:Number($("#bAmount").value),
    person:"Anggota",
    paid:false
  });
  render();
}

function members(){
  return `<div class="profile-grid">
    ${data.profiles.map(x=>
      `<article class="profile">
        <div class="avatar">${x.name[0].toUpperCase()}</div>
        <h3>${x.name}</h3><p>${x.role}</p>
        <p style="margin-top:10px">${x.quote}</p>
      </article>`
    ).join("")}
  </div>
  <div class="panel" style="margin-top:15px">
    <h2>Info profil</h2>
    <p class="muted">Profil dapat dikembangkan dengan foto, tanggal lahir, hobi, prestasi, akun sosial, kutipan, dan tautan lagu Spotify.</p>
  </div>`;
}

function playlist(){
  return `<div class="panel playlist-card">
    <h2>🎵 Playlist Kelas XI-G</h2>
    <div class="playlist-content">
      <img src="aset/Screenshot_20261010-155852.jpg"
        alt="Logo Playlist XI-G" class="playlist-logo">
      <h3>Playlist XI-G</h3>
      <p>Kumpulan lagu pilihan untuk menemani hari-hari kelas XI-G.</p>
      <a class="primary playlist-link"
        href="https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link"
        target="_blank" rel="noopener noreferrer">
        🎧 Buka Playlist di Spotify
      </a>
    </div>
  </div>`;
}

function openSpotify(){
  window.open(
    "https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link",
    "_blank"
  );
}


function channels(){
  return `
    <section class="ig-profile">
      <div class="ig-cover">
        <div class="ig-cover-label">✦ OUR CLASS XI-G ✦</div>
        <div class="ig-cover-year">MAN 4 BANJAR · 2026/2027</div>
      </div>

      <div class="ig-profile-main">
        <div class="ig-profile-top">
          <img
            src="aset/Icon.jpg"
            alt="Foto profil Instagram Graphene XI-G"
            class="ig-avatar"
          >

          <div class="ig-profile-info">
            <h2>graphene.xig</h2>
            <p class="ig-display-name">GRAPHENE · XI-G</p>

            <div class="ig-stats">
              <div><strong>30</strong><span>Minds</span></div>
              <div><strong>1</strong><span>Frequency</span></div>
              <div><stro