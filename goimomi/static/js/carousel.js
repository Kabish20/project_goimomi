(function () {
  // List image filenames in your static folder (update names as needed)
  const images = [
    "{% static 'sunset.png' %}",     // slide 0
    "{% static 'bluesea.png' %}",    // slide 1
    "{% static 'old.png' %}",        // slide 2
    "{% static 'stone.png' %}",      // slide 3
    // If you have more image files add them here
  ];

  // Corresponding overlay content for each slide (must match images length)
  const overlays = [
    {
      title: "Relax on Golden Beaches",
      subtitle: "Experience the world with Goimomi Holidays. Your trusted travel partner for unforgettable journeys.",
    },
    {
      title: "Sail into the Sunset",
      subtitle: "Luxury cruises and scenic voyages designed for comfort and discovery.",
    },
    {
      title: "Discover Ancient Streets",
      subtitle: "Historic tours and cultural experiences to bring the past alive.",
    },
    {
      title: "Rocky Coastal Adventures",
      subtitle: "Adventure packages for explorers who love dramatic landscapes.",
    }
  ];

  // Basic sanity: if overlays length doesn't match images, fill remaining with default content
  while (overlays.length < images.length) {
    overlays.push({
      title: "Explore with Goimomi",
      subtitle: "Create unforgettable memories with our curated travel packages.",
      ctaText: "Learn More",
      ctaHref: "#"
    });
  }

  const slidesContainer = document.getElementById('slides');
  const dotsContainer = document.getElementById('dots');
  const overlayEl = document.getElementById('overlay');

  let current = 0;
  let isAnimating = false;
  const duration = 600; // transition duration in ms
  let autoPlayInterval = null;
  const autoPlayDelay = 5000; // ms, set to null or 0 to disable autoplay

  // Create slides (absolute stacked) with transition classes
  images.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'absolute inset-0 w-full h-full transition-all duration-500 ease-in-out';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${idx + 1} of ${images.length}`);

    // image element
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Slide ${idx + 1}`;
    img.className = 'w-full h-full object-cover';

    // initial visibility
    if (idx === 0) {
      slide.style.opacity = '1';
      slide.style.transform = 'translateX(0)';
      slide.style.zIndex = '10';
    } else {
      slide.style.opacity = '0';
      slide.style.transform = 'translateX(10%)';
      slide.style.zIndex = '5';
    }

    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    // dot
    const dot = document.createElement('button');
    dot.className = 'w-3 h-3 rounded-full bg-white/60 hover:bg-white ring-0 focus:outline-none';
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goTo(idx);
      startAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const slides = Array.from(slidesContainer.children);
  const dots = Array.from(dotsContainer.children);

  // set overlay markup for index
  function renderOverlay(index) {
    const data = overlays[index] || {};
    // fade-out current content, then replace and fade-in
    overlayEl.style.opacity = '0';
    // small timeout to allow CSS transition to start (match transition duration-ish)
    setTimeout(() => {
      overlayEl.innerHTML = `
        <h1 class="text-4xl md:text-6xl heading-font font-bold text-goimomi-dark">${data.title || ''}</h1>
        <p class="mt-4 text-lg md:text-xl text-slate-700">${data.subtitle || ''}</p>
        ${data.ctaText ? `<div class="mt-6"><a href="${data.ctaHref || '#'}" class="inline-block px-5 py-3 rounded-2xl border border-transparent shadow-sm hover:shadow-md hover:underline">${data.ctaText}</a></div>` : ''}
      `;
      // small delay to smoothly fade in
      requestAnimationFrame(() => {
        overlayEl.style.opacity = '1';
      });
    }, 160);
  }

  // update dot active state
  function updateDots() {
    dots.forEach((d, i) => {
      if (i === current) {
        d.classList.add('scale-110', 'bg-white');
        d.classList.remove('bg-white/60');
        d.style.transform = 'scale(1.15)';
      } else {
        d.classList.remove('scale-110', 'bg-white');
        d.classList.add('bg-white/60');
        d.style.transform = 'scale(1)';
      }
    });
  }

  // perform animated transition
  function show(nextIndex, dir = 1) {
    if (isAnimating || nextIndex === current) return;
    isAnimating = true;

    const from = slides[current];
    const to = slides[nextIndex];

    // prepare 'to' slide
    to.style.transition = `none`;
    to.style.opacity = '0';
    to.style.transform = `translateX(${dir * 10}%)`;
    to.style.zIndex = '15';

    // update overlay content for 'to' (fade overlay slightly to indicate change)
    // we start overlay fade slightly earlier for smooth feel
    overlayEl.style.transition = `opacity ${duration / 2}ms ease`;
    overlayEl.style.opacity = '0';

    // force reflow then animate
    requestAnimationFrame(() => {
      from.style.transition = `all ${duration}ms ease`;
      to.style.transition = `all ${duration}ms ease`;

      from.style.opacity = '0';
      from.style.transform = `translateX(${-dir * 10}%)`;
      from.style.zIndex = '5';

      to.style.opacity = '1';
      to.style.transform = 'translateX(0)';
      to.style.zIndex = '10';

      // finish
      setTimeout(() => {
        from.style.zIndex = '5';
        isAnimating = false;
        current = nextIndex;
        updateDots();
        // render overlay for the new slide (fade-in inside renderOverlay)
        renderOverlay(current);
      }, duration + 20);
    });
  }

  function next() {
    const nextIndex = (current + 1) % slides.length;
    show(nextIndex, 1);
  }
  function prev() {
    const nextIndex = (current - 1 + slides.length) % slides.length;
    show(nextIndex, -1);
  }
  function goTo(i) {
    const dir = i > current ? 1 : -1;
    show(i, dir);
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    stopAutoPlay();
    next();
    startAutoPlay();
  });
  document.getElementById('prevBtn').addEventListener('click', () => {
    stopAutoPlay();
    prev();
    startAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopAutoPlay(); next(); startAutoPlay(); }
    if (e.key === 'ArrowLeft')  { stopAutoPlay(); prev(); startAutoPlay(); }
  });

  // Autoplay
  function startAutoPlay() {
    if (!autoPlayDelay) return;
    stopAutoPlay();
    autoPlayInterval = setInterval(next, autoPlayDelay);
  }
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Initialize
  updateDots();
  renderOverlay(current);
  startAutoPlay();

  // Pause autoplay on hover/focus
  const carouselEl = document.getElementById('hero-carousel');
  carouselEl.addEventListener('mouseenter', stopAutoPlay);
  carouselEl.addEventListener('mouseleave', startAutoPlay);
  carouselEl.addEventListener('focusin', stopAutoPlay);
  carouselEl.addEventListener('focusout', startAutoPlay);

})();
