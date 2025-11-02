// Placeholder JS – you can hook up PayPal links or quantity logic later
console.log("Page loaded");

// Scroll reveal
const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
        }
    }
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Parallax: smooth background shift on scroll
(function initParallax() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // respect user preference

    const sections = Array.from(document.querySelectorAll('.parallax'));
    if (!sections.length) return;

    let ticking = false;
    const speed = 0.15; // softer intensity on short pages

    function update() {
        ticking = false;
        const vh = window.innerHeight;
        for (const el of sections) {
            const rect = el.getBoundingClientRect();
            // Center-based offset, clamped to avoid big jumps at the very top/bottom
            const raw = (vh / 2 - (rect.top + rect.height / 2)) * speed;
            const offset = Math.max(-60, Math.min(60, raw));
            el.style.backgroundPosition = `center calc(50% + ${offset}px)`;
        }
    }

    function requestTick() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    update();
})();

// Footer dynamic year
(function setYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

// Share functionality
(function initShare() {
    const shareLinks = document.querySelectorAll('.share-link a');
    
    shareLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const shareData = {
                title: 'Sylvester Guitar Samples - Brian Camacho',
                text: 'Check out this premium guitar sample pack with TONE & DRY stems!',
                url: window.location.href
            };
            
            // Use native Web Share API if available (mobile)
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.log('Share failed:', err);
                        fallbackShare();
                    }
                }
            } else {
                // Fallback: copy to clipboard
                fallbackShare();
            }
        });
    });
    
    function fallbackShare() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            // Show temporary feedback
            const link = document.querySelector('.share-link a');
            const originalText = link.innerHTML;
            link.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Link copied!';
            setTimeout(() => {
                link.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Share URL: ' + url);
        });
    }
})();