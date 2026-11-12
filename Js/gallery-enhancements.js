/* Gallery page: Instagram feed + scrapbook albums + clean class memory board. */
(function () {
  let albumFilter = "all";
  let showPhotoActions = true;
  const reactionStorageKey = "our-class-xig-gallery-reactions";

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function loadReactions() {
    try { return JSON.parse(localStorage.getItem(reactionStorageKey) || "{}"); }
    catch (_) { return {}; }
  }

  function saveReactions(reactions) {
    try { localStorage.setItem(reactionStorageKey, JSON.stringify(reactions)); }
    catch (_) { /* Keep reactions usable for this page view if storage is unavailable. */ }
  }

  function photoKey(photo) {
    const value = `${photo.name || ""}|${photo.src || ""}`;
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  window.gallery = function () {
    const frames = [["classic", "Klasik"], ["polaroid", "Polaroid"], ["coffee", "Cokelat"], ["film", "Film"], ["soft", "Lembut"]];
    const albums = [...new Set(data.gallery.map(photo => photo.album || "Kenangan XI-G"))];
    const photos = data.gallery.map((photo, index) => ({ photo, index }))
      .filter(({ photo }) => albumFilter === "all" || (photo.album || "Kenangan XI-G") === albumFilter);
    const reactions = loadReactions();
    const isChair = role === "ketua";

    return `
      <section class="gallery-page ${showPhotoActions ? "" : "gallery-actions-hidden"}">
        <header class="gallery-hero">
          <div class="gallery-hero-glow"></div>
          <div class="gallery-hero-content"><span class="gallery-eyebrow">✦ OUR CLASS · XI-G</span><h2>Potongan Cerita Kita</h2><p>Simpan momen kecil yang akan jadi kenangan besar.</p></div>
          <div class="gallery-hero-stat"><strong>${data.gallery.length}</strong><span>kenangan</span></div>
        </header>

        <details class="gallery-upload-details">
          <summary class="gallery-upload-summary"><span class="gallery-upload-summary-icon">＋</span><span><small>BAGIKAN MOMEN</small><strong>Tambah foto ke album</strong></span><span class="gallery-summary-chevron" aria-hidden="true">⌄</span></summary>
          <section class="gallery-upload panel">
            <div class="gallery-form-grid">
              <label class="gallery-field gallery-field-wide">Pilih foto<input id="galleryFiles" type="file" accept="image/*" multiple></label>
              <label class="gallery-field">Pilih album<select id="galleryAlbumMode" onchange="toggleNewGalleryAlbum()"><option value="new">＋ Buat album baru</option>${albums.map(album => `<option value="existing:${escapeHTML(album)}">Tambahkan ke: ${escapeHTML(album)}</option>`).join("")}</select></label>
              <label class="gallery-field gallery-new-album-field" id="galleryNewAlbumField">Nama album baru<input id="galleryNewAlbum" type="text" maxlength="60" placeholder="Contoh: Class Meeting"></label>
              <label class="gallery-field">Bingkai foto<select id="galleryFrame">${frames.map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}</select></label>
              <label class="gallery-field gallery-field-wide">Caption foto<textarea id="galleryCaptionInput" rows="2" maxlength="220" placeholder="Tulis cerita singkat tentang foto ini…"></textarea></label>
            </div>
            <div class="gallery-upload-footer"><span class="gallery-hint">Pilih album baru atau tambahkan foto ke album yang sudah ada.</span><button class="primary gallery-add-button" onclick="uploadGalleryPhotos()">📸 Tambahkan ke album</button></div>
          </section>
        </details>

        <div class="gallery-album-bar"><div><span class="gallery-section-kicker">KOLEKSI KELAS</span><h3>Album kenangan</h3></div>
          <label class="gallery-album-select">Pilih album<select onchange="setGalleryAlbum(this.value)">
            <option value="all" ${albumFilter === "all" ? "selected" : ""}>Semua album (${data.gallery.length})</option>
            ${albums.map(album => `<option value="${escapeHTML(album)}" ${albumFilter === album ? "selected" : ""}>${escapeHTML(album)} (${data.gallery.filter(photo => (photo.album || "Kenangan XI-G") === album).length})</option>`).join("")}
          </select></label>
        </div>
        <div class="gallery-display-tools"><span>${photos.length} foto${albumFilter === "all" ? "" : ` · ${escapeHTML(albumFilter)}`}</span><button class="gallery-toggle-actions" onclick="toggleGalleryActions()" aria-label="Tampilkan atau sembunyikan aksi foto" aria-pressed="${showPhotoActions}" title="Tampilkan atau sembunyikan aksi foto">=</button></div>

        ${photos.length ? `<div class="gallery-grid gallery-instagram-grid">${photos.map(({ photo, index }) => {
          const reaction = reactions[photoKey(photo)] || { like: 0, dislike: 0, mine: "" };
          return `
          <article class="gallery-card gallery-instagram-card ${escapeHTML(photo.frame || "classic")}">
            <button class="gallery-image-button" onclick="viewGalleryPhoto(${index})" aria-label="Lihat foto ${escapeHTML(photo.caption || photo.name)}"><img src="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.caption || photo.name)}"><span class="gallery-image-overlay"><span>⌕</span> Lihat kenangan</span></button>
            <div class="gallery-post-caption"><span class="gallery-album-chip">▣ ${escapeHTML(photo.album || "Kenangan XI-G")}</span><p>${escapeHTML(photo.caption || photo.name || "Momen XI-G")}</p>${photo.caption ? `<small class="gallery-file-name">${escapeHTML(photo.name)}</small>` : ""}</div>
            <div class="gallery-reactions"><button class="gallery-reaction ${reaction.mine === "like" ? "selected" : ""}" onclick="reactToGalleryPhoto(${index},'like')" aria-pressed="${reaction.mine === "like"}" aria-label="Suka">👍 <span>${reaction.like || 0}</span></button><button class="gallery-reaction ${reaction.mine === "dislike" ? "selected" : ""}" onclick="reactToGalleryPhoto(${index},'dislike')" aria-pressed="${reaction.mine === "dislike"}" aria-label="Tidak suka">👎 <span>${reaction.dislike || 0}</span></button></div>
            <div class="gallery-caption-actions"><button class="action" onclick="changeGalleryFrame(${index})">Bingkai</button>${isChair ? `<button class="action danger" onclick="deleteGalleryPhoto(${index})">Hapus</button>` : ""}</div>
          </article>`;
        }).join("")}</div>` : `<div class="gallery-empty-state"><span>📷</span><h3>${data.gallery.length ? "Album ini belum punya foto" : "Album pertama menunggu cerita"}</h3><p>${data.gallery.length ? "Pilih album lain atau tambahkan foto baru." : "Buka panel tambah foto untuk membuat album dan mengunggah kenangan kelas."}</p></div>`}

        <div id="galleryViewer" class="gallery-viewer hidden" onclick="if(event.target===this)closeGalleryViewer()"><button class="gallery-close" onclick="closeGalleryViewer()" aria-label="Tutup foto">✕</button><div class="gallery-viewer-content"><img id="galleryLargeImage" src="" alt="Foto kenangan XI-G"><p id="galleryViewerCaption"></p></div></div>
      </section>`;
  };

  window.setGalleryAlbum = album => { albumFilter = album; render(); };
  window.toggleGalleryActions = () => { showPhotoActions = !showPhotoActions; render(); };
  window.toggleNewGalleryAlbum = function () {
    const mode = $("#galleryAlbumMode")?.value || "new";
    const field = $("#galleryNewAlbumField");
    if (field) field.hidden = mode !== "new";
  };

  window.uploadGalleryPhotos = function () {
    const input = $("#galleryFiles");
    const files = [...(input?.files || [])].filter(file => file.type.startsWith("image/"));
    if (!files.length) { alert("Pilih satu atau beberapa foto terlebih dahulu."); return; }
    const mode = $("#galleryAlbumMode").value;
    const album = mode.startsWith("existing:")
      ? mode.slice("existing:".length)
      : $("#galleryNewAlbum").value.trim();
    if (!album) { alert("Masukkan nama album baru terlebih dahulu."); $("#galleryNewAlbum").focus(); return; }
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

  window.reactToGalleryPhoto = function (index, type) {
    const photo = data.gallery[index];
    if (!photo || !["like", "dislike"].includes(type)) return;
    const reactions = loadReactions();
    const key = photoKey(photo);
    const current = reactions[key] || { like: 0, dislike: 0, mine: "" };
    if (current.mine === type) {
      current[type] = Math.max(0, (current[type] || 0) - 1);
      current.mine = "";
    } else {
      if (current.mine) current[current.mine] = Math.max(0, (current[current.mine] || 0) - 1);
      current[type] = (current[type] || 0) + 1;
      current.mine = type;
    }
    reactions[key] = current;
    saveReactions(reactions);
    render();
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
    if (role !== "ketua") { alert("Hanya Ketua yang dapat menghapus foto."); return; }
    if (!confirm("Hapus foto kenangan ini?")) return;
    data.gallery.splice(index, 1);
    render();
  };
})();
