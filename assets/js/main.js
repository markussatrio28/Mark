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
      if (typeof motion.scroll === 'function') {
        const traveler = document.querySelector('.scroll-traveler');
        let travelerAnimation;
        let cancelTravelerScroll;
        const bindTraveler = () => {
          cancelTravelerScroll?.();
          travelerAnimation?.stop();
          const width = window.innerWidth;
          const height = window.innerHeight;
          const gutter = width < 760 ? 28 : Math.max(38, width * .055);
          travelerAnimation = motion.animate(traveler, {
            x: [gutter, gutter, width - gutter, gutter, width - gutter, gutter, width - gutter],
            y: [height * .8, height * .7, height * .88, height * .66, height * .86, height * .69, height * .82],
            rotate: [-18, 8, 24, -14, 17, -22, 12],
            scale: [.82, 1, .78, 1.08, .82, 1.02, .86],
            opacity: [.5, .78, .52, .84, .48, .8, .54]
          }, {
            duration: 1,
            ease: 'linear',
            times: [0, .16, .34, .61, .76, .88, 1]
          });
          cancelTravelerScroll = motion.scroll(travelerAnimation, {
            target: document.querySelector('main'),
            offset: ['start start', 'end end']
          });
        };
        bindTraveler();
        window.addEventListener('orientationchange', bindTraveler, { passive: true });
        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(bindTraveler, 180);
        }, { passive: true });
      }

      const gardenScene = document.querySelector('.garden-scene');
      animateWhileVisible(gardenScene, () => {
        const art = motion.animate(document.querySelector('.scene-art-motion'), {
          scale: [1.035, 1.09, 1.045], x: [0, 12, -4], y: [0, -9, 4]
        }, {
          duration: 17, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror'
        });
        const glow = motion.animate(document.querySelector('.scene-glow'), { scale: [1, 1.2], opacity: [.48, .96] }, {
          duration: 9.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror'
        });
        return [art, glow];
      }, '100px 0px');

      document.querySelectorAll('.fireflies').forEach(group => {
        animateWhileVisible(group, () => Array.from(group.querySelectorAll('.firefly'), (dot, index) => motion.animate(dot, {
          x: index % 2 ? 12 : -9,
          y: index % 3 ? -14 : 10,
          opacity: index % 2 ? 1 : .34,
          scale: index % 2 ? 1.3 : .76
        }, {
          duration: 3.4 + (index % 4) * .7,
          delay: (index % 3) * .16,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        })));
      });

      const entranceBlooms = Array.from(document.querySelectorAll('.entrance-bloom'));
      animateWhileVisible(gardenScene, () => entranceBlooms.map((bloom, index) => motion.animate(bloom, {
        x: index ? [0, -9, 2] : [0, 8, -2],
        y: index ? [0, 16, -3] : [0, -18, 3],
        rotate: index ? [27, 17, 27] : [-20, -8, -20],
        opacity: index ? [.52, .82, .58] : [.58, .92, .62]
      }, {
        duration: 7.5 + index * 1.8,
        delay: index * .45,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror'
      })), '100px 0px');

      document.querySelectorAll('.garden-motif').forEach((motif, index) => {
        const finalClearing = motif.closest('.finale');
        animateWhileVisible(motif, () => [motion.animate(motif, {
          x: index % 2 ? [0, -8, 1] : [0, 9, -1],
          y: [0, -16, 4],
          rotate: index % 2 ? [-16, -25, -16] : [18, 29, 18],
          opacity: finalClearing ? [.24, .38, .28] : [.34, .58, .4]
        }, {
          duration: finalClearing ? 13 : 8.5 + (index % 3),
          delay: index * .12,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        })], '80px 0px');
      });

      document.querySelectorAll('.seam-light').forEach((light, index) => {
        animateWhileVisible(light, () => [motion.animate(light, {
          y: [-24, 22],
          opacity: [.28, .96],
          scaleY: [.62, 1.16]
        }, { duration: 2.7, delay: index * .18, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' })], '10px 0px');
      });

      const pathContinuation = document.querySelector('.path-continuation');
      animateWhileVisible(pathContinuation, () => [motion.animate(pathContinuation, {
        opacity: [.4, .78],
        scaleY: [.98, 1.04]
      }, { duration: 8, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' })], '40px 0px');

      const memoryCards = Array.from(document.querySelectorAll('.memory-card'));
      const memoryDelay = typeof motion.stagger === 'function' ? motion.stagger(.09, { startDelay: .02 }) : () => 0;
      const revealTargets = Array.from(document.querySelectorAll('.arrive'));
      revealTargets.forEach((target, index) => {
        let currentAnimation;
        const delay = memoryCards.includes(target) ? memoryDelay(memoryCards.indexOf(target), memoryCards.length) : (index % 3) * .035;
        motion.inView(target, element => {
          currentAnimation?.stop();
          currentAnimation = motion.animate(element, { opacity: 1, y: 0 }, {
          duration: .9, delay, ease: smoothEase
          });
          return () => {
            currentAnimation?.stop();
            currentAnimation = motion.animate(element, { opacity: 0, y: 22 }, {
              duration: .5, ease: 'easeInOut'
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
