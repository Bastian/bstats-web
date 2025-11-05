import type { Attachment } from 'svelte/attachments';

/**
 * Makes an element tabbable (tabIndex=0) if it is overflowing and scrollbars
 * are visible.
 *
 * This is useful for accessibility to allow keyboard users to focus and scroll
 * overflowing content (e.g. code blocks).
 */
export const tabbableIfOverflow: Attachment = (el) => {
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;

    const update = () => {
        if (el instanceof HTMLElement === false) {
            return;
        }

        const style = getComputedStyle(el);
        const scrollX =
            (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
            el.scrollWidth > el.clientWidth;
        const scrollY =
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight;

        if (scrollX || scrollY) {
            el.tabIndex = 0; // reachable via Tab
        } else {
            el.removeAttribute('tabindex');
        }
    };

    // Run once after mount (and in a microtask to catch initial children)
    update();
    queueMicrotask(update);

    // React to container size changes
    ro = new ResizeObserver(update);
    ro.observe(el);

    // React to async content changes
    mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });

    // React to viewport changes
    const onResize = () => update();
    window.addEventListener('resize', onResize);

    // React once when webfonts finish loading (glyph widths can change scrollWidth)
    document.fonts?.ready.then(update).catch(() => {});

    return () => {
        ro?.disconnect();
        mo?.disconnect();
        window.removeEventListener('resize', onResize);
    };
};
