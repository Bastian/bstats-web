export default function scrollIntoView(
    node: HTMLElement,
    parameters?: { offset?: number }
): unknown {
    const y =
        node.getBoundingClientRect().top +
        window.pageYOffset +
        (parameters?.offset ?? 0);

    if (window != undefined) {
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    return {
        destroy() {
            /* NOP */
        },
    };
}
