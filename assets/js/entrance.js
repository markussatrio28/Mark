(() => {
  const EXPERIENCE = {
    accessPin: '300126',
    puzzleImage: './assets/images/memories/puzzle.jpeg',
    gridSize: 3,
    memories: [
      { image: './assets/images/memories/1.jpeg', photo: 'Momen 01', date: 'Momen 1', story: 'Momen indah bareng kamu.' },
      { image: './assets/images/memories/2.jpeg', photo: 'Momen 02', date: 'Momen 2', story: 'Setiap detik bersamamu selalu berarti.' },
      { image: './assets/images/memories/3.jpeg', photo: 'Momen 03', date: 'Momen 3', story: 'Tawa dan senyummu yang selalu bikin bahagia.' },
      { image: './assets/images/memories/4.jpeg', photo: 'Momen 04', date: 'Momen 4', story: 'Semoga kita selalu bareng terus ya sayang!' },
    ],
    memoryPlaybackMs: 5200,
  };

  const opening = document.querySelector('#opening');
  const openingFrame = document.querySelector('.opening-frame');
  const card = document.querySelector('.lock-card');
  const display = document.querySelector('#pinDisplay');
  const status = document.querySelector('#pinStatus');
  const birthdayReveal = document.querySelector('#birthdayReveal');
  const cosmicJourneyBackdrop = document.querySelector('#cosmicJourneyBackdrop');
  const birthdayTitle = document.querySelector('#birthdayTitle');
  const puzzlePage = document.querySelector('#puzzlePage');
  const heartStage = document.querySelector('.heart-stage');
  const memoryPage = document.querySelector('#memoryPage');
  const memoryContinue = document.querySelector('#memoryContinue');
  const finalePage = document.querySelector('#finalePage');
  const loveRain = document.querySelector('#loveRain');
  const finaleMusicToggle = document.querySelector('#finaleMusicToggle');
  const finaleMusicLabel = document.querySelector('#finaleMusicLabel');
  const keys = [...document.querySelectorAll('.key')];
  const dots = [...display.querySelectorAll('.pin-group i')];
  const morphPuzzle = document.querySelector('#morphPuzzle');
  const birthdayCopy = [...document.querySelectorAll('.birthday-eyebrow, .birthday-title, .birthday-wish, .birthday-signoff')];
  const heart3d = document.querySelector('.heart-3d');
  const heartOrnaments = [...document.querySelectorAll('.heart-orbit, .heart-star-orbit, .heart-aura')];
  const puzzleBoard = document.querySelector('#puzzleBoard');
  const puzzleStatus = document.querySelector('#puzzleStatus');
  const puzzleProgress = document.querySelector('#puzzleProgress');
  const shuffleButton = document.querySelector('#shufflePuzzle');
  const letterArea = document.querySelector('#letterArea');
  const letterButton = document.querySelector('#openLetter');
  const letterLabel = document.querySelector('#letterLabel');
  const letterPaper = document.querySelector('#letterPaper');
  const memoryTrack = document.querySelector('#memoryTrack');
  const memoryWindow = document.querySelector('#memoryWindow');
  const memoryCounter = document.querySelector('#memoryCounter');
  const memoryDate = document.querySelector('#memoryDate');
  const memoryStory = document.querySelector('#memoryStory');
  const memoryCaption = document.querySelector('.memory-caption');
  const memoryPrevious = document.querySelector('#memoryPrevious');
  const memoryNext = document.querySelector('#memoryNext');
  const memoryPlay = document.querySelector('#memoryPlay');
  const reelWheel = document.querySelector('#reelWheel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 699px)').matches;

  let entered = '';
  let unlocked = false;
  let pageTwoActive = false;
  let scrollFrame = 0;
  let selectedPiece = null;
  let moves = 0;
  let puzzleSolved = false;
  let letterCloseTimer = 0;
  let order = [];
  let memoryIndex = 0;
  let memoryAngle = 0;
  let memoryPlayback = 0;
  let memoryPointerStart = null;
  let finaleAudio = null;
  let finaleMusicPlaying = false;
  let finaleIsVisible = false;
  let loveRainTimer = 0;
  let paperConfettiTimer = 0;
  const viewedMemories = new Set([0]);
  let memoriesCompleted = false;

  function renderPin() {
    dots.forEach((dot, index) => dot.classList.toggle('filled', index < entered.length));
    const announced = entered.length ? `${entered.length} dari 6 angka dimasukkan` : 'PIN kosong';
    display.setAttribute('aria-label', announced);
  }

  function setStatus(message, kind = '') {
    status.textContent = message;
    status.classList.toggle('is-error', kind === 'error');
    status.classList.toggle('is-success', kind === 'success');
  }

  function updateMusicButton(playing) {
    finaleMusicPlaying = playing;
    finaleMusicToggle.setAttribute('aria-pressed', String(playing));
    finaleMusicToggle.setAttribute('aria-label', playing ? 'Matikan musik' : 'Putar musik');
    finaleMusicLabel.textContent = playing ? 'Matikan musik' : 'Putar musik';
  }

  function startFinaleMusic() {
    if (finaleMusicPlaying) return;

    if (!finaleAudio) {
      finaleAudio = new Audio('./assets/audio/my-love.mp3');
      finaleAudio.loop = false;
      finaleAudio.volume = 0.45;
      finaleAudio.addEventListener('ended', () => {
        updateMusicButton(false);
        stopLoveRain();
      });
      finaleAudio.addEventListener('error', () => updateMusicButton(false));
    }

    finaleAudio.currentTime = 0;
    finaleAudio.play().then(() => {
      updateMusicButton(true);
      startLoveRain();
    }).catch(() => {
      updateMusicButton(false);
    });
  }

  function stopFinaleMusic() {
    if (finaleAudio) {
      finaleAudio.pause();
      finaleAudio.currentTime = 0;
    }
    updateMusicButton(false);
    stopLoveRain();
  }

  function spawnLoveHeart(delay = 0) {
    const maxHearts = isMobile ? 8 : 18;
    if (reduceMotion.matches || loveRain.childElementCount >= maxHearts) return;
    const heart = document.createElement('span');
    heart.className = 'love-rain-heart';
    heart.textContent = '💜';
    heart.style.setProperty('--love-left', `${Math.random() * 94 + 3}%`);
    heart.style.setProperty('--love-size', `${(isMobile ? 12 : 14) + Math.random() * (isMobile ? 8 : 12)}px`);
    heart.style.setProperty('--love-duration', `${7.5 + Math.random() * 3.5}s`);
    heart.style.setProperty('--love-delay', `${delay}ms`);
    heart.style.setProperty('--love-drift', `${Math.round((Math.random() - .5) * 54)}px`);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    loveRain.append(heart);
  }

  function startLoveRain() {
    stopLoveRain();
    if (reduceMotion.matches) return;
    const burstCount = isMobile ? 5 : 11;
    for (let index = 0; index < burstCount; index += 1) spawnLoveHeart(index * 170);
    const interval = isMobile ? 1400 : 850;
    loveRainTimer = window.setInterval(() => {
      spawnLoveHeart();
      if (!isMobile && Math.random() > .55) spawnLoveHeart(220);
    }, interval);
  }

  function stopLoveRain() {
    window.clearInterval(loveRainTimer);
    loveRainTimer = 0;
    loveRain.replaceChildren();
  }

  function createPaperPopperConfetti() {
    if (reduceMotion.matches) return;
    window.clearTimeout(paperConfettiTimer);
    document.querySelector('.paper-confetti-burst')?.remove();
    const burst = document.createElement('div');
    burst.className = 'paper-confetti-burst';
    burst.setAttribute('aria-hidden', 'true');
    const bounds = letterPaper.getBoundingClientRect();
    const launchY = bounds.top + Math.min(104, bounds.height * .28);

    const piecesPerSide = isMobile ? 10 : 18;
    for (let side = 0; side < 2; side += 1) {
      for (let index = 0; index < piecesPerSide; index += 1) {
        const piece = document.createElement('i');
        const direction = side === 0 ? 1 : -1;
        piece.className = 'paper-confetti-piece';
        piece.style.left = `${side === 0 ? bounds.left + 8 : bounds.right - 8}px`;
        piece.style.top = `${launchY + (Math.random() - .5) * 50}px`;
        piece.style.setProperty('--pop-x', `${direction * (40 + Math.random() * Math.min(220, window.innerWidth * .45))}px`);
        piece.style.setProperty('--pop-y', `${-140 + Math.random() * 260}px`);
        piece.style.setProperty('--pop-spin', `${Math.round((Math.random() - .5) * 720)}deg`);
        piece.style.setProperty('--pop-delay', `${Math.round(Math.random() * 150)}ms`);
        burst.append(piece);
      }
    }

    document.body.append(burst);
    paperConfettiTimer = window.setTimeout(() => burst.remove(), 2400);
  }

  function enterFinale() {
    finaleIsVisible = true;
    finalePage.classList.add('is-entered');
  }

  function leaveFinale() {
    finaleIsVisible = false;
    stopLoveRain();
    stopFinaleMusic();
  }

  function openBirthday() {
    if (reduceMotion.matches) {
      openingFrame.hidden = true;
      birthdayReveal.hidden = false;
      puzzlePage.hidden = false;
      memoryPage.hidden = false;
      opening.classList.add('is-page-two');
      cosmicJourneyBackdrop.classList.add('is-active');
      birthdayReveal.classList.add('is-visible');
      pageTwoActive = true;
      puzzlePage.classList.remove('is-heart-transitioning', 'is-puzzle-arrived');
      birthdayTitle.focus({ preventScroll: true });
      updateScrollMorph();
      return;
    }

    const cardBounds = card.getBoundingClientRect();
    const lockBounds = card.querySelector('.lock-emblem').getBoundingClientRect();
    const portal = opening.querySelector('.door-portal');
    const portalWidth = portal.offsetWidth;
    const portalHeight = portal.offsetHeight;
    opening.style.setProperty('--portal-offset-x', `${cardBounds.left + cardBounds.width / 2 - window.innerWidth / 2}px`);
    opening.style.setProperty('--portal-offset-y', `${cardBounds.top + cardBounds.height / 2 - window.innerHeight / 2}px`);
    opening.style.setProperty('--portal-scale-x', cardBounds.width / portalWidth);
    opening.style.setProperty('--portal-scale-y', cardBounds.height / portalHeight);
    card.style.setProperty('--lock-drop', `${cardBounds.height / 2 - (lockBounds.top + lockBounds.height / 2 - cardBounds.top)}px`);
    opening.classList.add('is-transitioning');

    window.setTimeout(() => {
      opening.classList.add('is-lock-descending');
    }, 260);

    window.setTimeout(() => {
      opening.classList.add('is-door-growing');
    }, 850);

    window.setTimeout(() => {
      opening.classList.add('is-key-turned');
    }, 1320);

    window.setTimeout(() => {
      opening.classList.add('is-door-open');
    }, 1850);

    window.setTimeout(() => {
      openingFrame.classList.add('is-departing');
      opening.classList.add('is-entering-portal');
    }, 2760);

    window.setTimeout(() => {
      birthdayReveal.hidden = false;
      puzzlePage.hidden = false;
      memoryPage.hidden = false;
      requestAnimationFrame(() => birthdayReveal.classList.add('is-visible', 'is-portal-arrival'));
    }, 3600);

    window.setTimeout(() => {
      openingFrame.hidden = true;
      opening.classList.remove('is-transitioning', 'is-lock-descending', 'is-door-growing', 'is-key-turned', 'is-door-open', 'is-entering-portal');
      opening.classList.add('is-page-two');
      cosmicJourneyBackdrop.classList.add('is-active');
      pageTwoActive = true;
      puzzlePage.classList.toggle('is-heart-transitioning', !reduceMotion.matches);
      birthdayTitle.focus({ preventScroll: true });
      updateScrollMorph();
    }, 5500);
  }

  function submitPin() {
    if (entered === EXPERIENCE.accessPin) {
      unlocked = true;
      opening.classList.add('is-unlocked');
      setStatus('PIN benar.', 'success');
      keys.forEach((key) => { key.disabled = true; });
      openBirthday();
      return;
    }

    entered = '';
    renderPin();
    setStatus('Belum cocok. Coba lagi.', 'error');
    card.classList.remove('is-shaking');
    requestAnimationFrame(() => card.classList.add('is-shaking'));
    window.setTimeout(() => card.classList.remove('is-shaking'), 460);
  }

  function addDigit(digit) {
    if (unlocked || entered.length >= EXPERIENCE.accessPin.length) return;
    entered += digit;
    status.classList.remove('is-error');
    renderPin();
    if (entered.length === EXPERIENCE.accessPin.length) submitPin();
  }

  function removeDigit() {
    if (unlocked) return;
    entered = entered.slice(0, -1);
    renderPin();
    setStatus('6 angka · format tanggal');
  }

  function clearPin() {
    if (unlocked) return;
    entered = '';
    renderPin();
    setStatus('6 angka · format tanggal');
  }

  function makeMorphedTiles() {
    for (let id = 0; id < EXPERIENCE.gridSize ** 2; id += 1) {
      const tile = document.createElement('span');
      const row = Math.floor(id / EXPERIENCE.gridSize);
      const column = id % EXPERIENCE.gridSize;
      tile.className = 'morph-tile';
      tile.style.backgroundImage = `url("${EXPERIENCE.puzzleImage}")`;
      tile.style.backgroundSize = `${EXPERIENCE.gridSize * 100}% ${EXPERIENCE.gridSize * 100}%`;
      tile.style.backgroundPosition = `${column * 50}% ${row * 50}%`;
      tile.setAttribute('aria-hidden', 'true');
      morphPuzzle.append(tile);
    }
  }

  const puzzleTiles = new Map();

  function makePuzzleTiles() {
    for (let id = 0; id < EXPERIENCE.gridSize ** 2; id += 1) {
      const tile = document.createElement('button');
      const row = Math.floor(id / EXPERIENCE.gridSize);
      const column = id % EXPERIENCE.gridSize;
      tile.type = 'button';
      tile.className = 'puzzle-tile';
      tile.dataset.piece = String(id);
      tile.style.backgroundImage = `url("${EXPERIENCE.puzzleImage}")`;
      tile.style.backgroundPosition = `${column * 50}% ${row * 50}%`;
      tile.setAttribute('aria-label', `Potongan galaksi, baris ${row + 1} kolom ${column + 1}`);
      tile.setAttribute('aria-pressed', 'false');
      tile.addEventListener('click', () => choosePuzzlePiece(id));
      puzzleTiles.set(id, tile);
    }
  }

  function shuffleOrder() {
    do {
      order = Array.from({ length: EXPERIENCE.gridSize ** 2 }, (_, id) => id);
      for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
      }
    } while (order.filter((piece, position) => piece === position).length > 3);

    moves = 0;
    selectedPiece = null;
    puzzleSolved = false;
    letterArea.hidden = true;
    letterPaper.hidden = true;
    letterPaper.classList.remove('is-open', 'is-closing');
    letterButton.setAttribute('aria-expanded', 'false');
    letterLabel.textContent = 'Buka surat';
    puzzleStatus.textContent = 'Ayo poii masa gitu aja nda bisa';
    renderPuzzle();
  }

  function renderPuzzle() {
    const correctCount = order.reduce((count, piece, position) => count + Number(piece === position), 0);
    puzzleProgress.textContent = `${correctCount} / ${order.length} tepat · ${moves} langkah`;
    puzzleBoard.replaceChildren(...order.map((piece) => {
      const tile = puzzleTiles.get(piece);
      const isSelected = selectedPiece === piece;
      tile.classList.toggle('is-selected', isSelected);
      tile.classList.toggle('is-correct', order.indexOf(piece) === piece);
      tile.setAttribute('aria-pressed', String(isSelected));
      return tile;
    }));

    if (correctCount === order.length && !puzzleSolved) {
      puzzleSolved = true;
      selectedPiece = null;
      letterArea.hidden = false;
      puzzleStatus.textContent = 'Fotonya udah lengkap! Ada surat buat kamu di bawah.';
    }
  }

  function choosePuzzlePiece(piece) {
    if (puzzleSolved) return;
    if (selectedPiece === null) {
      selectedPiece = piece;
      puzzleStatus.textContent = 'Potongan dipilih. Ketuk potongan lain untuk menukar tempat.';
      renderPuzzle();
      return;
    }

    if (selectedPiece === piece) {
      selectedPiece = null;
      puzzleStatus.textContent = 'Pilihan dibatalkan. Ketuk satu potongan untuk mulai.';
      renderPuzzle();
      return;
    }

    const from = order.indexOf(selectedPiece);
    const to = order.indexOf(piece);
    [order[from], order[to]] = [order[to], order[from]];
    selectedPiece = null;
    moves += 1;
    renderPuzzle();
    if (!puzzleSolved) puzzleStatus.textContent = 'Keren, lanjut susun lagi ya!';
  }

  function toggleLetter() {
    window.clearTimeout(letterCloseTimer);
    const isOpen = letterButton.getAttribute('aria-expanded') === 'true';
    letterButton.setAttribute('aria-expanded', String(!isOpen));
    letterLabel.textContent = isOpen ? 'Buka surat' : 'Tutup surat';

    if (isOpen) {
      letterPaper.classList.remove('is-open');
      letterPaper.classList.add('is-closing');
      letterCloseTimer = window.setTimeout(() => {
        letterPaper.hidden = true;
        letterPaper.classList.remove('is-closing');
      }, 620);
      return;
    }

    letterPaper.hidden = false;
    letterPaper.classList.remove('is-closing', 'is-open');
    void letterPaper.offsetWidth;
    letterPaper.classList.add('is-open');
    window.setTimeout(() => createPaperPopperConfetti(), 850);
    if (!isMobile) window.setTimeout(() => createPaperPopperConfetti(), 1300);
  }

  function makeMemorySlides() {
    const slides = EXPERIENCE.memories.map((memory, index) => {
      const slide = document.createElement('article');
      const frame = document.createElement('figure');
      const visual = document.createElement('div');
      const number = document.createElement('span');
      slide.className = 'film-cell';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Frame ${index + 1} dari ${EXPERIENCE.memories.length}`);
      slide.setAttribute('aria-hidden', 'true');
      frame.className = 'film-frame';
      visual.className = 'memory-visual';
      number.className = 'film-frame-number';
      number.textContent = String(index + 1).padStart(2, '0');

      if (memory.image) {
        const image = document.createElement('img');
        image.className = 'memory-image';
        image.src = memory.image;
        image.alt = memory.story;
        image.loading = 'lazy';
        image.decoding = 'async';
        visual.append(image);
      } else {
        const placeholder = document.createElement('div');
        const placeholderLabel = document.createElement('span');
        const placeholderHint = document.createElement('small');
        placeholder.className = 'memory-placeholder';
        placeholderLabel.textContent = memory.photo;
        placeholderHint.textContent = `KENANGAN ${String(index + 1).padStart(2, '0')}`;
        placeholder.append(placeholderLabel, placeholderHint);
        visual.append(placeholder);
      }

      frame.append(visual, number);
      slide.append(frame);
      return slide;
    });
    memoryTrack.replaceChildren(...slides);
  }

  function updateMemory(index, animate = true) {
    const memories = EXPERIENCE.memories;
    const previousIndex = memoryIndex;
    memoryIndex = Math.max(0, Math.min(index, memories.length - 1));
    if (previousIndex !== memoryIndex) {
      memoryAngle += (memoryIndex - previousIndex) * 90;
    }
    viewedMemories.add(memoryIndex);
    memoryTrack.style.transform = `translate3d(${-memoryIndex * 100}%, 0, 0)`;
    [...memoryTrack.children].forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== memoryIndex));
    });
    memoryCounter.textContent = `${String(memoryIndex + 1).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`;
    memoryDate.textContent = memories[memoryIndex].date;
    memoryStory.textContent = memories[memoryIndex].story;
    memoryWindow.setAttribute('aria-label', `Foto kenangan ${memoryIndex + 1} dari ${memories.length}. Gunakan tombol panah kiri dan kanan untuk berpindah.`);

    if (!memoriesCompleted && viewedMemories.size === memories.length) {
      memoriesCompleted = true;
      memoryContinue.hidden = false;
      finalePage.hidden = false;
    }

    if (animate && !reduceMotion.matches) {
      memoryCaption.classList.remove('is-changing');
      void memoryCaption.offsetWidth;
      memoryCaption.classList.add('is-changing');
      reelWheel.style.transform = `rotate(${memoryAngle}deg)`;
    }
  }

  function stopMemoryPlayback() {
    window.clearInterval(memoryPlayback);
    memoryPlayback = 0;
    memoryPlay.setAttribute('aria-pressed', 'false');
    memoryPlay.textContent = 'Play';
  }

  function toggleMemoryPlayback() {
    if (memoryPlayback) {
      stopMemoryPlayback();
      return;
    }

    memoryPlay.setAttribute('aria-pressed', 'true');
    memoryPlay.textContent = 'Pause';
    memoryPlayback = window.setInterval(() => {
      if (memoryIndex >= EXPERIENCE.memories.length - 1) {
        stopMemoryPlayback();
        return;
      }
      updateMemory(memoryIndex + 1);
    }, EXPERIENCE.memoryPlaybackMs);
  }

  function handleMemorySwipeEnd(event) {
    if (!memoryPointerStart) return;
    const deltaX = event.clientX - memoryPointerStart.x;
    const deltaY = event.clientY - memoryPointerStart.y;
    memoryPointerStart = null;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    updateMemory(memoryIndex + (deltaX < 0 ? 1 : -1));
  }

  function updateScrollMorph() {
    scrollFrame = 0;
    if (!pageTwoActive) return;

    if (reduceMotion.matches) {
      puzzlePage.classList.remove('is-heart-transitioning', 'is-puzzle-arrived');
      puzzlePage.style.removeProperty('--puzzle-arrival-opacity');
      puzzlePage.style.removeProperty('--puzzle-copy-opacity');
      puzzlePage.style.removeProperty('--puzzle-copy-lift');
      morphPuzzle.style.opacity = '0';
      return;
    }

    const travel = Math.max(1, opening.offsetHeight - birthdayReveal.offsetHeight);
    const scrollProgress = window.scrollY / travel;
    const progress = Math.max(0, Math.min(1, scrollProgress));
    const smooth = (value) => {
      const clamped = Math.max(0, Math.min(1, value));
      return clamped * clamped * (3 - 2 * clamped);
    };
    const assembly = smooth((progress - 0.08) / 0.36);
    const travelEase = smooth((progress - 0.28) / 0.64);
    const boardFade = smooth((progress - 0.82) / 0.16);
    const copyFade = smooth((progress - 0.47) / 0.33);

    puzzlePage.classList.add('is-heart-transitioning');
    puzzlePage.classList.toggle('is-puzzle-arrived', boardFade > 0);
    puzzlePage.style.setProperty('--puzzle-arrival-opacity', String(boardFade));
    puzzlePage.style.setProperty('--puzzle-copy-opacity', String(copyFade));
    puzzlePage.style.setProperty('--puzzle-copy-lift', `${(1 - copyFade) * 14}px`);

    const stageBounds = heartStage.getBoundingClientRect();
    const boardBounds = puzzleBoard.getBoundingClientRect();
    const startX = stageBounds.left + stageBounds.width / 2;
    const startY = stageBounds.top + stageBounds.height / 2;
    const targetX = boardBounds.left + boardBounds.width / 2;
    const targetY = boardBounds.top + boardBounds.height / 2;
    const widthScale = boardBounds.width / Math.max(1, morphPuzzle.offsetWidth);
    const heightScale = boardBounds.height / Math.max(1, morphPuzzle.offsetHeight);
    const targetScale = Math.min(widthScale, heightScale);
    const x = (targetX - startX) * travelEase;
    const y = (targetY - startY) * travelEase;
    const scale = 0.84 + (targetScale - 0.84) * travelEase;

    morphPuzzle.style.opacity = String(assembly * (1 - boardFade));
    morphPuzzle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${-8 * (1 - travelEase)}deg)`;
    morphTiles.forEach((tile, id) => {
      const row = Math.floor(id / EXPERIENCE.gridSize);
      const column = id % EXPERIENCE.gridSize;
      const offset = 1 - assembly;
      const piece = order[id] ?? id;
      const pieceRow = Math.floor(piece / EXPERIENCE.gridSize);
      const pieceColumn = piece % EXPERIENCE.gridSize;
      const tileX = (column - 1) * 22 * offset;
      const tileY = (row - 1) * 22 * offset;
      const turn = ((id % 2 ? 1 : -1) * (8 + row + column)) * offset;
      tile.style.backgroundPosition = `${pieceColumn * 50}% ${pieceRow * 50}%`;
      tile.style.opacity = String(assembly);
      tile.style.transform = `translate3d(${tileX}px, ${tileY}px, 0) rotate(${turn}deg) scale(${0.68 + assembly * 0.32})`;
    });

    const fade = Math.max(0, 1 - assembly * 1.45);
    birthdayCopy.forEach((element) => {
      element.style.opacity = String(fade);
      element.style.transform = `translateY(${-assembly * 18}px)`;
    });
    heart3d.style.opacity = String(Math.max(0, 1 - assembly * 1.3));
    heart3d.style.transform = `translate3d(0, ${-assembly * 54}px, 0) rotateX(${7 - assembly * 20}deg) rotateY(${-11 + assembly * 175}deg) scale(${1 - assembly * 0.23})`;
    heartOrnaments.forEach((element) => {
      element.style.opacity = String(1 - assembly);
    });
  }

  function scheduleScrollMorph() {
    if (!pageTwoActive || scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollMorph);
  }

  keys.forEach((key) => key.addEventListener('click', () => {
    if (key.dataset.digit !== undefined) addDigit(key.dataset.digit);
    if (key.dataset.action === 'backspace') removeDigit();
    if (key.dataset.action === 'clear') clearPin();
  }));

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^\d$/.test(event.key)) addDigit(event.key);
    else if (event.key === 'Backspace') removeDigit();
    else if (event.key === 'Escape' || event.key === 'Delete') clearPin();
  });

  shuffleButton.addEventListener('click', shuffleOrder);
  letterButton.addEventListener('click', toggleLetter);
  memoryPrevious.addEventListener('click', () => updateMemory(memoryIndex - 1));
  memoryNext.addEventListener('click', () => updateMemory(memoryIndex + 1));
  memoryPlay.addEventListener('click', toggleMemoryPlayback);
  memoryWindow.addEventListener('pointerdown', (event) => {
    memoryPointerStart = { x: event.clientX, y: event.clientY };
  });
  memoryWindow.addEventListener('pointerup', handleMemorySwipeEnd);
  memoryWindow.addEventListener('pointercancel', () => { memoryPointerStart = null; });
  memoryWindow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); updateMemory(memoryIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); updateMemory(memoryIndex - 1); }
  });
  finaleMusicToggle.addEventListener('click', () => {
    if (finaleMusicPlaying) stopFinaleMusic();
    else startFinaleMusic();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopMemoryPlayback();
      if (finaleMusicPlaying) stopFinaleMusic();
    }
  });
  window.addEventListener('scroll', scheduleScrollMorph, { passive: true });
  window.addEventListener('resize', scheduleScrollMorph, { passive: true });

  makeMorphedTiles();
  const morphTiles = [...morphPuzzle.children];
  makePuzzleTiles();
  makeMemorySlides();
  updateMemory(0, false);
  memoryPlay.hidden = reduceMotion.matches;
  if ('IntersectionObserver' in window) {
    const memoryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) memoryPage.classList.add('is-entered');
        else stopMemoryPlayback();
      });
    }, { threshold: 0.12 });
    memoryObserver.observe(memoryPage);
  } else {
    memoryPage.classList.add('is-entered');
  }
  if ('IntersectionObserver' in window) {
    const finaleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) finalePage.classList.add('is-entered');
      });
    }, { threshold: 0.2 });
    finaleObserver.observe(finalePage);
  } else {
    finalePage.classList.add('is-entered');
  }
  shuffleOrder();
  renderPin();
})();
