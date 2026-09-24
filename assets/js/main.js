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

    document.getElementById('enterGarden').addEventListener('click', () => {
      document.body.classList.add('entered');
      const threshold = document.getElementById('threshold');
      threshold.setAttribute('aria-hidden', 'true');
      threshold.querySelector('button').disabled = true;
      if ('inert' in threshold) threshold.inert = true;
      document.getElementById('birthdayHero').setAttribute('aria-label', `Happy Birthday ${GARDEN_DATA.name}`);
      document.querySelector('#birthdayHero h1').focus({ preventScroll: true });
    });
    const revealTargets = document.querySelectorAll('.arrive');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      }, { threshold: 0.06, rootMargin: '-7% 0px -7% 0px' });
      revealTargets.forEach(node => observer.observe(node));
    } else {
      revealTargets.forEach(node => node.classList.add('is-visible'));
    }

    const secret = document.getElementById('secretGrove');
    document.getElementById('findLight').addEventListener('click', event => {
      secret.classList.add('discovered');
      event.currentTarget.setAttribute('aria-expanded', 'true');
      document.querySelector('.secret-hint').textContent = 'Kamu menemukannya.';
    });
    function revealLetter() {
      document.getElementById('letterText').hidden = false;
      document.getElementById('letterSign').hidden = false;
      document.getElementById('openLetter').setAttribute('aria-expanded', 'true');
    }
    document.getElementById('openLetter').addEventListener('click', revealLetter);
    document.getElementById('readNow').addEventListener('click', () => { revealLetter(); document.getElementById('letterText').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
