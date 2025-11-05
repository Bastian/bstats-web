<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // Underlying <h-captcha> element API (from @hcaptcha/vanilla-hcaptcha)
    interface HCaptchaElement extends HTMLElement {
        render(config?: Record<string, unknown>): void;
        execute(): void;
        executeAsync(): Promise<unknown>;
        reset(): void;
    }

    export type VerifiedPayload = { token: string; eKey: string };

    type Props = {
        sitekey: string;
        size?: 'normal' | 'compact' | 'invisible';
        theme?: 'light' | 'dark';
        hl?: string;
        autoRender?: boolean;
        challengeContainer?: string;
        rqdata?: string;

        // API attrs
        recaptchacompat?: boolean;
        jsapi?: string;
        endpoint?: string;
        reportapi?: string;
        assethost?: string;
        imghost?: string;
        sentry?: boolean;

        id?: string;
        class?: string;
        style?: string;

        onVerified?: (data: VerifiedPayload) => void;
        onExpired?: () => void;
        onChallengeExpired?: () => void;
        onOpened?: () => void;
        onClosed?: () => void;
        onError?: (err: Event) => void;

        token?: string | null;
        eKey?: string | null;
    };

    let {
        sitekey,
        size = 'normal',
        theme = 'light',
        hl,
        autoRender = true,
        challengeContainer,
        rqdata,
        recaptchacompat = true,
        jsapi,
        endpoint,
        reportapi,
        assethost,
        imghost,
        sentry,

        id,
        class: klass,
        style,

        onVerified,
        onExpired,
        onChallengeExpired,
        onOpened,
        onClosed,
        onError,

        token = $bindable<string | null>(null),
        eKey = $bindable<string | null>(null)
    }: Props = $props();

    // Ref to underlying web component
    let el: HCaptchaElement | undefined;

    // Track/cleanup listeners we register manually (good for hyphenated event names)
    const listeners: Array<{ type: string; handler: EventListener }> = [];
    function listen(type: string, handler: EventListener) {
        if (!el) return;
        el.addEventListener(type, handler);
        listeners.push({ type, handler });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleVerified(e: any) {
        // Library may send data as e.detail or as direct properties; normalize
        const t = e?.detail?.token ?? e?.token ?? e?.detail?.response ?? e?.response ?? null;
        const k = e?.detail?.eKey ?? e?.eKey ?? e?.detail?.key ?? e?.key ?? null;

        token = t;
        eKey = k;
        if (t && k) onVerified?.({ token: t, eKey: k });
    }

    function handleExpired() {
        token = null;
        eKey = null;
        onExpired?.();
    }

    function handleChallengeExpired() {
        onChallengeExpired?.();
    }

    function handleOpened() {
        onOpened?.();
    }

    function handleClosed() {
        onClosed?.();
    }

    function handleError(e: Event) {
        token = null;
        eKey = null;
        onError?.(e);
    }

    onMount(async () => {
        // Register the custom element client-side to avoid SSR issues
        await import('@hcaptcha/vanilla-hcaptcha');

        // Attach listeners (use addEventListener to support hyphenated custom events)
        if (el) {
            listen('verified', handleVerified);
            listen('expired', () => handleExpired());
            listen('challenge-expired', () => handleChallengeExpired());
            listen('opened', () => handleOpened());
            listen('closed', () => handleClosed());
            listen('error', (e) => handleError(e));
        }
    });

    onDestroy(() => {
        if (!el) return;
        for (const { type, handler } of listeners) el.removeEventListener(type, handler);
    });

    // Imperative API exports (usable via bind:this on the component instance)
    export function reset() {
        el?.reset?.();
        token = null;
        eKey = null;
    }
    export function execute() {
        el?.execute?.();
    }
    export async function executeAsync(): Promise<unknown> {
        return await el?.executeAsync?.();
    }
    export function render(config?: Record<string, unknown>) {
        el?.render?.(config);
    }
</script>

<!-- Render only the hCaptcha element and map props to its attributes -->
<h-captcha
    bind:this={el}
    {id}
    class={klass}
    {style}
    {sitekey}
    {size}
    {theme}
    {hl}
    {recaptchacompat}
    auto-render={autoRender}
    challenge-container={challengeContainer}
    {rqdata}
    {jsapi}
    {endpoint}
    {reportapi}
    {assethost}
    {imghost}
    {sentry}
></h-captcha>
