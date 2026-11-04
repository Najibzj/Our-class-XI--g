/* OUR CLASS XI-G — app.js | index.html, style.css, app.js, aset/ */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let kind = 'Murid';
let role = 'anggota';
let username = 'Anggota';
let page = 'dashboard';
let selectedDay = 'Senin';

const perms = {
  sekretaris: ['pengumuman', 'tugas', 'denah', 'absensi', 'jadwal', 'pakaian'],
  bendahara: ['tagihan'],
  ketua: ['*'],
  anggota: [],
  guru: ['*']
};

const passwords = {
  sekretaris: 'PWSS',
  bendahara: 'KASX',
  ketua: 'KETUAX',
  guru: 'SSSG'
};

const labels = {
  dashboard: 'Dashboard',
  denah: 'Denah Kelas',
  pengumuman: 'Pengumuman',
  absensi: 'Absensi',
  tugas: 'Tugas',
  tagihan: 'Tagihan',
  anggota: 'Profil Anggota',
  gallery: 'Gallery XI-G',
  playlist: 'Playlist Kelas',
  saluran: 'Sosmed & Saluran',
  jadwal: 'Jadwal Pelajaran',
  pakaian: 'Jadwal Pakaian'
};

const defaults = {
  announcements: [
    {
      title: 'Persiapan kelas',
      desc: 'Jaga kebersihan dan kerapian kelas.',
      date: 'Hari ini'
    }
  ],

  tasks: [
    {
      title: 'Matematika — Inversi Fungsi',
      desc: 'Pelajari materi dan selesaikan latihan.',
      due: 'Besok'
    },
    {
      title: 'Kimia — Laporan Praktikum',
      desc: 'Kumpulkan laporan praktikum.',
      due: '2 hari'
    }
  ],

  bills: [
    {
      name: 'Kas kelas',
      amount: 10000,
      person: 'Semua anggota',
      paid: false
    }
  ],

  attendance: [],
  seats: Array(15).fill(''),

  profiles: [
    {
      name: 'Najib',
      role: 'Anggota',
      quote: 'Satu kelas, banyak cerita.'
    }
  ],

  gallery: [],

  schedule: [
    ['07.30–08.00', 'Matematika'],
    ['08.00–10.00', 'Bahasa Indonesia'],
    ['10.45–12.15', 'Kimia'],
    ['13.00–14.30', 'Sejarah']
  ],

  clothes: [
    ['Senin', 'Putih Abu-abu'],
    ['Selasa', 'Putih Abu-abu'],
    ['Rabu', 'Batik'],
    ['Kamis', 'Pramuka'],
    ['Jumat', 'Muslim / sesuai ketentuan sekolah']
  ]
};

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function load() {
  try {
    return {
      ...clone(defaults),
      ...JSON.parse(localStorage.getItem('ourClassXIGData') || '{}')
    };
  } catch (e) {
    return clone(defaults);
  }
}

let data = load();

function saveData() {
  try {
    localStorage.setItem('ourClassXIGData', JSON.stringify(data));
  } catch (e) {
    console.warn('Penyimpanan lokal penuh/tidak tersedia', e);
  }
}

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

function msg(t) {
  if ($('#loginMsg')) {
    $('#loginMsg').textContent = t;
  }
}

/* LOGIN DAN NAVIGASI */

