document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Smooth scrolling for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    /* ---------- Sticky navbar, scroll progress & back-to-top ---------- */
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    const onScroll = () => {
        const y = window.scrollY;

        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = scrollable > 0 ? `${(y / scrollable) * 100}%` : '0%';
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', y > 90);
        }

        if (backToTop) {
            backToTop.classList.toggle('visible', y > 600);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Mobile hamburger menu ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (navToggle && mobileMenu) {
        const setMenu = open => {
            navToggle.classList.toggle('open', open);
            mobileMenu.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        navToggle.addEventListener('click', () => setMenu(!navToggle.classList.contains('open')));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }

    /* ---------- Scrollspy: highlight active nav link ---------- */
    const navAnchors = document.querySelectorAll('.nav-links a');
    if (navAnchors.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = `#${entry.target.id}`;
                    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        document.querySelectorAll('main section[id]').forEach(section => spy.observe(section));
    }

    /* ---------- Acknowledgment logo rotator ---------- */
    const acknowledgmentLogos = document.querySelectorAll('.acknowledgment-logo');
    if (acknowledgmentLogos.length) {
        const logoPool = [
            { src: 'assets/logo/PCU-logo.png', alt: 'PCU' },
            { src: 'assets/logo/nasa.png', alt: 'NASA' },
            { src: 'assets/logo/who.png', alt: 'WHO' },
            { src: 'assets/logo/adidas.png', alt: 'Adidas' },
            { src: 'assets/logo/eduplus.webp', alt: 'Eduplus' },
            { src: 'assets/logo/nfl-logo.png', alt: 'NFL' }
        ];

        const slots = [...acknowledgmentLogos].map((logoCard, slotIndex) => ({
            card: logoCard,
            img: logoCard.querySelector('img'),
            slotIndex
        })).filter(slot => slot.img);

        const visible = slots.map((_, index) => index % logoPool.length);
        const swapDuration = 180;
        const swapInterval = 1500;
        let slotCursor = 0;
        let nextCursor = slots.length % logoPool.length;

        const applyLogo = (slotIndex, logoIndex) => {
            const slot = slots[slotIndex];
            const logo = logoPool[logoIndex];
            if (!slot || !logo) {
                return;
            }

            slot.card.classList.add('is-swapping');
            window.setTimeout(() => {
                slot.img.src = logo.src;
                slot.img.alt = logo.alt;
                slot.card.classList.remove('is-swapping');
            }, swapDuration);
        };

        const seedVisibleLogos = () => {
            slots.forEach((_, index) => {
                const logo = logoPool[visible[index] % logoPool.length];
                if (slots[index]) {
                    slots[index].img.src = logo.src;
                    slots[index].img.alt = logo.alt;
                }
            });
        };

        if (!prefersReducedMotion) {
            seedVisibleLogos();

            window.setInterval(() => {
                const currentVisible = new Set(visible);

                while (currentVisible.has(nextCursor)) {
                    nextCursor = (nextCursor + 1) % logoPool.length;
                }

                visible[slotCursor] = nextCursor;
                applyLogo(slotCursor, nextCursor);

                slotCursor = (slotCursor + 1) % slots.length;
                nextCursor = (nextCursor + 1) % logoPool.length;
            }, swapInterval);
        }
    }

    /* ---------- Typed role rotator ---------- */
    const roleEl = document.getElementById('typed-role');
    if (roleEl && !prefersReducedMotion) {
        const roles = [
            'SECURITY ENGINEER',
            'VAPT SPECIALIST',
            'CVE RESEARCHER',
            'BUG BOUNTY HUNTER',
            'CONTENT CREATOR'
        ];
        let roleIndex = 0;
        let charPos = roles[0].length;
        let deleting = true;

        const tick = () => {
            const current = roles[roleIndex];

            if (deleting) {
                charPos -= 1;
                roleEl.textContent = current.slice(0, charPos);
                if (charPos === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
                window.setTimeout(tick, 40);
            } else {
                charPos += 1;
                roleEl.textContent = roles[roleIndex].slice(0, charPos);
                if (charPos === roles[roleIndex].length) {
                    deleting = true;
                    window.setTimeout(tick, 2600);
                } else {
                    window.setTimeout(tick, 75);
                }
            }
        };

        window.setTimeout(tick, 2600);
    }

    /* ---------- Animated stat counters ---------- */
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = el => {
        const target = parseFloat(el.dataset.target || '0');
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';

        if (prefersReducedMotion) {
            el.textContent = target.toFixed(decimals) + suffix;
            return;
        }

        const duration = 1800;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const frame = now => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = (target * easeOut(progress)).toFixed(decimals) + suffix;
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* ---------- Decode-scramble effect on section titles ---------- */
    const scrambleChars = '!<>-_\\/[]{}=+*^?#';

    const scrambleIn = el => {
        const original = el.dataset.originalText || el.textContent;
        el.dataset.originalText = original;

        let frame = 0;
        const totalFrames = 22;

        const update = () => {
            frame += 1;
            const progress = frame / totalFrames;
            el.textContent = [...original]
                .map((ch, i) => {
                    if (ch === ' ' || i < progress * original.length) {
                        return ch;
                    }
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join('');

            if (frame < totalFrames) {
                requestAnimationFrame(update);
            } else {
                el.textContent = original;
            }
        };

        update();
    };

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const titleObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrambleIn(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.section-title').forEach(title => titleObserver.observe(title));
    }

    /* ---------- Scroll reveal for cards & content ---------- */
    const revealTargets = document.querySelectorAll(
        '.skills-card, .project-card, .timeline-item, .cert-card, .content-card, ' +
        '.stat-item, .advisory-card, .hof-chip, .about-text p, .graph-container'
    );

    if (revealTargets.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
        revealTargets.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${(i % 4) * 90}ms`;
        });

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('in-view');
                    obs.unobserve(el);
                    // Drop the reveal classes once the animation settles so
                    // hover transforms (lift/tilt) are not overridden.
                    window.setTimeout(() => {
                        el.classList.remove('reveal', 'in-view');
                        el.style.transitionDelay = '';
                    }, 1300);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => revealObserver.observe(el));
    }

    /* ---------- 3D tilt on project & advisory cards ---------- */
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHover && !prefersReducedMotion) {
        document.querySelectorAll('.project-card, .advisory-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Easter egg: type "hack" anywhere ---------- */
    const toast = document.getElementById('hacker-toast');
    if (toast) {
        let buffer = '';
        let toastTimer = null;

        document.addEventListener('keydown', e => {
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }
            if (/input|textarea|select/i.test(document.activeElement?.tagName || '')) {
                return;
            }

            buffer = (buffer + e.key.toLowerCase()).slice(-8);
            if (buffer.endsWith('hack')) {
                buffer = '';
                toast.classList.add('show');
                window.clearTimeout(toastTimer);
                toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
            }
        });
    }

    /* ---------- Console banner for fellow researchers ---------- */
    console.log(
        '%c\n  ██╗   ██╗██╗███╗   ██╗ █████╗ ██╗   ██╗\n  ██║   ██║██║████╗  ██║██╔══██╗╚██╗ ██╔╝\n  ██║   ██║██║██╔██╗ ██║███████║ ╚████╔╝\n  ╚██╗ ██╔╝██║██║╚██╗██║██╔══██║  ╚██╔╝\n   ╚████╔╝ ██║██║ ╚████║██║  ██║   ██║\n    ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝\n',
        'color: #10b981; font-weight: bold;'
    );
    console.log(
        '%cInspecting the source? I like you already. 🔍\n%cFound something interesting? → vinayyssharma17@gmail.com\nP.S. Try typing "hack" on the page.',
        'color: #1a1a2e; font-size: 13px; font-weight: 700;',
        'color: #6b7280; font-size: 12px;'
    );
});
