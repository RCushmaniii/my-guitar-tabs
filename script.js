/**
 * Guitar Sample Store - Main JavaScript
 * Handles scroll animations, parallax effects, and share functionality
 * @author Robert Cushman & Brian Camacho
 */

'use strict';

// ============================================================================
// SCROLL REVEAL ANIMATION
// ============================================================================
/**
 * Intersection Observer for scroll-triggered reveal animations
 * Adds 'is-visible' class when elements enter viewport
 */
const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
        }
    }
}, { threshold: 0.15 }); // Trigger when 15% of element is visible

// Observe all elements with 'reveal' class
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ============================================================================
// PARALLAX EFFECT
// ============================================================================
/**
 * Smooth parallax background effect on scroll
 * Respects user's motion preferences for accessibility
 */
(function initParallax() {
    // Check if user prefers reduced motion (accessibility)
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // Respect user preference

    const sections = Array.from(document.querySelectorAll('.parallax'));
    if (!sections.length) return; // Exit if no parallax sections

    let ticking = false; // Throttle flag for requestAnimationFrame
    const speed = 0.15; // Parallax intensity (lower = subtler)

    /**
     * Update parallax positions
     * Uses requestAnimationFrame for smooth 60fps animation
     */
    function update() {
        ticking = false;
        const vh = window.innerHeight;
        
        for (const el of sections) {
            const rect = el.getBoundingClientRect();
            // Calculate center-based offset
            const raw = (vh / 2 - (rect.top + rect.height / 2)) * speed;
            // Clamp to prevent extreme values
            const offset = Math.max(-60, Math.min(60, raw));
            el.style.backgroundPosition = `center calc(50% + ${offset}px)`;
        }
    }

    /**
     * Throttle scroll events using requestAnimationFrame
     * Prevents performance issues from excessive updates
     */
    function requestTick() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    // Listen for scroll and resize events
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    
    // Initial update
    update();
})();

// ============================================================================
// FOOTER DYNAMIC YEAR
// ============================================================================
/**
 * Automatically updates copyright year in footer
 * Prevents outdated copyright notices
 */
(function setYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
})();

// ============================================================================
// SHARE FUNCTIONALITY
// ============================================================================
/**
 * Progressive enhancement for sharing
 * Uses native Web Share API on mobile, clipboard fallback on desktop
 */
(function initShare() {
    const shareLinks = document.querySelectorAll('.share-button');
    
    shareLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Data to share
            const shareData = {
                title: 'Sylvester Guitar Samples - Brian Camacho',
                text: 'Check out this premium guitar sample pack with TONE & DRY stems!',
                url: window.location.href
            };
            
            // Try native Web Share API first (mobile devices)
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    // User cancelled share - don't show error
                    if (err.name !== 'AbortError') {
                        console.log('Share failed:', err);
                        fallbackShare(link);
                    }
                }
            } else {
                // Fallback for desktop: copy to clipboard
                fallbackShare(link);
            }
        });
    });
    
    /**
     * Fallback share method using Clipboard API
     * Copies URL to clipboard and shows visual feedback
     */
    function fallbackShare(button) {
        const url = window.location.href;
        if (!button) return;
        
        // Try to copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            const originalNodes = Array.from(button.childNodes).map((n) => n.cloneNode(true));

            while (button.firstChild) {
                button.removeChild(button.firstChild);
            }

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');

            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline.setAttribute('points', '20 6 9 17 4 12');
            svg.appendChild(polyline);

            button.appendChild(svg);
            button.appendChild(document.createTextNode(' Link copied!'));

            setTimeout(() => {
                while (button.firstChild) {
                    button.removeChild(button.firstChild);
                }
                for (const n of originalNodes) {
                    button.appendChild(n);
                }
            }, 2000);
        }).catch(err => {
            // Clipboard API failed - show alert as last resort
            console.error('Failed to copy:', err);
            alert('Share URL: ' + url);
        });
    }
})();
(function initShellPage() {
    const shellRoot = document.querySelector('[data-shell]');
    if (!shellRoot) return;

    const titleEl = document.getElementById('shellTitle');
    const bodyEl = document.getElementById('shellBody');
    if (!titleEl || !bodyEl) return;

    const params = new URLSearchParams(window.location.search);
    const page = (params.get('page') || 'info').toLowerCase();

    const contentByPage = {
        privacy: {
            title: 'Privacy',
            body: [
                'This is a static portfolio-style landing page. It does not collect form submissions and does not intentionally store personal data in cookies or local storage.',
                'Payments are handled by PayPal via an external checkout link. Refer to PayPal\'s privacy policy for payment processing details.'
            ]
        },
        terms: {
            title: 'Terms',
            body: [
                'This is a demo storefront experience for a digital download. By purchasing, you agree not to redistribute the files as-is.',
                'If you have questions about usage or licensing, use the contact option below.'
            ]
        },
        licensing: {
            title: 'Licensing',
            body: [
                'You can use the purchased audio files in your own productions, including commercial releases.',
                'You may not resell, re-upload, or redistribute the raw files as a standalone product.'
            ]
        },
        downloads: {
            title: 'Downloads',
            body: [
                'After purchase, your download link is delivered to the email address used at checkout.',
                'If you don\'t see it within a few minutes, check spam/promotions. If it still doesn\'t arrive, contact us and we\'ll help.'
            ]
        },
        contact: {
            title: 'Contact',
            body: [
                'For delivery issues or questions, reach out on Instagram and we\'ll respond as soon as possible.',
                'This page is intentionally minimal as part of the portfolio/demo site.'
            ]
        },
        blog: {
            title: 'Blog',
            body: [
                'This is a placeholder page for a future blog section.',
                'In a production version, this would be where educational posts, release notes, and updates live.'
            ]
        },
        info: {
            title: 'More info',
            body: [
                'This page provides supporting content placeholders for a portfolio-style demo site.'
            ]
        }
    };

    const chosen = contentByPage[page] || contentByPage.info;

    titleEl.textContent = chosen.title;
    document.title = `${chosen.title} | Brian Camacho`;

    while (bodyEl.firstChild) {
        bodyEl.removeChild(bodyEl.firstChild);
    }

    for (const paragraph of chosen.body) {
        const p = document.createElement('p');
        p.textContent = paragraph;
        p.style.marginTop = '12px';
        bodyEl.appendChild(p);
    }
})();

// ============================================================================
// END OF SCRIPT
// ============================================================================