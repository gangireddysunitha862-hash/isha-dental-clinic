/* ═══════════════════════════════════════════════
   ISHA DENTAL CARE — Interactive Scripts
   Premium, performance-optimized interactions
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── MOBILE MENU TOGGLE ─────────────────────
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            toggle.classList.toggle('active');
            body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggle.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ─── STICKY NAVBAR SCROLL EFFECT ────────────
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function updateNavbar() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // ─── SCROLL ANIMATIONS (IntersectionObserver) ─
    const animElements = document.querySelectorAll('.anim-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger siblings for grid items
                    const parent = entry.target.parentElement;
                    const siblings = parent ? parent.querySelectorAll('.anim-on-scroll') : [];
                    let delay = 0;

                    if (siblings.length > 1) {
                        siblings.forEach((sibling, i) => {
                            if (sibling === entry.target) {
                                delay = i * 80;
                            }
                        });
                    }

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, Math.min(delay, 400));

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        animElements.forEach(el => el.classList.add('visible'));
    }

    // ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ─── ACTIVE NAV LINK HIGHLIGHT ──────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');
    let activeNavTick = false;

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
        activeNavTick = false;
    }

    window.addEventListener('scroll', () => {
        if (!activeNavTick) {
            requestAnimationFrame(updateActiveLink);
            activeNavTick = true;
        }
    }, { passive: true });

    // ─── FLOATING BUTTONS VISIBILITY ─────────────
    const floatingButtons = document.getElementById('floating-buttons');
    let floatingTick = false;

    if (floatingButtons) {
        function updateFloatingButtons() {
            if (window.pageYOffset > 400) {
                floatingButtons.classList.add('visible');
            } else {
                floatingButtons.classList.remove('visible');
            }
            floatingTick = false;
        }

        window.addEventListener('scroll', () => {
            if (!floatingTick) {
                requestAnimationFrame(updateFloatingButtons);
                floatingTick = true;
            }
        }, { passive: true });
    }

    // ─── SERVICE CARD HOVER TILT (subtle) ───────
    const serviceCards = document.querySelectorAll('.service-card, .why-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -1.5;
            const rotateY = (x - centerX) / centerX * 1.5;

            card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ─── FAQ ACCORDION ──────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    const btn = other.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('open');
            question.setAttribute('aria-expanded', !isOpen);
        });
    });

    // ─── TESTIMONIALS CAROUSEL ──────────────────
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    const dotsContainer = document.getElementById('testimonials-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentPage = 0;
        let cardsPerPage = window.innerWidth > 768 ? 2 : 1;
        let totalPages = Math.ceil(totalCards / cardsPerPage);

        function updateCardsPerPage() {
            cardsPerPage = window.innerWidth > 768 ? 2 : 1;
            totalPages = Math.ceil(totalCards / cardsPerPage);
            if (currentPage >= totalPages) currentPage = totalPages - 1;
            buildDots();
            showPage(currentPage);
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'testimonials-dot' + (i === currentPage ? ' active' : '');
                dot.addEventListener('click', () => showPage(i));
                dotsContainer.appendChild(dot);
            }
        }

        function showPage(page) {
            currentPage = page;
            cards.forEach((card, i) => {
                const pageStart = page * cardsPerPage;
                const pageEnd = pageStart + cardsPerPage;
                if (i >= pageStart && i < pageEnd) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });

            // Update dots
            dotsContainer.querySelectorAll('.testimonials-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === page);
            });
        }

        prevBtn.addEventListener('click', () => {
            showPage(currentPage > 0 ? currentPage - 1 : totalPages - 1);
        });

        nextBtn.addEventListener('click', () => {
            showPage(currentPage < totalPages - 1 ? currentPage + 1 : 0);
        });

        // Auto-advance every 6 seconds
        let autoPlay = setInterval(() => {
            showPage(currentPage < totalPages - 1 ? currentPage + 1 : 0);
        }, 6000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                showPage(currentPage < totalPages - 1 ? currentPage + 1 : 0);
            }, 6000);
        });

        // Init
        buildDots();
        showPage(0);

        // Resize handler
        window.addEventListener('resize', () => {
            updateCardsPerPage();
        });
    }

});
