// Title hover scroll for overflowing text
function setupTitleHoverScroll() {
    const cards = document.querySelectorAll('.campaign-card');
    cards.forEach((card) => {
        const container = card.querySelector('.campaign-title');
        const span = container && container.querySelector('.title-text');
        if (!container || !span) return;

        let rafId = null;
        let startTime = null;
        const durationMs = 16000; // slower scroll
        let distance = 0;

        const reset = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
            startTime = null;
            span.style.transform = 'translateX(0)';
        };

        const animate = (ts) => {
            if (startTime === null) startTime = ts;
            const elapsed = ts - startTime;
            const t = Math.min(elapsed / durationMs, 1);
            span.style.transform = `translateX(${-distance * t}px)`;
            if (t < 1) {
                rafId = requestAnimationFrame(animate);
            } else {
                // scroll back
                startTime = null;
                const back = (ts2) => {
                    if (startTime === null) startTime = ts2;
                    const e2 = ts2 - startTime;
                    const t2 = Math.min(e2 / durationMs, 1);
                    span.style.transform = `translateX(${-distance * (1 - t2)}px)`;
                    if (t2 < 1) rafId = requestAnimationFrame(back);
                };
                rafId = requestAnimationFrame(back);
            }
        };

        card.addEventListener('mouseenter', () => {
            const overflow = span.scrollWidth - container.clientWidth;
            if (overflow > 4) {
                distance = overflow;
                reset();
                rafId = requestAnimationFrame(animate);
            }
        });

        card.addEventListener('mouseleave', reset);
    });
}

document.addEventListener('DOMContentLoaded', setupTitleHoverScroll);
