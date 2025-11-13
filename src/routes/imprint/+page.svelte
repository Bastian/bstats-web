<script>
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
</script>

<svelte:head>
    <meta name="description" content="The imprint." />
    <title>bStats - Imprint</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Legal</Badge>{/snippet}
        {#snippet title()}Imprint{/snippet}
        {#snippet content()}
            Information in accordance with Section 5 of the German Telemedia Act (TMG)
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12">
        <article class="doc-card prose" style="max-width: none">
            <h2>Contact information</h2>
            <p class="no-copy">
                <strong
                    ><span class="ltr-text"
                        >&#x456;&#x200B;&#x74;&#x455;&#x200B;&#x430;&#x200B;&#x392;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x440;&#x440;&#x200B;&#x41e;&#x200B;&#x20;&#x200B;&#x6e;&#x430;</span
                    ><span class="ltr-text"
                        >&#x6e;&#x6e;&#x200B;&#x430;&#x6d;&#x200B;&#x200B;&#x72;&#x435;&#x200B;</span
                    ></strong
                ><br />
                <span class="ltr-text"
                    >&#x6c;&#x435;&#x200B;&#x67;&#x200B;&#x435;&#x456;&#x200B;&#x200B;&#x440;&#x200B;&#x53;</span
                ><span class="ltr-text">&#x200B;&#x430;&#x200B;&#x72;&#x74;&#x455;&#x200B;</span
                ><span class="ltr-text">&#x36;&#x200B;&#x20;&#x200B;&#x435;&#xdf;&#x200B;</span><br
                />
                <span class="ltr-text">&#x200B;&#x36;&#x37;&#x200B;&#x30;&#x200B;&#x39;</span><span
                    class="ltr-text">&#x200B;&#xfc;&#x46;&#x200B;&#x20;&#x32;&#x200B;</span
                ><span class="ltr-text">&#x4bb;&#x200B;&#x74;&#x72;</span>,
                <span class="ltr-text"
                    >&#x200B;&#x443;&#x200B;&#x6e;&#x430;&#x200B;&#x6d;&#x200B;&#x72;&#x435;&#x200B;&#x47;&#x200B;</span
                ><br />
                <strong>Telephone:</strong>
                <span class="ltr-text"
                    >&#x33;&#x34;&#x32;&#x36;&#x31;&#x31;&#x32;<b>&#x20;</b
                    >&#x38;&#x37;&#x35;&#x31;<b>&#x20;</b>&#x39;&#x34;&#x2B;</span
                ><br />
                <strong>Email:</strong>
                <span class="ltr-text"
                    >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                ><span class="ltr-text"
                    >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                    class="ltr-text">&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                ><span class="ltr-text"
                    >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                ><span class="ltr-text"
                    >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                >
            </p>

            <hr />

            <h2>Disclaimer</h2>

            <h3>Liability for content</h3>
            <p>
                The content of this website has been created with the utmost care. However, we
                cannot guarantee that the content is accurate, complete, or up to date. Pursuant to
                Section&nbsp;7(1) TMG, we are responsible under general law for our own content on
                these pages. Under Sections&nbsp;8&nbsp;to&nbsp;10 TMG, however, we are not
                obligated to monitor any third-party information that is merely transmitted or
                stored, nor are we required to investigate circumstances indicating illegal
                activity. Obligations to remove or block the use of information under generally
                applicable laws remain unaffected.
            </p>

            <h3>Liability for links</h3>
            <p>
                Our website may contain links to external websites operated by third parties. We
                have no influence on the content of these external sites; therefore, we accept no
                liability for such external content. The respective provider or operator of any
                linked site is always responsible for its own content. At the time of linking, no
                legal violations were apparent. If we become aware of any legal infringement, we
                will remove the relevant link immediately.
            </p>

            <h3>Copyright</h3>
            <p>
                All content and works published on this website are subject to German copyright law.
                Any duplication, processing, distribution, or any form of commercialization of such
                material beyond the scope of copyright legislation shall require the prior written
                consent of the respective owner or author. Individual reproductions of a work are
                permitted only for private use and must not be used directly or indirectly for
                commercial purposes. The unauthorized use of copyrighted works may constitute an
                infringement under Section&nbsp;106 of the German Copyright Act (UrhG).
            </p>
        </article>
    </section>
</main>
