/* Dashboard XI-G — overriding the original dashboard renderer. */
function dashboard(){
  const safe=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
  const bills=Array.isArray(data.bills)?data.bills:[];
  const tasks=Array.isArray(data.tasks)?data.tasks:[];
  const announcements=Array.isArray(data.announcements)?data.announcements:[];
  const attendance=Array.isArray(data.attendance)?data.attendance:[];
  const pendingBills=bills.filter(item=>!item.paid).length;
  const pendingTasks=tasks.filter(item=>!(["selesai","completed"].includes(String(item.status||"").toLowerCase()))).length;
  const today=new Date().toLocaleDateString("id-ID");
  const attendanceToday=attendance.filter(item=>item.date===today);
  const presentToday=attendanceToday.filter(item=>String(item.status||"").toLowerCase()==="hadir").length;
  const photos=[
    ["aset/dashboard-hero.jpg","Our Class XI-G","Satu kelas, banyak cerita."],
    ["aset/kelas-1.jpg","Momen Kebersamaan","Cerita yang kita simpan bersama."],
    ["aset/kelas-2.jpg","Hari di Sekolah","Setiap hari punya kenangan."]
  ];
  const memories=[
    ["aset/kelas-3.jpg","Kebersamaan XI-G"],
    ["aset/kelas-4.jpg","Cerita di kelas"],
    ["aset/kelas-5.jpg","Momen terbaik"],
    ["aset/kelas-6.jpg","Kenangan lainnya"]
  ];
  const latestTask=tasks[0]||{};
  const latestTaskTitle=latestTask.title||latestTask.name||"Belum ada tugas baru";
  // render() inserts the returned markup immediately after this call.
  window.setTimeout(()=>{if(document.querySelector(".xi-dashboard"))initDashboardInteractions()},0);
  return `
    <div class="xi-dashboard">
      <div class="xi-scroll-progress"><div id="dashboardScrollProgress"></div></div>
      <section class="xi-hero xi-reveal">
        <div class="xi-hero-image"><img src="${photos[0][0]}" alt="Foto Our Class XI-G" onerror="this.style.display='none'"></div>
        <div class="xi-hero-content">
          <span class="xi-badge">XI-G · 2026/2027</span>
          <h1>Our Class XI-G</h1><p>Satu kelas, banyak cerita.</p>
          <div class="xi-hero-buttons">
            <button class="xi-primary-btn" onclick="openDashboardPage('gallery')">📸 Lihat Gallery</button>
            <button class="xi-secondary-btn" onclick="openDashboardPage('anggota')">👥 Profil Anggota</button>
          </div>
        </div>
      </section>
      <section class="xi-stats xi-reveal">
        <div class="xi-stat-card"><span>👥</span><strong>30</strong><small>Anggota Kelas</small></div>
        <div class="xi-stat-card"><span>📝</span><strong>${pendingTasks}</strong><small>Tugas Belum Selesai</small></div>
        <div class="xi-stat-card"><span>💰</span><strong>${pendingBills}</strong><small>Tagihan Belum Lunas</small></div>
        <div class="xi-stat-card"><span>✅</span><strong>${presentToday}</strong><small>Hadir Hari Ini</small></div>
      </section>
      <section class="xi-section xi-reveal">
        <div class="xi-section-title"><div><span>⚡ AKSES CEPAT</span><h2>Menu Kelas</h2></div></div>
        <div class="xi-shortcuts">
          <button onclick="openDashboardPage('pengumuman')"><span>📢</span><b>Pengumuman</b><small>Info terbaru kelas</small></button>
          <button onclick="openDashboardPage('absensi')"><span>✅</span><b>Absensi</b><small>Kehadiran anggota</small></button>
          <button onclick="openDashboardPage('tugas')"><span>📚</span><b>Tugas</b><small>Daftar tugas kelas</small></button>
          <button onclick="openDashboardPage('tagihan')"><span>💳</span><b>Tagihan</b><small>Catatan pembayaran</small></button>
          <button onclick="openDashboardPage('jadwal')"><span>🗓️</span><b>Jadwal</b><small>Pelajaran hari ini</small></button>
          <button onclick="openDashboardPage('playlist')"><span>🎵</span><b>Playlist</b><small>Musik kelas</small></button>
        </div>
      </section>
      <section class="xi-section xi-reveal">
        <div class="xi-section-title"><div><span>📸 MOMEN KELAS</span><h2>Kenangan XI-G</h2></div>
          <div class="xi-carousel-controls"><button onclick="moveDashboardSlide(-1)" aria-label="Foto sebelumnya">‹</button><button onclick="moveDashboardSlide(1)" aria-label="Foto berikutnya">›</button></div>
        </div>
        <div class="xi-carousel" id="dashboardCarousel">
          ${photos.map((photo,index)=>`<div class="xi-slide ${index===0?"active":""}" data-index="${index}" onclick="openDashboardPhoto(${index})">
            <img src="${photo[0]}" alt="${safe(photo[1])}" onerror="this.style.display='none'"><div class="xi-slide-caption"><strong>${safe(photo[1])}</strong><small>${safe(photo[2])}</small></div>
          </div>`).join("")}
        </div>
        <div class="xi-dots" id="dashboardDots">${photos.map((_,index)=>`<button class="${index===0?"active":""}" onclick="goDashboardSlide(${index})" aria-label="Foto ${index+1}"></button>`).join("")}</div>
      </section>
      <section class="xi-section xi-reveal">
        <div class="xi-section-title"><div><span>🖼️ GALERI</span><h2>Potongan Cerita</h2></div><button class="xi-link-btn" onclick="openDashboardPage('gallery')">Lihat semua →</button></div>
        <div class="xi-memory-grid">${memories.map((item,index)=>`<button class="xi-memory" onclick="openDashboardMemory(${index})"><img src="${item[0]}" alt="${safe(item[1])}" onerror="this.style.display='none'"><span>${safe(item[1])}</span></button>`).join("")}</div>
      </section>
      <section class="xi-section xi-reveal">
        <div class="xi-section-title"><div><span>📌 AKTIVITAS</span><h2>Yang Perlu Kamu Cek</h2></div></div>
        <div class="xi-activity-grid">
          <button class="xi-activity-card" onclick="openDashboardPage('tugas')"><span>📚</span><div><small>TUGAS TERBARU</small><strong>${safe(latestTaskTitle)}</strong></div><b>›</b></button>
          <button class="xi-activity-card" onclick="openDashboardPage('pengumuman')"><span>📢</span><div><small>PENGUMUMAN</small><strong>${announcements.length?"Ada informasi terbaru":"Belum ada pengumuman baru"}</strong></div><b>›</b></button>
        </div>
      </section>
      <section class="xi-quote xi-reveal"><div>“</div><p>Satu kelas, banyak cerita.<br>Satu kebersamaan, banyak kenangan.</p><small>— XI-G MAN 4 Banjar</small></section>
      <div id="dashboardPhotoViewer" class="xi-viewer" onclick="if(event.target===this)closeDashboardPhoto()" role="dialog" aria-modal="true" aria-label="Pratinjau foto">
        <button class="xi-viewer-close" onclick="closeDashboardPhoto()" aria-label="Tutup">×</button><img id="dashboardViewerImage" src="" alt=""><div id="dashboardViewerCaption"></div>
      </div>
      <button id="dashboardBackTop" class="xi-back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Kembali ke atas">↑</button>
    </div>`;
}