function setup() {
  $$('.role-btn').forEach(b => {
    b.addEventListener('click', () => {
      kind = b.dataset.kind || 'Murid';

      $$('.role-btn').forEach(x => {
        x.classList.toggle('active', x === b);
      });

      if ($('#loginRole')) {
        $('#loginRole').innerHTML = kind === 'Guru'
          ? '<option value="guru">Guru</option>'
          : '<option value="anggota">Anggota</option>' +
            '<option value="sekretaris">Sekretaris</option>' +
            '<option value="bendahara">Bendahara</option>' +
            '<option value="ketua">Ketua</option>';
      }

      if ($('#username')) {
        $('#username').value = '';

        const l = $('#username').closest('label');

        if (l) l.style.display = 'none';
      }

      if ($('#password')) {
        $('#password').value = '';
        $('#password').required = kind === 'Guru';
      }

      msg('');
    });
  });

  $('#loginRole')?.addEventListener('change', () => {
    if ($('#password')) {
      $('#password').value = '';
      $('#password').required =
        kind === 'Guru' || $('#loginRole').value !== 'anggota';
    }

    msg('');
  });

  $('#loginBtn')?.addEventListener('click', login);

  $('#password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });

  $('#logoutBtn')?.addEventListener('click', () => {
    $('#app')?.classList.add('hidden');
    $('#loginScreen')?.classList.remove('hidden');

    if ($('#password')) {
      $('#password').value = '';
    }
  });

  $('#menuBtn')?.addEventListener('click', () => {
    $('.sidebar')?.classList.toggle('open');
  });

  $('#nav')?.addEventListener('click', e => {
    const b = e.target.closest('[data-page]');

    if (b) {
      openDashboardPage(b.dataset.page);
    }
  });
}

function login() {
  if (!$('#loginRole')) {
    return msg('Pilihan akun tidak ditemukan.');
  }

  role = $('#loginRole').value;

  const pw = $('#password')?.value || '';

  if (kind === 'Murid' && role === 'anggota') {
    username = 'Anggota';
  } else {
    if (!pw) {
      return msg('Masukkan kata sandi terlebih dahulu.');
    }

    if (pw !== passwords[role]) {
      return msg('Kata sandi tidak sesuai.');
    }

    username = kind === 'Guru'
      ? 'Guru'
      : role[0].toUpperCase() + role.slice(1);
  }

  $('#loginScreen')?.classList.add('hidden');
  $('#app')?.classList.remove('hidden');

  if ($('#userLabel')) {
    $('#userLabel').textContent = username;
  }

  if ($('#roleLabel')) {
    $('#roleLabel').textContent =
      kind === 'Guru'
        ? 'Guru'
        : role[0].toUpperCase() + role.slice(1);
  }

  render();
}

function canEdit(p) {
  const a = perms[role] || [];

  return a.includes('*') || a.includes(p);
}

function openDashboardPage(target) {
  if (!labels[target]) return;

  page = target;

  $('.sidebar')?.classList.remove('open');

  render();
}

function btn(t, fn, cls = 'muted-btn') {
  return `<button type="button" class="${cls}" onclick="${fn}">${t}</button>`;
}

function addForm(title, fields, fn) {
  return `
    <div class="panel">
      <h2>${title}</h2>

      <form onsubmit="${fn};return false">
        <div class="form-row">
          ${fields}
        </div>

        <button class="primary" type="submit" style="margin-top:12px">
          Tambah
        </button>
      </form>
    </div>
  `;
}

/* MENAMPILKAN HALAMAN */

function render() {
  const c = $('#pageContent');

  if (!c) return;

  const views = {
    dashboard,
    denah,
    pengumuman: announcements,
    absensi: attendance,
    tugas,
    tagihan: bills,
    anggota: members,
    playlist,
    gallery,
    saluran: channels,
    jadwal: schedule,
    pakaian: clothes
  };

  c.innerHTML = `
    <div class="section-head">
      <h1>${labels[page] || 'Dashboard'}</h1>
      <span class="tag">
        ${kind === 'Guru' ? 'Akses Guru' : esc(role)}
      </span>
    </div>
  ` + (views[page] || dashboard)();

  $$('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
}

/* DASHBOARD */

function dashboard() {
  const pending = data.bills.filter(x => !x.paid);

  const total = pending.reduce(
    (s, x) => s + Number(x.amount || 0),
    0
  );

  const today = new Date().toLocaleDateString('id-ID');

  const att = data.attendance.filter(x => x.date === today);

  const links = [
    ['📢', 'Pengumuman', 'Informasi kelas', 'pengumuman'],
    ['📚', 'Daftar Tugas', 'Tugas dan tenggat', 'tugas'],
    ['✓', 'Absensi', 'Catatan kehadiran', 'absensi'],
    ['💰', 'Tagihan', 'Status pembayaran', 'tagihan'],
    ['📅', 'Jadwal', 'Pelajaran kelas', 'jadwal'],
    ['📸', 'Gallery', 'Foto kenangan', 'gallery'],
    ['🎵', 'Playlist', 'Musik kelas', 'playlist'],
    ['♙', 'Anggota', 'Profil teman', 'anggota']
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
          Halo, ${esc(username)}! 👋<br>
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
        ${links.map(x => `
          <button class="dash-quick-card"
            onclick="openDashboardPage('${x[3]}')">

            <span class="dash-quick-icon">${x[0]}</span>
            <span class="dash-quick-title">${x[1]}</span>
            <span class="dash-quick-desc">${x[2]}</span>
            <span class="dash-quick-arrow">↗</span>
          </button>
        `).join('')}
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

          ${data.tasks.slice(0, 3).map(x => `
            <div class="dash-mini-item">
              <b>${esc(x.title)}</b>
              <small>⏰ ${esc(x.due)}</small>
            </div>
          `).join('') || '<p class="dash-muted">Belum ada tugas.</p>'}

          <button class="dash-text-button"
            onclick="openDashboardPage('tugas')">
            Buka daftar tugas ↗
          </button>
        </article>

        <article class="dash-activity-card">
          <div class="dash-activity-top">
            <span class="dash-activity-icon">💰</span>
            <span class="tag">${pending.length} belum lunas</span>
          </div>

          <h3>Ringkasan Tagihan</h3>

          <strong class="dash-money">
            Rp ${total.toLocaleString('id-ID')}
          </strong>

          <p class="dash-muted">
            Total tagihan belum lunas.
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
            ${att.filter(x => x.status === 'Hadir').length} hadir
          </strong>

          <p class="dash-muted">
            ${att.length} catatan tersimpan hari ini.
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

      <div class="dash-announcement-list">
        ${data.announcements.slice(0, 3).map(x => `
          <article class="dash-announcement-card">
            <div class="dash-announcement-icon">📢</div>

            <div class="dash-announcement-content">
              <h3>${esc(x.title)}</h3>
              <p>${esc(x.desc)}</p>
              <small>◷ ${esc(x.date)}</small>
            </div>
          </article>
        `).join('') || '<p class="dash-muted">Belum ada pengumuman.</p>'}
      </div>
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

          <p>
            Setiap momen adalah bagian dari cerita kita.
          </p>

          <span class="dash-memory-cta">
            Lihat Gallery ↗
          </span>
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

/* DENAH KELAS */

function denah() {
  return `
    <p class="muted">Isi nama siswa pada setiap meja.</p>

    <div class="teacher-seat">
      Meja Guru
    </div>

    <div class="desk-grid">
      ${data.seats.map((n, i) => `
        <div class="desk">
          <small>Meja ${i + 1}</small>

          <input
            value="${esc(n)}"
            placeholder="Nama siswa"
            onchange="data.seats[${i}]=this.value;saveData()">
        </div>
      `).join('')}
    </div>

    ${canEdit('denah')
      ? btn('Kosongkan denah', 'clearSeats()', 'action danger')
      : ''}
  `;
}

function clearSeats() {
  data.seats = Array(15).fill('');
  saveData();
  render();
}

/* PENGUMUMAN */

function announcements() {
  return `
    ${canEdit('pengumuman')
      ? addForm(
          'Tambah pengumuman',
          '<label>Judul<input id="aTitle" required></label><label>Isi<input id="aDesc" required></label>',
          'addAnnouncement()'
        )
      : ''}

    <div class="cards">
      ${data.announcements.map((x, i) => `
        <article class="item-card">
          <span class="tag">${esc(x.date)}</span>
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.desc)}</p>

          ${canEdit('pengumuman')
            ? btn('Hapus', `deleteItem('announcements',${i})`, 'action danger')
            : ''}
        </article>
      `).join('') || '<p class="empty">Belum ada pengumuman.</p>'}
    </div>
  `;
}

function addAnnouncement() {
  const title = $('#aTitle')?.value.trim();
  const desc = $('#aDesc')?.value.trim();

  if (!title || !desc) return;

  data.announcements.unshift({
    title,
    desc,
    date: 'Baru'
  });

  saveData();
  render();
}

/* ABSENSI */

function attendance() {
  return `
    <div class="panel">
      <h2>Catat kehadiran</h2>

      <form onsubmit="saveAttendance();return false">
        <div class="form-row">

          <label>
            Nama siswa
            <input id="attName" required>
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

    <div class="panel" style="margin-top:15px">
      <h2>Riwayat absensi</h2>

      ${data.attendance.map((x, i) => `
        <div class="list-row">
          <b>${esc(x.name)}</b>
          <small>${esc(x.status)} · ${esc(x.date)}</small>

          ${canEdit('absensi')
            ? btn('Hapus', `deleteItem('attendance',${i})`, 'action danger')
            : ''}
        </div>
      `).join('') || '<div class="empty">Belum ada absensi.</div>'}
    </div>
  `;
}

function saveAttendance() {
  const name = $('#attName')?.value.trim();

  if (!name) return;

  data.attendance.unshift({
    name,
    status: $('#attStatus').value,
    date: new Date().toLocaleDateString('id-ID')
  });

  saveData();
  render();
}

/* TUGAS */

function tasks() {
  return `
    ${canEdit('tugas')
      ? addForm(
          'Tambah tugas',
          '<label>Nama tugas<input id="tTitle" required></label><label>Tenggat<input id="tDue" required placeholder="Contoh: Jumat"></label>',
          'addTask()'
        )
      : ''}

    <div class="cards">
      ${data.tasks.map((x, i) => `
        <article class="item-card">
          <span class="tag">${esc(x.due)}</span>
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.desc)}</p>

          ${canEdit('tugas')
            ? btn('Hapus tugas', `deleteItem('tasks',${i})`, 'action danger')
            : ''}
        </article>
      `).join('') || '<p class="empty">Belum ada tugas.</p>'}
    </div>
  `;
}

