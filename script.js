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
    const shareLinks = document.querySelectorAll('.share-link a');
    
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
                        fallbackShare();
                    }
                }
            } else {
                // Fallback for desktop: copy to clipboard
                fallbackShare();
            }
        });
    });
    
    /**
     * Fallback share method using Clipboard API
     * Copies URL to clipboard and shows visual feedback
     */
    function fallbackShare() {
        const url = window.location.href;
        
        // Try to copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Show success feedback
            const link = document.querySelector('.share-link a');
            const originalText = link.innerHTML;
            
            // Update button text with checkmark
            link.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Link copied!';
            
            // Restore original text after 2 seconds
            setTimeout(() => {
                link.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            // Clipboard API failed - show alert as last resort
            console.error('Failed to copy:', err);
            alert('Share URL: ' + url);
        });
    }
})();

// ============================================================================
// END OF SCRIPT
// ============================================================================