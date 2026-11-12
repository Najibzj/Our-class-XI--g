/* Gallery page: Instagram feed + scrapbook albums + clean class memory board. */
(function () {
  let albumFilter = "all";
  let showPhotoActions = true;

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  window.gallery = function () {
    const frames = [["classic", "Klasik"], ["polaroid", "Polaroid"], ["coffee", "Cokelat"], ["film", "Film"], ["soft", "Lembut"]];
    const albums = [...new Set(data.gallery.map(photo => photo.album || "Kenangan XI-G"))];
    const photos = data.gallery.map((photo, index) => ({ photo, index }))
      .filter(({ photo }) => albumFilter === "all" || (photo.album || "Kenangan XI-G") === albumFilter);

    return `
      <section class="gallery-page ${showPhotoActions ? "" : "gallery-actions-hidden"}">
        <header class="gallery-hero">
          <div class="gallery-hero-glow"></div>
          <div class="gallery-hero-content"><span class="gallery-eyebrow">✦ OUR CLASS · XI-G</span><h2>Potongan Cerita Kita</h2><p>Simpan momen kecil yang akan jadi kenangan besar.</p></div>
          <div class="gallery-hero-stat"><strong>${data.gallery.length}</strong><span>kenangan</span></div>
        </header>

        <section class="gallery-upload panel">
          <div class="gallery-upload-heading"><div><span class="gallery-section-kicker">BAGIKAN MOMEN</span><h2>Tambah foto ke album</h2></div><span class="gallery-upload-icon">＋</span></div>
          <div class="gallery-form-grid">
            <label class="gallery-field gallery-field-wide">Pilih foto<input id="galleryFiles" type="file" accept="image/*" multiple></label>
            <label class="gallery-field">Nama album<input id="galleryAlbum" type="text" maxlength="60" placeholder="Contoh: Class Meeting"></label>
            <label class="gallery-field">Bingkai foto<select id="galleryFrame">${frames.map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}</select></label>
            <label class="gallery-field gallery-field-wide">Caption foto<textarea id="galleryCaptionInput" rows="2" maxlength="220" placeholder="Tulis cerita singkat tentang foto ini…"></textarea></label>
          </div>
          <div class="gallery-upload-footer"><span class="gallery-hint">Nama album dan caption akan dipakai untuk semua foto yang dipilih.</span><button class="primary gallery-add-button" onclick="uploadGalleryPhotos()">📸 Tambahkan ke album</button></div>
        </section>

        <div class="gallery-album-bar"><div><span class="gallery-section-kicker">KOLEKSI KELAS</span><h3>Album kenangan</h3></div>
          <label class="gallery-album-select">Pilih album<select onchange="setGalleryAlbum(this.value)">
            <option value="all" ${albumFilter === "all" ? "selected" : ""}>Semua album (${data.gallery.length})</option>
            ${albums.map(album => `<option value="${escapeHTML(album)}" ${albumFilter === album ? "selected" : ""}>${escapeHTML(album)} (${data.gallery.filter(photo => (photo.album || "Kenangan XI-G") === album).length})</option>`).join("")}
          </select></label>
        </div>
        <div class="gallery-display-tools"><span>${photos.length} foto${albumFilter === "all" ? "" : ` · ${escapeHTML(albumFilter)}`}</span><button class="gallery-toggle-actions" onclick="toggleGalleryActions()" aria-pressed="${showPhotoActions}">${showPhotoActions ? "🙈 Sembunyikan tombol foto" : "👁️ Tampilkan tombol foto"}</button></div>

        ${photos.length ? `<div class="gallery-grid gallery-instagram-grid">${photos.map(({ photo, index }) => `
          <article class="gallery-card gallery-instagram-card ${escapeHTML(photo.frame || "classic")}">
            <button class="gallery-image-button" onclick="viewGalleryPhoto(${index})" aria-label="Lihat foto ${escapeHTML(photo.caption || photo.name)}"><img src="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.caption || photo.name)}"><span class="gallery-image-overlay"><span>⌕</span> Lihat kenangan</span></button>
            <div class="gallery-post-caption"><span class="gallery-album-chip">▣ ${escapeHTML(photo.album || "Kenangan XI-G")}</span><p>${escapeHTML(photo.caption || photo.name || "Momen XI-G")}</p>${photo.caption ? `<small class="gallery-file-name">${escapeHTML(photo.name)}</small>` : ""}</div>
            <div class="gallery-caption-actions"><button class="action" onclick="changeGalleryFrame(${index})">Bingkai</button><button class="action danger" onclick="deleteGalleryPhoto(${index})">Hapus</button></div>
          </article>`).join("")}</div>` : `<div class="gallery-empty-state"><span>📷</span><h3>${data.gallery.length ? "Album ini belum punya foto" : "Album pertama menunggu cerita"}</h3><p>${data.gallery.length ? "Pilih album lain atau tambahkan foto baru." : "Pilih foto, beri nama album, lalu tambahkan caption untuk membagikan momen kelas."}</p></div>`}

        <div id="galleryViewer" class="gallery-viewer hidden" onclick="if(event.target===this)closeGalleryViewer()"><button class="gallery-close" onclick="closeGalleryViewer()" aria-label="Tutup foto">✕</button><div class="gallery-viewer-content"><img id="galleryLargeImage" src="" alt="Foto kenangan XI-G"><p id="galleryViewerCaption"></p></div></div>
      </section>`;
  };

  window.setGalleryAlbum = album => { albumFilter = album; render(); };
  window.toggleGalleryActions = () => { showPhotoActions = !showPhotoActions; render(); };

  window.uploadGalleryPhotos = function () {
    const input = $("#galleryFiles");
    const files = [...(input?.files || [])].filter(file => file.type.startsWith("image/"));
    if (!files.length) { alert("Pilih satu atau beberapa foto terlebih dahulu."); return; }
    const album = $("#galleryAlbum").value.trim() || "Kenangan XI-G";
    const caption = $("#galleryCaptionInput").value.trim();
    const frame = $("#galleryFrame").value;
    let completed = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        data.gallery.unshift({ src: reader.result, name: file.name, frame, album, caption });
        completed++;
        if (completed === files.length) { albumFilter = album; render(); }
      };
      reader.onerror = () => {
        completed++;
        if (completed === files.length) { alert("Sebagian foto tidak dapat dibaca. Coba pilih file tersebut lagi."); render(); }
      };
      reader.readAsDataURL(file);
    });
  };

  window.changeGalleryFrame = function (index) {
    const frames = ["classic", "polaroid", "coffee", "film", "soft"];
    const current = frames.indexOf(data.gallery[index]?.frame);
    if (current < 0) return;
    data.gallery[index].frame = frames[(current + 1) % frames.length];
    render();
  };
  window.viewGalleryPhoto = function (index) {
    const photo = data.gallery[index], viewer = $("#galleryViewer");
    if (!photo || !viewer) return;
    $("#galleryLargeImage").src = photo.src;
    $("#galleryViewerCaption").textContent = photo.caption || photo.name || "Kenangan XI-G";
    viewer.classList.remove("hidden");
  };
  window.closeGalleryViewer = () => $("#galleryViewer")?.classList.add("hidden");
  window.deleteGalleryPhoto = function (index) {
    if (!confirm("Hapus foto kenangan ini?")) return;
    data.gallery.splice(index, 1);
    render();
  };
})();
