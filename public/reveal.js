(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;

    if (prefersReduced) { els.forEach(el => el.classList.add('reveal-show')); return; }

    // Fade IN on enter; ALWAYS reset on exit (repeat behavior by default)
    const io = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
                const delay = target.getAttribute('data-reveal-delay');
                if (delay) target.style.transitionDelay = `${parseInt(delay, 10)}ms`;
                target.classList.add('reveal-show');
                target.classList.remove('reveal-out');
            } else {
                target.classList.remove('reveal-show'); // repeat: allow re-animate next time
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    els.forEach(el => io.observe(el));

    // Optional stagger: parent can set per-child delays
    document.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
        const step = parseInt(parent.getAttribute('data-reveal-stagger') || '60', 10);
        parent.querySelectorAll(':scope > [data-reveal]').forEach((child, i) => {
            if (!child.hasAttribute('data-reveal-delay')) {
                child.setAttribute('data-reveal-delay', String(i * step));
            }
        });
    });

    // Automatic fade OUT once scrolled past (center above top threshold)
    const onScroll = () => {
        const thresholdPx = 80;
        els.forEach((el) => {
            const r = el.getBoundingClientRect();
            const middleY = r.top + r.height / 2;
            if (middleY < thresholdPx) el.classList.add('reveal-out');
            else el.classList.remove('reveal-out');
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
})();
