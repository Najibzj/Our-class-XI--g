// Authoritative schedule data and weekday switching for the XI-G site.
(() => {
  const days = [
    { day: "Senin", emoji: "☀️", lessons: [["1", "Upacara Bendera", ""], ["2–3", "Bahasa Indonesia TL", "Asmiyah, S.Pd."], ["4–5", "Fisika", "Hj. Siti Asmah Khairiyah, M.Sc."], ["6–7", "Matematika TL", "Elsa Fujianah, S.Pd."], ["8–9", "Sejarah", "Ahmad Firdaus, S.Pd., M.Pd."], ["10–11", "Bahasa Inggris", "Husin, S.Pd.I."]] },
    { day: "Selasa", emoji: "🌤️", lessons: [["1", "Bahasa Indonesia TL", "Asmiyah, S.Pd."], ["2–3", "Matematika Umum", "Muzahir, S.Pd.I."], ["4–5", "Prakarya dan Kewirausahaan", "Norhayatun Novia, S.Pd."], ["6–7", "Bahasa Indonesia TL", "Asmiyah, S.Pd."], ["8–9", "Bahasa Indonesia", "Hasbi Wayhie, M.Pd."], ["10–11", "Matematika TL", "Elsa Fujianah, S.Pd."]] },
    { day: "Rabu", emoji: "🌿", lessons: [["1", "Mulok: Tahfiz", "Ruhana, S.Ag., M.Pd.I."], ["2", "Bahasa Indonesia", "Hasbi Wayhie, M.Pd."], ["3–4", "SKI", "Hj. Mutmainnah, S.Ag."], ["5", "Matematika TL", "Elsa Fujianah, S.Pd."], ["6–7", "Fisika", "Hj. Siti Asmah Khairiyah, M.Sc."], ["8–9", "Informatika", "Rahmatullah, S.Pd."], ["10–11", "Fikih", "Magdalena, S.Pd.I."]] },
    { day: "Kamis", emoji: "📚", lessons: [["1", "Informatika", "Rahmatullah, S.Pd."], ["2–3", "Bahasa Arab", "Tarhiyah, S.Pd.I."], ["4–5", "PJOK", "Muhammad Rifqi Rahman, S.Pd."], ["6–7", "Informatika", "Rahmatullah, S.Pd."], ["8–9", "Seni dan Budaya", "Faridah Muslimah, S.Pd."], ["10–11", "Qur'an Hadis", "Ruhana, S.Ag., M.Pd.I."]] },
    { day: "Jumat", emoji: "🌙", lessons: [["1", "Jumat Taqwa / Sehat", ""], ["2–3", "Pendidikan Pancasila", "Siti Masriah, S.Pd."], ["4", "Fisika", "Hj. Siti Asmah Khairiyah, M.Sc."], ["5", "Matematika Umum", "Muzahir, S.Pd.I."], ["6–8", "Istirahat Sholat Jumat", ""], ["9", "Akidah Akhlak", "H. Zahrani, S.Ag."]] }
  ];
  const colors = ["#e8e1f5", "#dce9f4", "#dcece3", "#f4e4d4", "#f7edc9", "#eadfe0"];

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  window.XIG_SCHEDULE_DAYS = days;
  window.scheduleDayContent = function scheduleDayContent(day, index = 0) {
    if (!day || !Array.isArray(day.lessons)) return '<div class="empty">Jadwal belum tersedia.</div>';
    return `<section class="schedule-day-panel">
      <div class="schedule-day-heading"><span>${escapeHtml(day.emoji)}</span><div><h3>${escapeHtml(day.day)}</h3><p>Jadwal pelajaran kelas XI-G</p></div></div>
      <div class="schedule-lesson-list">${day.lessons.map((lesson, i) => `<article class="schedule-lesson">
        <span class="schedule-period" style="background:${colors[i % colors.length]}">${escapeHtml(lesson[0])}</span>
        <div class="schedule-lesson-info"><b>${escapeHtml(lesson[1])}</b><small>${escapeHtml(lesson[2] || "Kegiatan kelas")}</small></div>
        <span class="schedule-lesson-star">✦</span>
      </article>`).join("")}</div>
    </section>`;
  };

  window.showScheduleDay = function showScheduleDay(index) {
    const day = days[index];
    const content = document.getElementById("scheduleDayContent");
    if (!day || !content) return;
    document.querySelectorAll(".schedule-day").forEach((button, i) => button.classList.toggle("selected", i === index));
    content.innerHTML = window.scheduleDayContent(day, index);
  };
})();
