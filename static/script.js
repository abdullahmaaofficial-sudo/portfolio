const description_box = document.querySelectorAll('.skill-description')
const sk_namebox = document.querySelectorAll('.sk-name-box')
const contactForm = document.getElementById('contact-form');
const submitButton = document.querySelector("button[type='submit']")
const msg_status = document.getElementById('msg-status');



sk_namebox.forEach(box => box.addEventListener('click', () => {
    const clikedElement = document.getElementById(`${box.dataset.tagName}-desc`);
    const arrowIcon = box.querySelector('.arrow-icon');
    const wasOpen = clikedElement.classList.contains('is-open');

    description_box.forEach(b => {
        if (b !== clikedElement) closeDescription(b);
    });
    document.querySelectorAll('.arrow-icon').forEach(icon => {
        icon.innerHTML = `<i class="fa-regular fa-square-caret-down"></i>`;
    });

    if (!wasOpen) {
        openDescription(clikedElement);
        arrowIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    } else {
        closeDescription(clikedElement);
    }
}));

function openDescription(el){
    if (el.classList.contains('is-open')) return;
    el.classList.add('is-open');
    el.style.display = 'block';
    el.style.overflow = 'hidden';
    gsap.fromTo(el,
        { height: 0, opacity: 0 },
        {
            height: 'auto',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => { el.style.overflow = ''; }
        }
    );
}

function closeDescription(el){
    if (!el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.style.overflow = 'hidden';
    gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            el.style.display = 'none';
            el.style.overflow = '';
        }
    });
}


gsap.registerPlugin(ScrollTrigger);

// Recalculate trigger positions once everything (fonts, icons, images) has fully loaded,
// since layout shifts after initial script run can throw off scroll positions.
window.addEventListener('load', () => ScrollTrigger.refresh());

// Page loader: tracks real progress of every image on the page and only
// hides once all of them (plus the rest of the window's resources) are done.
const pageLoader = document.getElementById('page-loader');
const barFill = document.getElementById('loader-bar-fill');
const percentText = document.getElementById('loader-percent');

const loaderImages = Array.from(document.images);
const loaderTotal = loaderImages.length;
let loaderLoaded = 0;
let loaderWindowDone = false;

function updateLoaderProgress(){
    const percent = loaderTotal === 0 ? 100 : Math.min(100, Math.round((loaderLoaded / loaderTotal) * 100));
    barFill.style.width = percent + '%';
    percentText.textContent = percent + '%';
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
    pageLoader.classList.add('loader-hidden');
    document.body.classList.remove('is-loading');
}

updateLoaderProgress();

loaderImages.forEach(img => {
    if (img.complete) {
        markImageLoaded();
    } else {
        img.addEventListener('load', markImageLoaded);
        img.addEventListener('error', markImageLoaded);
    }
});

window.addEventListener('load', () => {
    loaderWindowDone = true;
    checkLoaderDone();
});

// Header slides in
gsap.from('header', { y: -60, opacity: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' });

// Hero section entrance timeline (plays once, on load)
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });
heroTl
    .from('.img-box', { opacity: 0, scale: 0.8, duration: 0.8 })
    .from('#intro', { opacity: 0, y: 30, duration: 0.6 }, '-=0.5')
    .from('#headline', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
    .from('#info', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.social-links', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
    .from('.buttons-box a', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.3');

// Small helper for "fade up on scroll into view" — fires every time the element enters view
function revealOnScroll(selector, vars = {}){
    gsap.utils.toArray(selector).forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom top',
                toggleActions: 'restart none restart none'
            },
            ...vars
        });
    });
}

// About
revealOnScroll('.about-heading');
revealOnScroll('.paragraph');
revealOnScroll('.education');

// Projects
revealOnScroll('.project-heading');
gsap.from('.project', {
    opacity: 0,
    y: 50,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.projects-box',
        start: 'top 82%',
        end: 'bottom top',
        toggleActions: 'restart none restart none'
    }
});

// Skills
revealOnScroll('.skills-heading');
gsap.from('.skills-box .skill', {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.skills-box',
        start: 'top 85%',
        end: 'bottom top',
        toggleActions: 'restart none restart none'
    }
});
gsap.from('.techs-box .skill', {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.techs-box',
        start: 'top 85%',
        end: 'bottom top',
        toggleActions: 'restart none restart none'
    }
});

// Contact
revealOnScroll('.contact-heading');
revealOnScroll('.co-social-box');
revealOnScroll('.form-box');

contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formDate = new FormData(contactForm);
    submitForm(formDate);
})

async function submitForm(data){
    showLoader()
    try{
        const response = await fetch('/contact', {
            method: 'POST',
            body: data
        })

        const result = await response.json()

        if (response.ok) contactForm.reset();
        if (result.sent) {
            msg_status.style.display = 'block'
            msg_status.innerHTML = `${result.msg} ✓`;

            setTimeout(() => {
                msg_status.style.display = 'none';
            },5000)

        } else {
            msg_status.style.display = 'block'
            msg_status.style.color = 'rgba(255,0,0,0.7)';

            if (result.msg) msg_status.innerHTML = `${result.msg}`;
            else msg_status.innerHTML = 'Failed to sent a message please try again!'

            setTimeout(() => {
                msg_status.style.display = 'none';
            },5000)
    
        }
    } catch (error) {console.error(error)}
    hideLoader()
};

function showLoader(){
    submitButton.innerHTML = ``;
    const span = document.createElement('span');
    span.id = 'loader'
    submitButton.appendChild(span)
    submitButton.disabled = true
    submitButton.style.cursor = 'not-allowed';
};

function hideLoader(){
    submitButton.innerHTML = 'Send Message'
    submitButton.disabled = false
    submitButton.style.cursor = 'pointer';
}