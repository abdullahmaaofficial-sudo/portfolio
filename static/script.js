const contactForm = document.getElementById('contact-form');
const submitButton = document.querySelector("button[type='submit']");
const msg_status = document.getElementById('msg-status');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== Mobile Sidebar ===================== */
const menuToggle = document.getElementById('menu-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarClose = document.getElementById('sidebar-close');

function openSidebar(){
    mobileSidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    mobileSidebar.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar(){
    mobileSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    mobileSidebar.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle){
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileSidebar.classList.contains('open');
        isOpen ? closeSidebar() : openSidebar();
    });
    sidebarOverlay.addEventListener('click', closeSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    mobileSidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSidebar));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('open')) closeSidebar();
    });
}

/* ===================== Back To Top ===================== */
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) backToTopBtn.classList.add('is-visible');
        else backToTopBtn.classList.remove('is-visible');
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}


/* ===================== GSAP Animations ===================== */
if (!prefersReducedMotion && window.gsap){
    gsap.registerPlugin(ScrollTrigger);

    // Header entrance
    const header_tl = gsap.timeline({ defaults: { clearProps: 'all' } });
    header_tl
        .fromTo('.logo', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
        .fromTo('.nav-bar.desktop-nav .nav-icons', { y: -20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 }, '-=0.6')
        .fromTo('.menu-toggle', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.6');

    // Hero entrance
    const hero_tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });
    hero_tl
        .fromTo('.img-box', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 })
        .fromTo('#intro', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .fromTo('#headline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('#info', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.social-links', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.buttons-box a', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, '-=0.3');

    // Small helper for "fade up on scroll into view"
    function revealOnScroll(selector, vars = {}){
        gsap.utils.toArray(selector).forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom top',
                        toggleActions: 'play none none reverse'
                    },
                    ...vars
                }
            );
        });
    }

    function revealStaggerGroup(triggerSelector, targetSelector, vars = {}){
        gsap.utils.toArray(triggerSelector).forEach(group => {
            gsap.fromTo(group.querySelectorAll(targetSelector),
                { opacity: 0, y: 30, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 85%',
                        end: 'bottom top',
                        toggleActions: 'play none none reverse'
                    },
                    ...vars
                }
            );
        });
    }

    // About
    revealOnScroll('.about-heading');
    revealOnScroll('.paragraph');
    revealOnScroll('.education');

    // Projects
    revealOnScroll('.project-heading');
    revealOnScroll('.project-filters');
    revealStaggerGroup('.projects-box', '.project');

    // Skills
    revealOnScroll('.skills-heading');
    revealStaggerGroup('.skills-box, .techs-box', '.skill-chip');

    // Contact
    revealOnScroll('.contact-heading');
    revealOnScroll('.co-social-box');
    revealOnScroll('.form-box');

    // Recalculate trigger positions once everything has fully loaded
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ===================== Page Loader ===================== */
const pageLoader = document.getElementById('page-loader');
const barFill = document.getElementById('loader-bar-fill');
const percentText = document.getElementById('loader-percent');

const loaderImages = Array.from(document.images);
const loaderTotal = loaderImages.length;
let loaderLoaded = 0;
let loaderWindowDone = false;

function updateLoaderProgress(){
    const percent = loaderTotal === 0 ? 100 : Math.min(100, Math.round((loaderLoaded / loaderTotal) * 100));
    if (barFill) barFill.style.width = percent + '%';
    if (percentText) percentText.textContent = percent + '%';
}

function checkLoaderDone(){
    if (loaderLoaded >= loaderTotal && loaderWindowDone) hidePageLoader();
}

function markImageLoaded(){
    loaderLoaded = Math.min(loaderTotal, loaderLoaded + 1);
    updateLoaderProgress();
    checkLoaderDone();
}

function hidePageLoader(){
    updateLoaderProgress();
    if (pageLoader) pageLoader.classList.add('loader-hidden');
    document.body.classList.remove('is-loading');
}

updateLoaderProgress();

if (loaderTotal === 0) {
    loaderLoaded = 0;
} else {
    loaderImages.forEach(img => {
        if (img.complete) {
            markImageLoaded();
        } else {
            img.addEventListener('load', markImageLoaded, { once: true });
            img.addEventListener('error', markImageLoaded, { once: true });
        }
    });
}

window.addEventListener('load', () => {
    loaderWindowDone = true;
    checkLoaderDone();
});

// Fallback safety timeout: Force hide loader after 3 seconds if assets hang
setTimeout(() => {
    hidePageLoader();
}, 3000);

/* ===================== Contact Form ===================== */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot check — if this hidden field got filled, it was a bot. Drop silently.
    const honeypot = contactForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== ''){
        contactForm.reset();
        return;
    }

    const formData = new FormData(contactForm);
    submitForm(formData);
});

async function submitForm(data){
    showLoader();
    try{
        const response = await fetch('/contact', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (response.ok) contactForm.reset();
        if (result.sent) {
            msg_status.style.display = 'block';
            msg_status.style.color = '';
            msg_status.innerHTML = `${result.msg} ✓`;

            setTimeout(() => {
                msg_status.style.display = 'none';
            }, 5000);

        } else {
            msg_status.style.display = 'block';
            msg_status.style.color = 'rgba(255,0,0,0.7)';

            if (result.msg) msg_status.innerHTML = `${result.msg}`;
            else msg_status.innerHTML = 'Failed to sent a message please try again!';

            setTimeout(() => {
                msg_status.style.display = 'none';
            }, 5000);

        }
    } catch (error) { console.error(error); }
    hideLoader();
}

function showLoader(){
    submitButton.innerHTML = ``;
    const span = document.createElement('span');
    span.id = 'loader';
    submitButton.appendChild(span);
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
}

function hideLoader(){
    submitButton.innerHTML = 'Send Message';
    submitButton.disabled = false;
    submitButton.style.cursor = 'pointer';
}