function addTask() {
  const title = $('#tTitle')?.value.trim();
  const due = $('#tDue')?.value.trim();

  if (!title || !due) return;

  data.tasks.unshift({
    title,
    desc: 'Tugas kelas',
    due
  });

  saveData();
  render();
}

/* TAGIHAN */

function bills() {
  return `
    ${canEdit('tagihan')
      ? addForm(
          'Tambah tagihan',
          '<label>Nama tagihan<input id="bName" required></label><label>Nominal (Rp)<input id="bAmount" type="number" min="0" required></label>',
          'addBill()'
        )
      : ''}

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
            ${data.bills.map((x, i) => `
              <tr>
                <td>${esc(x.name)}</td>

                <td>
                  Rp ${Number(x.amount).toLocaleString('id-ID')}
                </td>

                <td>
                  <span class="tag">
                    ${x.paid ? 'Lunas' : 'Belum lunas'}
                  </span>
                </td>

                <td>
                  ${canEdit('tagihan')
                    ? btn(
                        x.paid ? 'Batalkan' : 'Lunasi',
                        `toggleBill(${i})`,
                        'action'
                      ) + ' ' +
                      btn(
                        'Hapus',
                        `deleteItem('bills',${i})`,
                        'action danger'
                      )
                    : '—'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function addBill() {
  const name = $('#bName')?.value.trim();
  const amount = Number($('#bAmount')?.value);

  if (!name || !Number.isFinite(amount) || amount < 0) return;

  data.bills.push({
    name,
    amount,
    person: 'Anggota',
    paid: false
  });

  saveData();
  render();
}

function toggleBill(i) {
  if (data.bills[i]) {
    data.bills[i].paid = !data.bills[i].paid;
    saveData();
    render();
  }
}

/* HAPUS DATA */

function deleteItem(key, i) {
  if (Array.isArray(data[key])) {
    data[key].splice(i, 1);
    saveData();
    render();
  }
}

/* PROFIL ANGGOTA */

function members() {
  return `
    <div class="profile-grid">
      ${data.profiles.map(x => `
        <article class="profile">
          <div class="avatar">
            ${esc((x.name || '?')[0].toUpperCase())}
          </div>

          <h3>${esc(x.name)}</h3>
          <p>${esc(x.role)}</p>

          <p style="margin-top:10px">
            ${esc(x.quote)}
          </p>
        </article>
      `).join('')}
    </div>

    <div class="panel" style="margin-top:15px">
      <h2>Info profil</h2>
      <p class="muted">Profil anggota kelas XI-G.</p>
    </div>
  `;
}

/* PLAYLIST */

function playlist() {
  return `
    <div class="panel playlist-card">
      <h2>🎵 Playlist Kelas XI-G</h2>

      <div class="playlist-content">
        <img
          src="aset/Screenshot_20261010-155852.jpg"
          alt="Logo Playlist XI-G"
          class="playlist-logo">

        <h3>Playlist XI-G</h3>

        <p>
          Kumpulan lagu pilihan untuk menemani
          hari-hari kelas XI-G.
        </p>

        <a class="primary playlist-link"
          href="https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link"
          target="_blank"
          rel="noopener noreferrer">

          🎧 Buka Playlist di Spotify
        </a>
      </div>
    </div>
  `;
}

function openSpotify() {
  window.open(
    'https://open.spotify.com/playlist/7Ls5JdpWqrFIE02Gn75lfy?si=A8Kub2a-R4qf9mCMBOaZ1A&utm_source=copy-link',
    '_blank',
    'noopener'
  );
}

/* SOSMED DAN SALURAN */

function channels() {
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
            src="aset/Icon.jpg"
            alt="Foto profil Instagram Graphene XI-G"
            class="ig-avatar">

          <div class="ig-profile-info">

            <h2>graphene.xig</h2>

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

        <div class="ig-bio">

          <p class="ig-bio-title">
            OUR CLASS, OUR STORY ✦
          </p>

          <p>
            Different people, one frequency.
            Tempat menyimpan cerita, kebersamaan,
            dan kenangan XI-G.
          </p>

          <p class="ig-bio-tag">
            MAN 4 BANJAR · 2026/2027
          </p>

        </div>

        <a class="ig-follow-btn"
          href="https://www.instagram.com/graphene.xig/"
          target="_blank"
          rel="noopener noreferrer">

          <span>◎</span>
          <span>Kunjungi Instagram</span>
          <span class="ig-arrow">↗</span>

        </a>

        <div class="ig-bottom-note">
          <span>✦</span>
          <p>Satu kelas, banyak cerita.</p>
          <span>✦</span>
        </div>

      </div>
    </section>
  `;
}

/* GALLERY */

function gallery() {
  return `
    ${canEdit('*') ? `
      <div class="panel gallery-upload">
        <h2>Tambah foto kenangan</h2>

        <label>
          Pilih foto
          <input
            id="galleryFile"
            type="file"
            accept="image/*">
        </label>

        <label>
          Keterangan
          <input
            id="galleryCaption"
            placeholder="Contoh: Kegiatan kelas">
        </label>

        <button
          class="primary"
          type="button"
          onclick="addGalleryPhoto()">
          Unggah foto
        </button>

        <p class="small muted">
          Foto tersimpan di browser perangkat ini
          (maksimal 1,5 MB).
        </p>
      </div>
    ` : ''}

    <div class="gallery-grid">

      ${data.gallery.map((x, i) => `
        <article class="gallery-card">

          <div class="gallery-photo polaroid">
            <img
              src="${x.src}"
              alt="${esc(x.caption)}"
              onclick="viewGalleryPhoto(${i})">
          </div>

          <div class="gallery-caption">
            <p>${esc(x.caption)}</p>

            ${canEdit('*')
              ? btn(
                  'Hapus',
                  `deleteItem('gallery',${i})`,
                  'action danger'
                )
              : ''}
          </div>

        </article>
      `).join('') || `
        <div class="empty">
          Belum ada foto di Gallery XI-G.
        </div>
      `}

    </div>

    <div
      id="galleryViewer"
      class="gallery-viewer hidden"
      onclick="closeGalleryViewer()">

      <button
        class="gallery-close"
        type="button"
        onclick="event.stopPropagation();closeGalleryViewer()">
        ×
      </button>

      <img
        id="galleryViewerImage"
        alt="Foto gallery"
        onclick="event.stopPropagation()">

    </div>
  `;
}

function addGalleryPhoto() {
  const f = $('#galleryFile')?.files?.[0];

  if (!f) {
    return alert('Pilih foto terlebih dahulu.');
  }

  if (!f.type.startsWith('image/')) {
    return alert('File harus berupa gambar.');
  }

  if (f.size > 1500000) {
    return alert('Ukuran foto maksimal 1,5 MB.');
  }

  const r = new FileReader();

  r.onload = () => {
    data.gallery.unshift({
      src: r.result,
      caption: $('#galleryCaption')?.value.trim() || 'Kenangan XI-G'
    });

    saveData();
    render();
  };

  r.readAsDataURL(f);
}

function viewGalleryPhoto(i) {
  const x = data.gallery[i];

  if (x && $('#galleryViewerImage')) {
    $('#galleryViewerImage').src = x.src;
    $('#galleryViewer')?.classList.remove('hidden');
  }
}

function closeGalleryViewer() {
  $('#galleryViewer')?.classList.add('hidden');
}

/* JADWAL PELAJARAN */

function schedule() {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  return `
    <div class="schedule-hero">

      <div class="schedule-hero-icon">✦</div>

      <p class="schedule-kicker">
        MAN 4 BANJAR · XI-G
      </p>

      <h2>Jadwal Pelajaran</h2>

      <p>Tahun Ajaran 2026/2027</p>

      <div class="schedule-hero-line"></div>

      <span>LEARN · GROW · ACHIEVE</span>

    </div>

    <div class="schedule-note">
      <span>📚</span>

      <div>
        <b>Atur hari belajarmu</b>
        <p>Pilih hari untuk melihat jadwal pelajaran.</p>
      </div>
    </div>

    <div class="schedule-days">

      ${days.map((d, i) => `
        <button
          type="button"
          class="schedule-day ${selectedDay === d ? 'selected' : ''}"
          onclick="selectScheduleDay('${d}')">

          <span>${['☀️', '📘', '✦', '📖', '🌿'][i]}</span>
          <b>${d}</b>

        </button>
      `).join('')}

    </div>

    <div class="schedule-day-panel">

      <div class="schedule-day-heading">
        <span>📅</span>

        <div>
          <h3>${selectedDay}</h3>
          <p>Jadwal kegiatan belajar</p>
        </div>
      </div>

      <div class="schedule-lesson-list">

        ${data.schedule.map(x => `
          <div class="schedule-lesson">

            <div class="schedule-period">
              ${esc(x[0])}
            </div>

            <div class="schedule-lesson-info">
              <b>${esc(x[1])}</b>
              <small>Pelajaran kelas XI-G</small>
            </div>

            <span class="schedule-lesson-star">✦</span>

          </div>
        `).join('')}

      </div>
    </div>
  `;
}

function selectScheduleDay(d) {
  selectedDay = d;
  render();
}

/* JADWAL PAKAIAN */

function clothes() {
  return `
    <div class="schedule-hero">

      <div class="schedule-hero-icon">♧</div>

      <p class="schedule-kicker">
        MAN 4 BANJAR · XI-G
      </p>

      <h2>Jadwal Pakaian</h2>

      <p>
        Kenakan seragam sesuai ketentuan sekolah.
      </p>

      <div class="schedule-hero-line"></div>

      <span>NEAT · DISCIPLINED · CONFIDENT</span>

    </div>

    <div class="panel" style="margin-top:16px">

      <h2>Ketentuan Seragam Mingguan</h2>

      ${data.clothes.map(x => `
        <div class="list-row">
          <b>${esc(x[0])}</b>
          <small>${esc(x[1])}</small>
        </div>
      `).join('')}

    </div>
  `;
}

/* MENJALANKAN APLIKASI */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}