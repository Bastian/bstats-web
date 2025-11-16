<script>
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
</script>

<svelte:head>
    <meta name="description" content="Our privacy policy." />
    <title>bStats - Privacy policy</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Legal</Badge>{/snippet}
        {#snippet title()}Privacy policy{/snippet}
        {#snippet content()}
            bStats collects only the information we need to provide useful metrics. Below you'll
            find details for both the plugin-side telemetry and the website account system.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12 space-y-12">
        <article
            id="plugin-privacy-policy"
            class="doc-card prose space-y-6"
            style="max-width: none"
        >
            <p class="text-sm text-slate-500 italic"><strong>Last updated:</strong> 2025/11/16</p>
            <h2 class="doc-card-title">bStats plugin privacy policy</h2>

            <p>
                If you are a server owner installing a plugin that uses bStats or a casual site
                visitor, this policy explains what data is collected, why, and how long it is
                retained. If you are a plugin developer registering an account on the bStats.org
                website, please refer to the <strong>bStats website privacy policy</strong> below.
            </p>

            <h3>1. Who we are (data controller)</h3>
            <p>
                <strong>bStats</strong> ("we," "us," or "our") refers to the open-source service that
                plugin developers embed into their game server plugins/mods for analytics. The data controller
                is:
            </p>
            <blockquote>
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
                    ><span class="ltr-text">&#x36;&#x200B;&#x20;&#x200B;&#x435;&#xdf;&#x200B;</span
                    ><br />
                    <span class="ltr-text">&#x200B;&#x36;&#x37;&#x200B;&#x30;&#x200B;&#x39;</span
                    ><span class="ltr-text">&#x200B;&#xfc;&#x46;&#x200B;&#x20;&#x32;&#x200B;</span
                    ><span class="ltr-text">&#x4bb;&#x200B;&#x74;&#x72;</span>,
                    <span class="ltr-text"
                        >&#x200B;&#x443;&#x200B;&#x6e;&#x430;&#x200B;&#x6d;&#x200B;&#x72;&#x435;&#x200B;&#x47;&#x200B;</span
                    ><br />
                    Email:
                    <strong class="no-copy"
                        ><span class="ltr-text"
                            >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                        ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                            class="ltr-text"
                            >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                        ><span class="ltr-text"
                            >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                        ></strong
                    >
                </p>
            </blockquote>

            <h3>2. Scope: What this policy covers</h3>
            <ul>
                <li>
                    <strong>bStats plugin embedding</strong>: This policy covers data collected when
                    plugins that include the bStats script are run on a server.
                </li>
                <li>
                    <strong>Server owners</strong>: Typically, you (as the server owner) do not
                    provide any personal data to bStats; only technical data about the server
                    environment is transmitted.
                </li>
                <li>
                    <strong>Custom metrics</strong>: Developers can add custom charts or metrics
                    beyond bStats' default collection. We prohibit collecting personal information.
                    We remove or ban offending plugins/authors if we discover misuse.
                </li>
            </ul>

            <h3>3. Data we collect and why</h3>
            <ol>
                <li>
                    <p><strong>Technical server data</strong></p>
                    <ul>
                        <li>
                            <strong>Examples</strong>: Operating System (OS), Java version, CPU
                            architecture, server version (e.g., Minecraft version), plugin/mod
                            version, and a pseudonymous server identifier for deduplication and
                            anti-abuse.
                        </li>
                        <li>
                            <strong>Purpose / legal basis</strong>: Provide analytics to plugin
                            developers and operate, protect, and improve the Service. For this
                            processing,
                            <strong>bStats acts as an independent controller</strong>
                            relying on <em>legitimate interests</em> under the GDPR/UK GDPR. Developers
                            remain separate controllers and must ensure they do not send personal data
                            to bStats.
                        </li>
                    </ul>
                </li>
                <li>
                    <p><strong>IP address (short-term storage)</strong></p>
                    <ul>
                        <li>
                            bStats receives an IP address with each data transmission for
                            rate-limiting and abuse prevention.
                        </li>
                        <li>
                            <strong>Retention (our systems)</strong>: IP addresses are stored for up
                            to <strong>60 minutes</strong> solely to track request volume, then discarded.
                            They are never linked to accounts or personal profiles.
                        </li>
                        <li>
                            <strong>Legal basis</strong>: Our legitimate interest in ensuring stable
                            service, preventing spam/abuse, and securing our infrastructure.
                        </li>
                    </ul>
                </li>
                <li>
                    <p><strong>Prohibited personal data in custom metrics</strong></p>
                    <ul>
                        <li>
                            Developers must not send personal data (names, emails, IPs, device
                            identifiers, or any data that can directly identify a natural person)
                            via custom metrics. We remove or ban any misuse.
                        </li>
                    </ul>
                </li>
            </ol>

            <h3>4. Legal bases for processing (GDPR/UK GDPR)</h3>
            <ul>
                <li>
                    <strong>Legitimate interests</strong>: Processing IP addresses briefly and using
                    pseudonymous server identifiers to prevent abuse and measure plugin usage for
                    service integrity and security.
                </li>
                <li>
                    <strong>Right to object</strong>: Where we rely on legitimate interests, you may
                    object at any time. Practically, server owners can disable telemetry (see
                    Section 5).
                </li>
            </ul>

            <h3>5. How to opt out</h3>
            <ul>
                <li>
                    <strong>Configuration file</strong>: Each plugin that includes bStats typically
                    generates a global config file. You can disable bStats here, preventing any
                    further data transmission from any plugin.
                </li>
            </ul>

            <h3>6. Data retention</h3>
            <ul>
                <li>
                    <strong>Server metrics</strong>: Aggregated, de-identified metrics
                    (non-personal) may remain in our databases indefinitely to track historical
                    trends.
                </li>
                <li>
                    <strong>IP addresses (our systems)</strong>: Stored only up to
                    <strong>60 minutes</strong> in a rate-limiting mechanism, then automatically erased.
                </li>
                <li>
                    <strong>Provider security logs</strong>: Our CDN/WAF and hosting providers may
                    retain limited security logs for short periods consistent with their policies
                    and our configurations. We configure the shortest practical retention and do not
                    use provider security logs to profile users.
                </li>
                <li>
                    <strong>Backups</strong>: If backups are kept, IP addresses are typically not
                    stored long-term. Any short-term logs are overwritten periodically.
                </li>
            </ul>

            <h3>7. Security measures</h3>
            <ul>
                <li>
                    <strong>Secure transmission</strong>: Data is sent over secure channels
                    (HTTPS/SSL).
                </li>
                <li>
                    <strong>Access controls</strong>: Only authorized personnel (e.g., site
                    maintainers) can access raw logs.
                </li>
                <li>
                    <strong>Infrastructure safeguards</strong>: We employ measures such as
                    firewalling, intrusion detection, and regular security reviews where feasible.
                </li>
            </ul>

            <h3>8. Third-party services, subprocessors, and international transfers</h3>
            <ul>
                <li>
                    <strong>Hosting</strong>: Our infrastructure is hosted by
                    <a href="https://www.gamehosting.it/">GameHosting.it</a>, which processes data
                    on our behalf.
                </li>
                <li>
                    <strong>Cloudflare</strong>: Traffic is routed through Cloudflare's network for
                    performance and security. Cloudflare may temporarily process IP addresses and
                    related connection data and set strictly necessary cookies.
                </li>
                <li>
                    <strong>International transfers</strong>: Where data is transferred outside your
                    jurisdiction (e.g., EU/EEA/UK to other countries), we rely on an appropriate
                    mechanism: adequacy decisions (including recognized frameworks), the EU 2021
                    Standard Contractual Clauses (and UK Addendum/IDTA, as applicable), and routine
                    transfer risk assessments. We apply encryption in transit, strict access
                    controls, and data minimization.
                </li>
            </ul>

            <h3>9. Your rights (GDPR and similar laws)</h3>
            <p>
                Depending on your local laws (e.g., GDPR in the EU/UK), you may have rights over
                personal data that we hold or process.:
            </p>
            <ul>
                <li><strong>Access</strong>: Confirm whether we process your personal data.</li>
                <li>
                    <strong>Erasure/rectification</strong>: Given the 60-minute retention window,
                    data will likely already be purged, but you can still contact us.
                </li>
                <li>
                    <strong>Objection</strong>: Object to processing based on legitimate interests;
                    we will honor objections unless we have compelling grounds.
                </li>
                <li>
                    <strong>Complaint</strong>: Lodge a complaint with your local supervisory
                    authority.
                </li>
            </ul>
            <p>
                We respond to GDPR/UK GDPR requests within one month (extendable where permitted).
            </p>

            <h3>10. Children's privacy</h3>
            <p>
                bStats does not knowingly collect personal data from children under the age of 13
                (or 16 in certain jurisdictions). The service is generally aimed at adult server
                owners and plugin developers. If you believe a minor's data was submitted, please
                contact us at
                <strong class="no-copy"
                    ><span class="ltr-text"
                        >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                    ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                        class="ltr-text"
                        >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                    ><span class="ltr-text"
                        >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                    ></strong
                >.
            </p>

            <h3>11. Prohibited personal data in custom metrics and enforcement</h3>
            <ul>
                <li>
                    If you suspect a plugin is using bStats to gather personal data, please contact
                    us at
                    <strong class="no-copy"
                        ><span class="ltr-text"
                            >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                        ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                            class="ltr-text"
                            >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                        ><span class="ltr-text"
                            >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                        ></strong
                    >. We will investigate and may remove or ban any misuse.
                </li>
            </ul>

            <h3>12. California privacy disclosures (CPRA/CCPA)</h3>
            <ul>
                <li>
                    <strong>Categories collected</strong>: Identifiers (IP address in transient
                    security logs, Internet/technical information (server telemetry and connection
                    metadata).
                </li>
                <li>
                    <strong>Purposes</strong>: Security/anti-abuse, service provision, and plugin
                    analytics.
                </li>
                <li>
                    <strong>Sensitive personal information</strong>: Not sought or used.
                </li>
                <li>
                    <strong>Sale/sharing</strong>: We <u>do not sell</u> or <u>share</u> personal information
                    as defined by the CPRA and do not engage in cross-context behavioral advertising.
                </li>
                <li>
                    <strong>Rights</strong>: Access, deletion, correction, and portability as
                    applicable. We will verify your request (e.g., by account login or request
                    metadata) and respond within 45 days (extendable as allowed).
                </li>
            </ul>

            <h3>13. Law enforcement and legal requests</h3>
            <p>
                We may preserve and disclose information if required by law or in good-faith belief
                that such action is reasonably necessary to comply with legal obligations, respond
                to lawful requests, or protect the rights, property, or safety of bStats, our users,
                or the public.
            </p>

            <h3>14. Changes to this plugin privacy policy</h3>
            <p>
                We may modify this document from time to time to stay up to date with new legal
                requirements or operational changes. We will post updated texts on our site with a
                revised “Last updated” date and, where changes are material, provide reasonable
                notice.
            </p>

            <h3>15. Contact information</h3>
            <p>
                If you have questions or concerns about how bStats processes server data, or if you
                suspect misuse by a plugin developer, please email us:
                <strong class="no-copy"
                    ><span class="ltr-text"
                        >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                    ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                        class="ltr-text"
                        >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                    ><span class="ltr-text"
                        >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                    ></strong
                >
            </p>
        </article>

        <article
            id="website-privacy-policy"
            class="doc-card prose space-y-6"
            style="max-width: none"
        >
            <p class="text-sm text-slate-500 italic"><strong>Last updated:</strong> 2025/11/10</p>
            <h2 class="doc-card-title">bStats website privacy policy</h2>

            <h3>1. Who we are (data controller)</h3>
            <p>
                This policy covers <strong>bStats.org</strong>, where plugin developers can register
                an account to view or manage plugin analytics. The data controller is:
            </p>
            <blockquote>
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
                    ><span class="ltr-text">&#x36;&#x200B;&#x20;&#x200B;&#x435;&#xdf;&#x200B;</span
                    ><br />
                    <span class="ltr-text">&#x200B;&#x36;&#x37;&#x200B;&#x30;&#x200B;&#x39;</span
                    ><span class="ltr-text">&#x200B;&#xfc;&#x46;&#x200B;&#x20;&#x32;&#x200B;</span
                    ><span class="ltr-text">&#x4bb;&#x200B;&#x74;&#x72;</span>,
                    <span class="ltr-text"
                        >&#x200B;&#x443;&#x200B;&#x6e;&#x430;&#x200B;&#x6d;&#x200B;&#x72;&#x435;&#x200B;&#x47;&#x200B;</span
                    ><br />
                    Email:
                    <strong class="no-copy"
                        ><span class="ltr-text"
                            >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                        ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                            class="ltr-text"
                            >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x64;&#x5d;</span
                        ><span class="ltr-text"
                            >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                        ></strong
                    >
                </p>
            </blockquote>

            <h3>2. Scope: Website visitors and registered users</h3>
            <ul>
                <li>
                    <strong>Public visitors</strong>: Anyone can visit bStats.org and view plugin
                    statistics without creating an account.
                </li>
                <li>
                    <strong>Registered users (plugin developers)</strong>: You can create an account
                    using a username and password and/or by linking an identity provider (e.g.,
                    GitHub). <strong>Providing an email address is optional</strong>. If you choose
                    to add an email, we will store it and its verification status to support account
                    recovery and security.
                </li>
            </ul>

            <h3>3. Information collected</h3>
            <ol>
                <li>
                    <p>
                        <strong>Account registration & profile</strong>
                    </p>
                    <ul>
                        <li>
                            <strong>Data</strong>: Unique user ID; display name; optional username
                            and display username; optional profile image; optional email address
                            with verification status; account state (role, banned flag, ban
                            reason/expiry); two-factor enabled status.
                        </li>
                        <li>
                            <strong>Password security</strong>: When you use a password, it is
                            stored using an industry-standard password hashing algorithm with
                            per-user salts. We never store plaintext passwords.
                        </li>
                        <li>
                            <strong>Purpose/legal basis</strong>: Contractual necessity to provide
                            and secure your account; legitimate interests for platform security.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Authentication sessions and audit</strong></p>
                    <ul>
                        <li>
                            <strong>Data</strong>: Session ID and token, creation/last activity
                            timestamps, expiry time; <strong>IP address</strong> and
                            <strong>user agent</strong> associated with the session.
                        </li>
                        <li>
                            <strong>Cookies</strong>: We set strictly necessary authentication
                            cookies (e.g., a session token) to keep you logged in. If you opt to
                            "remember" a 2FA device, we may set an additional strictly necessary
                            cookie for that purpose.
                        </li>
                        <li>
                            <strong>Purpose/legal basis</strong>: Contractual necessity to maintain
                            your session; legitimate interests in fraud prevention, abuse
                            mitigation, troubleshooting, and account support.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Linked accounts (OAuth/social sign-in)</strong></p>
                    <ul>
                        <li>
                            <strong>Data</strong>: Provider identifier and your account ID at that
                            provider; tokens needed to sign you in (e.g., access/refresh/ID tokens
                            and their expirations); authorized scopes.
                        </li>
                        <li>
                            <strong>Use</strong>: Solely to authenticate you and maintain the link
                            you requested. We do not receive your password from those providers. You
                            can unlink a provider at any time.
                        </li>
                        <li>
                            <strong>Legal basis</strong>: Contractual necessity and your
                            request/consent to link a provider.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Verification</strong></p>
                    <ul>
                        <li>
                            <strong>Data</strong>: One-time identifiers/tokens and their expiration
                            for actions such as email verification, password reset, or passwordless
                            sign-in.
                        </li>
                        <li>
                            <strong>Use</strong>: To complete the requested action; records are
                            purged automatically when expired.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Two-factor authentication (2FA)</strong></p>
                    <ul>
                        <li>
                            <strong>Data</strong>: 2FA secret and backup codes when you enable 2FA.
                        </li>
                        <li>
                            <strong>Security</strong>: Stored securely (hashed and/or encrypted) and
                            used only to verify your login. You can disable 2FA or regenerate codes
                            at any time.
                        </li>
                        <li>
                            <strong>Legal basis</strong>: Legitimate interests in account security
                            and your request to enable 2FA.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Cookies and related technologies</strong></p>
                    <ul>
                        <li>
                            <strong>Session cookies</strong>: Strictly necessary cookies keep you
                            logged in and remember preferences. We do not use third-party
                            marketing/behavioral tracking cookies.
                        </li>
                        <li>
                            <strong>Security/edge cookies</strong>: Our CDN/WAF may set necessary
                            cookies for bot management and challenge passes.
                        </li>
                        <li>
                            <strong>Legal basis</strong>: Strictly necessary cookies typically do
                            not require consent.
                        </li>
                    </ul>
                </li>

                <li>
                    <p><strong>Basic server/access logs</strong></p>
                    <ul>
                        <li>
                            Minimal access logs (including IPs) may be processed for security and
                            debugging; we aim to keep these ephemeral or short-retention.
                        </li>
                    </ul>
                </li>
            </ol>

            <h3>4. How we use your data</h3>
            <ul>
                <li>
                    <strong>Provide website services</strong>: Secure login (password and/or OAuth),
                    maintain sessions, support 2FA, link/unlink providers, associate plugin pages
                    with your account, and display analytics.
                </li>
                <li>
                    <strong>Security and reliability</strong>: Detect abuse, rate-limit requests,
                    protect our infrastructure, and troubleshoot issues. Limited, role-based staff
                    may review session IP/user-agent data for security.
                </li>
                <li>
                    <strong>Transactional communications</strong>: If you provide an email, we may
                    send verification, password reset, or security notices. We do not send marketing
                    emails. Email is optional.
                </li>
            </ul>

            <h3>5. Third-party processing, subprocessors, and international transfers</h3>
            <ul>
                <li>
                    <strong>Account management software</strong>: We operate authentication and
                    account features on our own infrastructure. Your account data remains in our
                    databases.
                </li>
                <li>
                    <strong>OAuth identity providers (if you choose to link)</strong>: For example,
                    GitHub or Google. We receive your provider identifier and tokens necessary for
                    sign-in and store them to maintain your login. You can revoke access via bStats
                    or your provider settings. Your provider's privacy policy applies to their
                    processing.
                </li>
                <li>
                    <strong>Hosting</strong>: Our site and data are hosted by
                    <a href="https://www.gamehosting.it/">GameHosting.it</a>.
                </li>
                <li>
                    <strong>Cloudflare</strong>: Used for content delivery and protection; processes
                    IP addresses and related connection data and may set strictly necessary cookies.
                </li>
                <li>
                    <strong>Email delivery (if email is used)</strong>: We send verification and
                    security emails using Amazon Simple Email Service (<em>Amazon SES</em>, part of
                    Amazon Web Services). When emails are sent, your <strong>email address</strong>,
                    <strong>message content</strong>, and related <strong>metadata</strong> (e.g.,
                    recipient, sender, subject, timestamps) are processed by AWS to deliver the
                    message and handle bounces/complaints. We configure SES for minimal retention
                    and use suppression lists only to improve deliverability. Emails are processed
                    by SES in the AWS region(s) we configure; depending on your location, this may
                    involve international data transfers.
                    <strong>Providing an email is optional</strong>; you may remove it at any time
                    (via account settings or by contacting us).
                </li>
                <li>
                    <strong>International transfers</strong>: Where applicable, we rely on adequacy
                    decisions or recognized frameworks, the EU 2021 Standard Contractual Clauses,
                    and, for the UK, the UK Addendum/IDTA. We conduct transfer risk assessments and
                    apply encryption, access controls, and minimization.
                </li>
            </ul>

            <h3>6. Data retention and deletion</h3>
            <ul>
                <li>
                    <strong>Account data</strong>: Your profile (display name, username, optional
                    email, optional image) and account state (role, ban status) remain until you
                    delete your account. Deleted data is removed from active systems promptly and
                    purged from backups over our regular rotation cycle.
                </li>
                <li>
                    <strong>Sessions</strong>: Kept until the session <code>expires</code> or you sign
                    out; stale sessions are routinely purged. Associated session IP/user-agent are stored
                    as part of the session record.
                </li>
                <li>
                    <strong>Linked accounts/tokens</strong>: Retained until you unlink the provider
                    or your account is deleted.
                </li>
                <li>
                    <strong>2FA secrets/backup codes</strong>: Retained until you disable 2FA or
                    regenerate codes.
                </li>
                <li>
                    <strong>Access/security logs</strong>: Retained for short periods consistent
                    with operational security and provider policies; configured to the shortest
                    practical duration.
                </li>
            </ul>

            <h3>7. Security measures</h3>
            <ul>
                <li><strong>Password protection</strong>: Hashing and salting (see Section 3).</li>
                <li>
                    <strong>2FA material</strong>: 2FA secrets and backup codes are stored securely
                    (hashed and/or encrypted) and used only for authentication.
                </li>
                <li>
                    <strong>Encryption</strong>: Data in transit is encrypted via HTTPS; session
                    tokens are stored in secure, HttpOnly cookies.
                </li>
                <li>
                    <strong>Access control</strong>: Only authorized personnel can manage the
                    website's infrastructure and stored data; security incidents are investigated
                    and, where legally required, we notify users/regulators.
                </li>
            </ul>

            <h3>8. Your rights (GDPR, UK GDPR, and similar laws)</h3>
            <p>
                Depending on your jurisdiction, you may have the right to access, rectify, erase,
                restrict, or object to processing, as well as data portability and the right to
                lodge a complaint with a supervisory authority. Where we rely on legitimate
                interests, you may object at any time.
            </p>
            <p>We respond to verified requests within one month (extendable as permitted).</p>

            <h3>9. California privacy disclosures (CPRA/CCPA)</h3>
            <ul>
                <li>
                    <strong>Categories collected</strong>: Identifiers (user ID, username; optional
                    email; provider/account identifiers); online identifiers (session token);
                    Internet/technical information (IP address, user agent); profile information
                    (display name, optional image); account status (role, ban status).
                </li>
                <li>
                    <strong>Sensitive personal information</strong>: Account login credentials
                    (hashed password) and 2FA material (secret/backup codes). Used only to provide
                    secure authentication; not used to infer characteristics.
                </li>
                <li>
                    <strong>Purposes</strong>: Account provision, security/anti-abuse, and
                    operational analytics.
                </li>
                <li>
                    <strong>Sale/sharing</strong>: We <u>do not sell</u> or <u>share</u> personal information
                    (as defined) and do not engage in cross-context behavioral advertising.
                </li>
                <li>
                    <strong>Rights</strong>: Access, deletion, correction, and portability. We
                    verify requests (e.g., by account login or request metadata) and respond within
                    45 days (extendable as allowed).
                </li>
            </ul>

            <h3>10. Children's privacy</h3>
            <p>
                bStats does not knowingly collect personal data from children under the age of 13
                (or 16 in certain jurisdictions). The service is generally aimed at adult server
                owners and plugin developers. If you believe a minor's data was submitted, please
                contact us at
                <strong class="no-copy"
                    ><span class="ltr-text"
                        >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                    ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                        class="ltr-text"
                        >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                    ><span class="ltr-text"
                        >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                    ></strong
                >.
            </p>

            <h3>11. Data protection officer / EU/UK representative</h3>
            <ul>
                <li>
                    We currently do not have a Data Protection Officer (DPO). If your jurisdiction
                    requires a designated representative or DPO, please contact us at
                    <strong class="no-copy"
                        ><span class="ltr-text"
                            >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                        ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                            class="ltr-text"
                            >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                        ><span class="ltr-text"
                            >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                        ><span class="ltr-text"
                            >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                        ></strong
                    >
                    for more information.
                </li>
                <li>
                    If we are required to appoint an EU/UK representative under Art. 27, we will
                    update this policy accordingly and publish the representative's contact details.
                </li>
            </ul>

            <h3>12. Law enforcement and legal requests</h3>
            <p>
                We may preserve and disclose information if required by law or where we believe in
                good faith that it is necessary to comply with legal obligations, respond to lawful
                requests, or protect the rights, property, or safety of bStats, our users, or the
                public.
            </p>

            <h3>13. Changes to this website privacy policy</h3>
            <p>
                We may update this policy as needed—for example, to reflect legal changes or
                evolving service features. We will post updated texts on our site with a revised
                "Last updated" date.
            </p>

            <h3>14. How to contact us</h3>
            <p>
                For questions, concerns, or requests related to privacy on bStats.org:
                <strong class="no-copy"
                    ><span class="ltr-text"
                        >&#x430;&#x200B;&#x74;&#x200B;&#x6e;&#x200B;&#x43e;&#x441;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x74;&#x200B;&#x430;&#x200B;&#x5d;&#x20;&#x200B;&#x74;&#x200B;&#x441;</span
                    ><span class="ltr-text">&#x455;&#x62;&#x20;&#x200B;&#x5b;</span><span
                        class="ltr-text"
                        >&#x20;&#x455;&#x200B;&#x200B;&#x74;&#x200B;&#x430;&#x74;</span
                    ><span class="ltr-text"
                        >&#x200B;&#x5b;&#x74;&#x200B;&#x200B;&#x43e;&#x200B;&#x64;&#x200B;&#x5d;</span
                    ><span class="ltr-text"
                        >&#x67;&#x200B;&#x72;&#x200B;&#x200B;&#x43e;&#x200B;&#x20;</span
                    ></strong
                >
            </p>
        </article>
    </section>
</main>
