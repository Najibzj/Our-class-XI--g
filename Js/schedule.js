// Jadwal pelajaran XI-G: render and switch the selected weekday.
(() => {
  const colors = ["#e8e1f5", "#dce9f4", "#dcece3", "#f4e4d4", "#f7edc9", "#eadfe0"];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  window.scheduleDayContent = function scheduleDayContent(day) {
    if (!day || !Array.isArray(day.lessons)) return "<div class=\"empty\">Jadwal belum tersedia.</div>";

    return `<section class="schedule-day-panel">
      <div class="schedule-day-heading">
        <span>${escapeHtml(day.emoji)}</span>
        <div><h3>${escapeHtml(day.day)}</h3><p>Jadwal pelajaran kelas XI-G</p></div>
      </div>
      <div class="schedule-lesson-list">
        ${day.lessons.map((lesson, index) => `<article class="schedule-lesson">
          <span class="schedule-period" style="background:${colors[index % colors.length]}">${escapeHtml(lesson[0])}</span>
          <div class="schedule-lesson-info"><b>${escapeHtml(lesson[1])}</b><small>${escapeHtml(lesson[2] || "Kegiatan kelas")}</small></div>
          <span class="schedule-lesson-star">✦</span>
        </article>`).join("")}
      </div>
    </section>`;
  };

  window.showScheduleDay = function showScheduleDay(index) {
    const days = window.XIG_SCHEDULE_DAYS;
    const day = Array.isArray(days) ? days[index] : null;
    const content = document.getElementById("scheduleDayContent");
    if (!day || !content) return;

    document.querySelectorAll(".schedule-day").forEach((button, buttonIndex) => {
      button.classList.toggle("selected", buttonIndex === index);
    });
    content.innerHTML = window.scheduleDayContent(day);
  };
})();
