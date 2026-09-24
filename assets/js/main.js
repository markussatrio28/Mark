    const motion = window.Motion || {};
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionReady = !reduceMotion && typeof motion.animate === 'function' && typeof motion.inView === 'function';
    const smoothEase = [0.16, 1, 0.3, 1];

    const nameNodes = document.querySelectorAll('[data-name]');
    nameNodes.forEach(node => node.textContent = GARDEN_DATA.name);
    document.querySelector('[data-day]').textContent = GARDEN_DATA.day;
    document.getElementById('hiddenMessage').textContent = GARDEN_DATA.hiddenMessage;
    document.getElementById('letterText').textContent = GARDEN_DATA.birthdayMessage;
    document.querySelector('#letterCard .eyebrow').textContent = `Untuk ${GARDEN_DATA.name}, dengan cinta`;
    document.querySelector('#finale .section-heading > p:not(.eyebrow)').textContent = GARDEN_DATA.finalMessage;

    function photoMarkup(item) {
      const card = document.createElement('figure');
      card.className = 'memory-card arrive';
      const photo = document.createElement('div');
      photo.className = `photo ${item.photo ? '' : 'is-placeholder'}`;
      if (item.photo) {
        const image = document.createElement('img');
        image.src = item.photo;
        image.alt = item.alt;
        image.loading = 'lazy';
        image.decoding = 'async';
        photo.append(image);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'photo-placeholder';
        placeholder.textContent = item.placeholder;
        photo.append(placeholder);
      }
      const caption = document.createElement('figcaption');
      caption.className = 'photo-caption';
      caption.textContent = item.caption;
      photo.append(caption);
      const meta = document.createElement('div');
      meta.className = 'memory-meta';
      const date = document.createElement('span');
      date.className = 'date';
      date.textContent = item.date;
      meta.append(date);
      card.append(photo, meta);
      return card;
    }
    const memoryLayout = document.getElementById('memoryLayout');
    GARDEN_DATA.memories.slice(1).forEach(item => memoryLayout.append(photoMarkup(item)));
    const first = GARDEN_DATA.memories[0];
    const firstPhoto = document.querySelector('[data-photo="0"]');
    firstPhoto.querySelector('[data-date]').textContent = first.date;
    firstPhoto.querySelector('.photo-placeholder').textContent = first.placeholder;
    firstPhoto.querySelector('[data-caption]').textContent = first.caption;
    if (first.photo) {
      firstPhoto.classList.remove('is-placeholder');
      const image = document.createElement('img');
      image.src = first.photo;
      image.alt = first.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      firstPhoto.querySelector('.photo-placeholder').replaceWith(image);
    }
    document.querySelectorAll('.memory-card .photo-placeholder').forEach((node, i) => node.textContent = GARDEN_DATA.memories[i + 1].placeholder);

    if (motionReady) document.documentElement.classList.add('motion-ready');

    function animateWhileVisible(target, createAnimations, margin = '80px 0px') {
      if (!motionReady || !target) return;
      motion.inView(target, () => {
        const controls = createAnimations();
        return () => controls.forEach(control => control.stop());
      }, { margin });
    }

    if (motionReady) {
      const gardenScene = document.querySelector('.garden-scene');
      animateWhileVisible(gardenScene, () => {
        const art = motion.animate(document.querySelector('.scene-art-motion'), { scale: 1.055, x: 5, y: -3 }, {
          duration: 30, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror'
        });
        const glow = motion.animate(document.querySelector('.scene-glow'), { scale: 1.12, opacity: .84 }, {
          duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror'
        });
        return [art, glow];
      }, '100px 0px');

      document.querySelectorAll('.fireflies').forEach(group => {
        animateWhileVisible(group, () => Array.from(group.querySelectorAll('.firefly'), (dot, index) => motion.animate(dot, {
          x: index % 2 ? 7 : -6,
          y: index % 3 ? -9 : 7,
          opacity: index % 2 ? .92 : .42,
          scale: index % 2 ? 1.12 : .84
        }, {
          duration: 4.6 + (index % 4) * .85,
          delay: (index % 3) * .2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        })));
      });

      const petals = Array.from(document.querySelectorAll('.drifting-petal'));
      animateWhileVisible(gardenScene, () => petals.map((petal, index) => motion.animate(petal, {
        x: index % 2 ? 8 : -7,
        y: index % 2 ? -14 : 11,
        rotate: index % 2 ? 13 : -11,
        opacity: index % 2 ? .62 : .28
      }, {
        duration: 11 + index * 1.7,
        delay: index * .35,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror'
      })), '100px 0px');

      const pathLight = document.querySelector('.path-light');
      animateWhileVisible(pathLight, () => [motion.animate(pathLight, {
        opacity: [.32, .88],
        scaleY: [.72, 1.16]
      }, { duration: 2.7, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' })], '10px 0px');

      const memoryCards = Array.from(document.querySelectorAll('.memory-card'));
      const memoryDelay = typeof motion.stagger === 'function' ? motion.stagger(.09, { startDelay: .02 }) : () => 0;
      const revealTargets = Array.from(document.querySelectorAll('.arrive'));
      revealTargets.forEach((target, index) => {
        let currentAnimation;
        const delay = memoryCards.includes(target) ? memoryDelay(memoryCards.indexOf(target), memoryCards.length) : (index % 3) * .035;
        motion.inView(target, element => {
          currentAnimation?.stop();
          currentAnimation = motion.animate(element, { opacity: 1, y: 0 }, {
            duration: .82, delay, ease: smoothEase
          });
          return () => {
            currentAnimation?.stop();
            currentAnimation = motion.animate(element, { opacity: 0, y: 17 }, {
              duration: .42, ease: 'easeInOut'
            });
          };
        }, { margin: '-7% 0px -7% 0px', amount: .06 });
      });
    }

    document.getElementById('enterGarden').addEventListener('click', () => {
      document.body.classList.add('entered');
      const threshold = document.getElementById('threshold');
      threshold.setAttribute('aria-hidden', 'true');
      threshold.querySelector('button').disabled = true;
      if ('inert' in threshold) threshold.inert = true;
      document.getElementById('birthdayHero').setAttribute('aria-label', `Happy Birthday ${GARDEN_DATA.name}`);
      document.querySelector('#birthdayHero h1').focus({ preventScroll: true });
      if (motionReady) {
        motion.animate(threshold, { opacity: 0, scale: 1.035, y: -5 }, { duration: 1.05, ease: smoothEase });
        motion.animate(document.getElementById('birthdayHero'), { opacity: 1, y: 0 }, { duration: .95, delay: .18, ease: smoothEase });
      } else {
        threshold.style.visibility = 'hidden';
        const birthdayHero = document.getElementById('birthdayHero');
        birthdayHero.style.opacity = '1';
        birthdayHero.style.transform = 'none';
        birthdayHero.style.visibility = 'visible';
      }
    });

    const secret = document.getElementById('secretGrove');
    document.getElementById('findLight').addEventListener('click', event => {
      secret.classList.add('discovered');
      event.currentTarget.setAttribute('aria-expanded', 'true');
      document.querySelector('.secret-hint').textContent = 'Kamu menemukannya.';
      const hiddenMessage = document.getElementById('hiddenMessage');
      if (motionReady) {
        motion.animate(event.currentTarget, { scale: [1, 1.14, 1], rotate: [0, -7, 5, 0] }, {
          type: 'spring', stiffness: 170, damping: 17
        });
        motion.animate(document.querySelector('.secret-glow'), { opacity: [.05, .88, .62], scale: [.96, 1.08, 1] }, {
          duration: 1.35, ease: smoothEase
        });
        motion.animate(hiddenMessage, { opacity: 1, y: [12, 0] }, { duration: .7, delay: .14, ease: smoothEase });
      } else {
        hiddenMessage.style.opacity = '1';
        hiddenMessage.style.transform = 'none';
      }
    });
    function revealLetter() {
      const text = document.getElementById('letterText');
      const sign = document.getElementById('letterSign');
      text.hidden = false;
      sign.hidden = false;
      document.getElementById('openLetter').setAttribute('aria-expanded', 'true');
      if (motionReady) {
        text.style.opacity = '0';
        sign.style.opacity = '0';
        motion.animate(text, { opacity: 1, y: [10, 0] }, { duration: .72, ease: smoothEase });
        motion.animate(sign, { opacity: 1, y: [10, 0] }, { duration: .6, delay: .16, ease: smoothEase });
      } else {
        text.style.opacity = '1';
        sign.style.opacity = '1';
      }
    }
    document.getElementById('openLetter').addEventListener('click', revealLetter);
    document.getElementById('readNow').addEventListener('click', () => { revealLetter(); document.getElementById('letterText').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