let dashboardSlideIndex=0;
const dashboardPhotoFiles=["aset/dashboard-hero.jpg","aset/kelas-1.jpg","aset/kelas-2.jpg"];
const dashboardMemoryFiles=["aset/kelas-3.jpg","aset/kelas-4.jpg","aset/kelas-5.jpg","aset/kelas-6.jpg"];
let dashboardScrollHandler=null;
let dashboardEscapeHandler=null;

function initDashboardInteractions(){
  dashboardSlideIndex=0;
  goDashboardSlide(0);
  const progress=document.getElementById("dashboardScrollProgress");
  const backTop=document.getElementById("dashboardBackTop");
  if(dashboardScrollHandler)window.removeEventListener("scroll",dashboardScrollHandler);
  dashboardScrollHandler=()=>{
    const scrollTop=window.scrollY||document.documentElement.scrollTop;
    const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=`${maxScroll>0?(scrollTop/maxScroll)*100:0}%`;
    if(backTop)backTop.classList.toggle("show",scrollTop>350);
    document.querySelectorAll(".xi-reveal").forEach(element=>{
      if(element.getBoundingClientRect().top<window.innerHeight-70)element.classList.add("visible");
    });
  };
  window.addEventListener("scroll",dashboardScrollHandler,{passive:true});
  dashboardScrollHandler();
  const carousel=document.getElementById("dashboardCarousel");
  if(carousel){
    let startX=0;
    carousel.addEventListener("touchstart",event=>{startX=event.changedTouches[0].clientX},{passive:true});
    carousel.addEventListener("touchend",event=>{
      const distance=event.changedTouches[0].clientX-startX;
      if(Math.abs(distance)>50)moveDashboardSlide(distance<0?1:-1);
    },{passive:true});
  }
  if(dashboardEscapeHandler)document.removeEventListener("keydown",dashboardEscapeHandler);
  dashboardEscapeHandler=event=>{if(event.key==="Escape")closeDashboardPhoto()};
  document.addEventListener("keydown",dashboardEscapeHandler);
}
function goDashboardSlide(index){
  const slides=document.querySelectorAll(".xi-slide");
  const dots=document.querySelectorAll(".xi-dots button");
  if(!slides.length)return;
  dashboardSlideIndex=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle("active",i===dashboardSlideIndex));
  dots.forEach((dot,i)=>dot.classList.toggle("active",i===dashboardSlideIndex));
}
function moveDashboardSlide(direction){goDashboardSlide(dashboardSlideIndex+direction)}
function openDashboardPhoto(index){const src=dashboardPhotoFiles[index];if(src)showDashboardPhoto(src,`Momen XI-G ${index+1}`)}
function openDashboardMemory(index){const src=dashboardMemoryFiles[index];if(src)showDashboardPhoto(src,`Kenangan XI-G ${index+1}`)}
function showDashboardPhoto(src,caption){
  const viewer=document.getElementById("dashboardPhotoViewer");
  const image=document.getElementById("dashboardViewerImage");
  const text=document.getElementById("dashboardViewerCaption");
  if(!viewer||!image)return;
  image.src=src;
  if(text)text.textContent=caption||"";
  viewer.classList.add("show");
  document.body.classList.add("dashboard-viewer-open");
}
function closeDashboardPhoto(){
  document.getElementById("dashboardPhotoViewer")?.classList.remove("show");
  document.body.classList.remove("dashboard-viewer-open");
}
