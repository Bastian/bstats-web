/**
 * An easy utility hook that allows you to implement accessibly and
 * user-friendly dropdown menu. This hook should be applied to the
 * button (or its wrapper) that controls the dropdown.
 */
export default function dropdownToggle(
    node: HTMLElement,
    onEventFunction: (open: boolean) => void
): unknown {
    let open = false;

    let lastAction = 0;
    let timer: NodeJS.Timeout;

    const handleGlobalClick = (event: MouseEvent) => {
        const path = event.composedPath();

        if (!path.includes(node)) {
            lastAction = Date.now();
            open = false;
            onEventFunction(open);
        }
    };

    const handleClick = () => {
        if (Date.now() - lastAction > 200) {
            // Prevent double triggering with mouse-over
            open = !open;
            onEventFunction(open);
        }
    };

    const handleMouseOver = () => {
        lastAction = Date.now();
        open = true;
        clearTimeout(timer);
        onEventFunction(open);
    };

    const handleMouseLeave = () => {
        // Instead of closing the dialog immediately when the user leaves
        // it with their mouse, we add a small delay in case the user just
        // "overshot". This is recommended by
        // https://www.w3.org/WAI/tutorials/menus/flyout/#mouse-users
        timer = setTimeout(() => {
            lastAction = Date.now();
            open = false;
            onEventFunction(open);
        }, 350);
    };

    document.addEventListener("click", handleGlobalClick);
    node.addEventListener("click", handleClick);
    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseleave", handleMouseLeave);

    return {
        destroy() {
            document.removeEventListener("click", handleGlobalClick);
            node.removeEventListener("click", handleClick);
            node.removeEventListener("mouseover", handleMouseOver);
            node.removeEventListener("mouseleave", handleMouseLeave);
        },
    };
}
