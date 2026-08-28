(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPlaceholder = (val) => !val || String(val).trim().startsWith("(اكتب هنا");

  /* ============================================================
     INJECT CONTENT FROM content.js
     ============================================================ */
  function injectContent() {
    if (!isPlaceholder(content.meta.siteTitle)) document.title = content.meta.siteTitle;

    document.getElementById("opening-line1").textContent = content.opening.line1;
    document.getElementById("opening-line2").textContent = content.opening.line2;
    document.getElementById("enter-btn").textContent = content.opening.enterButton;

    document.getElementById("yesno-question").textContent = content.yesNo.question;
    document.getElementById("btn-yes").textContent = "YES";
    document.getElementById("btn-no").textContent = "NO";

    document.getElementById("memories-title").textContent = content.memories.sectionTitle;
    renderMemories();

    document.getElementById("music-title").textContent = content.music.sectionTitle;
    document.getElementById("music-song").textContent = content.music.songTitle;
    document.getElementById("music-artist").textContent = content.music.artist;
    document.getElementById("music-desc").textContent = content.music.description;
    if (!isPlaceholder(content.music.audioSrc)) {
      document.getElementById("audio-el").src = content.music.audioSrc;
    }

    document.getElementById("letters-title").textContent = content.letters.sectionTitle;
    document.getElementById("letter01-title").textContent = content.letters.letter01.title;
    document.getElementById("letter02-title").textContent = content.letters.letter02.title;

    document.getElementById("gift-title").textContent = content.gift.sectionTitle;
    document.getElementById("gift-message").textContent = content.gift.giftMessage;
    document.getElementById("gift-reveal-message").textContent = content.gift.giftRevealMessage;

    document.getElementById("final-intro").textContent = content.finalExperience.introText;
    document.getElementById("final-happy").textContent = content.finalExperience.happyBirthdayText;
    document.getElementById("final-msg-before-letter").textContent = content.finalExperience.messageBeforeLetter;
  }

  function renderMemories() {
    const grid = document.getElementById("memories-grid");
    grid.innerHTML = "";
    content.memories.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "memory-card";

      let photoHtml;
      if (isPlaceholder(item.photo)) {
        photoHtml = `<div class="memory-photo-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>
          </svg>
        </div>`;
      } else {
        photoHtml = `<img class="memory-photo" src="${item.photo}" alt="${isPlaceholder(item.caption) ? "" : item.caption}">`;
      }

      const locationHtml = isPlaceholder(item.location) ? "" : `<div class="memory-location">${item.location}</div>`;
      const dateHtml = isPlaceholder(item.date) ? "" : `<div class="memory-date">${item.date}</div>`;

      card.innerHTML = `
        ${photoHtml}
        <div class="memory-meta">
          ${dateHtml}
          ${locationHtml}
          <div class="memory-caption">${item.caption}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ============================================================
     SCROLL REVEAL FOR CHAPTERS
     ============================================================ */
  function setupScrollReveal() {
    const chapters = document.querySelectorAll(".chapter");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      chapters.forEach((c) => c.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    chapters.forEach((c) => io.observe(c));
  }

  /* ============================================================
     OPENING NIGHT SKY + EASTER EGG 1 (click big star 5x)
     ============================================================ */
  let bigStar = null;
  function setupStars() {
    const canvas = document.getElementById("stars-canvas");
    const ctx = canvas.getContext("2d");
    let stars = [];

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      buildStars();
    }

    function buildStars() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      stars = [];
      const count = Math.min(90, Math.floor((w * h) / 9000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          r: Math.random() * 1.4 + 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.008
        });
      }
      // the special big star for the easter egg, placed in upper area
      bigStar = { x: w * (0.25 + Math.random() * 0.5), y: h * (0.15 + Math.random() * 0.25), r: 3.4, clicks: 0 };
    }

    function draw(t) {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#FFF3F6";
      stars.forEach((s) => {
        const twinkle = prefersReducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (bigStar) {
        const pulse = prefersReducedMotion ? 1 : 0.7 + 0.3 * Math.sin(t * 0.03);
        ctx.save();
        ctx.shadowColor = "#B347D9";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#B347D9";
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(bigStar.x, bigStar.y, bigStar.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);

    canvas.addEventListener("click", (e) => {
      if (!bigStar) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const dist = Math.hypot(x - bigStar.x, y - bigStar.y);
      if (dist < 18) {
        bigStar.clicks++;
        if (bigStar.clicks >= 5) {
          showSecret(content.easterEggs.egg1);
          bigStar.clicks = 0;
        }
      }
    });
  }

  /* ============================================================
     FINAL CHAPTER — drifting warm glow orbs (distinct from stars/hearts)
     ============================================================ */
  function setupFinalGlow() {
    const canvas = document.getElementById("final-glow-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let orbs = [];
    const colors = ["255,77,129", "179,71,217", "255,182,217"]; // rose / violet / soft pink, as rgb triplets

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      buildOrbs();
    }

    function buildOrbs() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      orbs = [];
      const count = Math.min(16, Math.floor((w * h) / 26000));
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 3 + 2,
          color: colors[i % colors.length],
          speed: Math.random() * 0.18 + 0.06,
          sway: Math.random() * 20 + 10,
          phase: Math.random() * Math.PI * 2,
          baseX: 0
        });
        orbs[i].baseX = orbs[i].x;
      }
    }

    function draw(t) {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((o) => {
        o.y -= o.speed;
        if (o.y < -10) { o.y = h + 10; o.baseX = Math.random() * w; }
        const x = prefersReducedMotion ? o.baseX : o.baseX + Math.sin(t * 0.0006 + o.phase) * o.sway;
        const glow = prefersReducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 0.0018 + o.phase);
        ctx.save();
        ctx.shadowColor = `rgba(${o.color}, ${glow})`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `rgba(${o.color}, ${glow * 0.9})`;
        ctx.beginPath();
        ctx.arc(x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    if (prefersReducedMotion) {
      draw(0);
    } else {
      requestAnimationFrame(draw);
    }
  }

  /* ============================================================
     OPENING -> MAIN CONTENT TRANSITION (password gated)
     ============================================================ */
  function enterSite() {
    const opening = document.getElementById("opening");
    const main = document.getElementById("main-content");
    opening.style.transition = "opacity .7s ease";
    opening.style.opacity = "0";
    setTimeout(() => {
      opening.style.display = "none";
      main.hidden = false;
      setupScrollReveal();
    }, 700);
  }

  function setupEnter() {
    const form = document.getElementById("password-form");
    const input = document.getElementById("password-input");
    const errorEl = document.getElementById("password-error");
    const correct = String(content.opening.password || "").trim().toLowerCase();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (correct && val === correct) {
        enterSite();
        return;
      }
      errorEl.textContent = "الباسورد مش صح، جربي تاني 🔒";
      errorEl.classList.add("show");
      form.classList.remove("shake");
      void form.offsetWidth;
      form.classList.add("shake");
      input.value = "";
      input.focus();
    });
  }

  /* ============================================================
     YES / NO GAME
     ============================================================ */
  function setupYesNo() {
    const btnNo = document.getElementById("btn-no");
    const btnYes = document.getElementById("btn-yes");
    const container = document.querySelector(".yesno-buttons");
    const msgEl = document.getElementById("yesno-message");
    const successEl = document.getElementById("yesno-success");
    let noIndex = 0;
    let answered = false;

    function dodge() {
      if (answered) return;
      const rect = container.getBoundingClientRect();
      const btnRect = btnNo.getBoundingClientRect();
      const maxX = rect.width - btnRect.width;
      const maxY = rect.height - btnRect.height;
      const x = Math.random() * Math.max(maxX, 40) - maxX / 2;
      const y = Math.random() * Math.max(maxY, 20) - maxY / 2;
      btnNo.classList.add("dodging");
      btnNo.style.transform = `translate(${x}px, ${y}px)`;

      const messages = content.yesNo.noMessages;
      if (messages && messages.length) {
        msgEl.textContent = messages[noIndex % messages.length];
        msgEl.classList.remove("show");
        void msgEl.offsetWidth;
        msgEl.classList.add("show");
        noIndex++;
      }
    }

    btnNo.addEventListener("mouseenter", dodge);
    btnNo.addEventListener("click", (e) => { e.preventDefault(); dodge(); });
    btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });

    btnYes.addEventListener("click", () => {
      answered = true;
      btnNo.style.display = "none";
      successEl.textContent = content.yesNo.yesMessage;
      successEl.classList.add("show");
      burstSparkles();
    });
  }

  function burstSparkles() {
    if (prefersReducedMotion) return;
    const layer = document.getElementById("sparkle-layer");
    const colors = ["#FF4D81", "#B347D9", "#FFF3F6"];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("div");
      const size = Math.random() * 6 + 4;
      s.style.position = "absolute";
      s.style.left = "50%";
      s.style.top = "40%";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.borderRadius = "50%";
      s.style.background = colors[i % colors.length];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 220 + 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      s.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.22,.61,.36,1)" }
      );
      layer.appendChild(s);
      setTimeout(() => s.remove(), 1500);
    }
  }

  /* ============================================================
     MUSIC PLAYER
     ============================================================ */
  function setupMusic() {
    const btn = document.getElementById("play-btn");
    const icon = document.getElementById("play-icon");
    const audio = document.getElementById("audio-el");
    const fill = document.getElementById("music-bar-fill");
    let playing = false;

    const iconPlay = '<path d="M8 5v14l11-7z"/>';
    const iconPause = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

    btn.addEventListener("click", () => {
      if (isPlaceholder(content.music.audioSrc)) {
        btn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }],
          { duration: 250 }
        );
        return;
      }
      if (playing) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    });

    audio.addEventListener("play", () => { playing = true; icon.innerHTML = iconPause; });
    audio.addEventListener("pause", () => { playing = false; icon.innerHTML = iconPlay; });
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    });
    audio.addEventListener("ended", () => { fill.style.width = "0%"; });
  }

  /* ============================================================
     TYPEWRITER EFFECT (used by every letter)
     ============================================================ */
  const typewriter = { timer: null, token: 0 };

  function stopTypewriter() {
    clearTimeout(typewriter.timer);
    typewriter.token++;
  }

  function typeParagraphs(container, paragraphs) {
    stopTypewriter();
    const myToken = typewriter.token;
    container.innerHTML = "";

    if (prefersReducedMotion) {
      paragraphs.forEach((para) => {
        const p = document.createElement("p");
        p.textContent = para;
        container.appendChild(p);
      });
      return;
    }

    let pIndex = 0;
    let cIndex = 0;
    let currentP = null;

    function step() {
      if (myToken !== typewriter.token) return; // cancelled (modal closed / new letter opened)
      if (pIndex >= paragraphs.length) return;

      if (!currentP) {
        currentP = document.createElement("p");
        currentP.className = "typing";
        container.appendChild(currentP);
      }

      const para = paragraphs[pIndex];
      cIndex++;
      currentP.textContent = para.slice(0, cIndex);

      if (cIndex >= para.length) {
        currentP.classList.remove("typing");
        currentP = null;
        pIndex++;
        cIndex = 0;
        typewriter.timer = setTimeout(step, 420); // pause between paragraphs
      } else {
        typewriter.timer = setTimeout(step, 26); // typing speed
      }
    }
    step();
  }

  function openLetterModal(key) {
    const modal = document.getElementById("letter-modal");
    const titleEl = document.getElementById("letter-modal-title");
    const bodyEl = document.getElementById("letter-modal-body");
    const letter = content.letters[key];

    titleEl.textContent = letter.title;
    const paragraphs = String(letter.content).split("\n").filter((p) => p.trim().length);
    modal.classList.add("open");
    typeParagraphs(bodyEl, paragraphs);
  }

  /* ============================================================
     LETTERS MODAL + EASTER EGG 2 (double-click envelope 02)
     ============================================================ */
  function setupLetters() {
    const modal = document.getElementById("letter-modal");

    document.querySelectorAll(".envelope").forEach((env) => {
      env.addEventListener("click", () => openLetterModal(env.dataset.letter));
    });

    document.getElementById("letter-close").addEventListener("click", () => {
      modal.classList.remove("open");
      stopTypewriter();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        stopTypewriter();
      }
    });

    // easter egg 2: double-click on envelope 02
    const env02 = document.getElementById("envelope-02");
    env02.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      showSecret(content.easterEggs.egg2);
    });
  }

  /* ============================================================
     GIFT BOX + EASTER EGG 3 (long-press 2s before opening)
     ============================================================ */
  function setupGift() {
    const box = document.getElementById("gift-box");
    const progressRing = document.getElementById("gift-progress");
    const msgBox = document.getElementById("gift-message-box");
    let pressTimer = null;
    let pressStart = 0;
    let opened = false;
    let eggFired = false;

    function startPress() {
      if (opened) { revealGift(); return; }
      pressStart = Date.now();
      progressRing.style.transition = "opacity .1s linear";
      progressRing.style.opacity = "1";
      pressTimer = setTimeout(() => {
        eggFired = true;
        showSecret(content.easterEggs.egg3);
      }, 2000);
    }

    function endPress() {
      progressRing.style.opacity = "0";
      clearTimeout(pressTimer);
      const held = Date.now() - pressStart;
      if (!opened && !eggFired && held < 2000) {
        openGift();
      }
      eggFired = false;
    }

    function openGift() {
      opened = true;
      box.classList.add("opened");
      revealGift();
    }

    function revealGift() {
      msgBox.classList.add("show");
    }

    box.addEventListener("mousedown", startPress);
    box.addEventListener("mouseup", endPress);
    box.addEventListener("mouseleave", () => { clearTimeout(pressTimer); progressRing.style.opacity = "0"; });
    box.addEventListener("touchstart", (e) => { e.preventDefault(); startPress(); }, { passive: false });
    box.addEventListener("touchend", (e) => { e.preventDefault(); endPress(); }, { passive: false });
  }

  /* ============================================================
     FINAL EXPERIENCE SEQUENCE
     ============================================================ */
  function setupFinal() {
    document.querySelectorAll(".final-next-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextId = btn.dataset.next;
        document.querySelectorAll(".final-step").forEach((s) => s.classList.remove("active"));
        document.getElementById(nextId).classList.add("active");
        if (nextId === "final-step-2") launchConfetti();
      });
    });

    document.getElementById("open-final-letter-btn").addEventListener("click", () => {
      openLetterModal("finalLetter");
    });
  }

  function launchConfetti() {
    if (prefersReducedMotion) return;
    const layer = document.getElementById("confetti-layer");
    const colors = ["#FF4D81", "#B347D9", "#FFF3F6", "#E01464"];
    for (let i = 0; i < 46; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = 2.4 + Math.random() * 1.8 + "s";
      piece.style.animationDelay = Math.random() * 0.6 + "s";
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  /* ============================================================
     SECRET MODAL (shared by all easter eggs)
     ============================================================ */
  function showSecret(message) {
    const modal = document.getElementById("secret-modal");
    document.getElementById("secret-text").textContent = message;
    modal.classList.add("open");
  }
  function setupSecretModal() {
    const modal = document.getElementById("secret-modal");
    document.getElementById("secret-close").addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    injectContent();
    setupStars();
    setupFinalGlow();
    setupEnter();
    setupYesNo();
    setupMusic();
    setupLetters();
    setupGift();
    setupFinal();
    setupSecretModal();
  });
})();
