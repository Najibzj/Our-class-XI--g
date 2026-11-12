/* Add the Fashion Show Day photo to the dashboard carousel. */
(function () {
  const photoPath = "aset/Fashion%20show.jpg";
  const photoIndex = dashboardPhotoFiles.length;
  dashboardPhotoFiles.push(photoPath);

  const originalOpenDashboardPhoto = window.openDashboardPhoto;
  window.openDashboardPhoto = function (index) {
    if (index === photoIndex) {
      showDashboardPhoto(photoPath, "Fashion Show Day");
      return;
    }
    originalOpenDashboardPhoto(index);
  };

  const originalDashboard = window.dashboard;
  window.dashboard = function (...args) {
    const markup = originalDashboard.apply(this, args);
    window.setTimeout(() => {
      const carousel = document.getElementById("dashboardCarousel");
      const dots = document.getElementById("dashboardDots");
      if (!carousel || !dots || carousel.querySelector(`[data-index="${photoIndex}"]`)) return;

      const slide = document.createElement("div");
      slide.className = "xi-slide";
      slide.dataset.index = String(photoIndex);
      slide.onclick = () => openDashboardPhoto(photoIndex);
      slide.innerHTML = `<img src="${photoPath}" alt="Fashion Show Day" onerror="this.style.display='none'"><div class="xi-slide-caption"><strong>Fashion Show Day</strong><small></small></div>`;
      carousel.appendChild(slide);

      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Foto " + (photoIndex + 1));
      dot.onclick = () => goDashboardSlide(photoIndex);
      dots.appendChild(dot);
      goDashboardSlide(dashboardSlideIndex);
    }, 0);
    return markup;
  };
})();
