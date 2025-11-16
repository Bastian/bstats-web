<script>
    import { resolve } from '$app/paths';
    import Badge from '$lib/components/badge.svelte';
    import PageHero from '$lib/components/page-hero.svelte';
</script>

<svelte:head>
    <meta name="description" content="Terms of use" />
    <title>bStats - Terms of use</title>
</svelte:head>

<main class="pb-24">
    <PageHero>
        {#snippet badge()}<Badge>Legal</Badge>{/snippet}
        {#snippet title()}Terms of use{/snippet}
        {#snippet content()}
            Please read these terms carefully before using bStats. By accessing or using any part of
            the Service, you agree to be bound by these terms of use.
        {/snippet}
    </PageHero>

    <section class="doc-container mt-12">
        <article class="doc-card prose" style="max-width: none">
            <p class="text-sm text-slate-500 italic">
                <strong>Last updated:</strong> 2025/11/16
            </p>

            <h2>1. Introduction</h2>
            <p>
                <strong>bStats</strong> ("bStats," "we," "us," or "our") is an open-source analytics
                service that plugin/mod developers integrate into their software to gather technical
                usage data. These terms of use (the "<strong>Terms</strong>") govern your access to
                and use of:
            </p>
            <ul>
                <li>
                    The bStats website (<strong>bStats.org</strong>) and any related subdomains (the
                    "<strong>Site</strong>").
                </li>
                <li>
                    The bStats code, including the Metrics class embedded in plugins (the "<strong
                        >bStats Code</strong
                    >" or "<strong>Metrics Class</strong>").
                </li>
                <li>
                    Any other services, dashboards, or tools provided by bStats (collectively, the "<strong
                        >Service</strong
                    >").
                </li>
            </ul>
            <p>
                By accessing or using any part of the Service, you agree to be bound by these Terms.
                If you do not agree, you must discontinue use of the Service immediately.
            </p>

            <h2>2. Definitions</h2>
            <ul>
                <li>
                    <strong>Developer</strong>: A person or entity that includes the Metrics Class
                    in a plugin/mod.
                </li>
                <li>
                    <strong>Server Operator</strong>: A person or entity operating a game server
                    (e.g., a Minecraft server) running a plugin that includes the Metrics Class.
                </li>
                <li>
                    <strong>User</strong>: Any individual or entity that accesses the Site or
                    Service, including Developers, Server Operators, and visitors.
                </li>
                <li>
                    <strong>Custom Charts</strong>: Developer-defined charts or fields submitted to
                    the Service.
                </li>
            </ul>

            <h2>3. Scope and eligibility</h2>
            <h3>Who is covered</h3>
            <ul>
                <li><strong>Plugin developers</strong></li>
                <li><strong>Server operators</strong></li>
                <li><strong>Website visitors</strong></li>
            </ul>
            <h3>Age restrictions</h3>
            <p>
                The Service is not intended for use by anyone under the age of 13. If you are
                located in a jurisdiction with a higher digital age of consent (generally 13-16 in
                the EEA/UK), you must meet that age. If you are under the applicable age, you may
                use the Service only under the supervision of a parent or legal guardian who agrees
                to be bound by these Terms on your behalf. We do not knowingly collect personal
                information from children under 13. If we learn that we have collected personal
                information from a child under 13, we will delete it. Any account creation must be
                performed only by individuals who meet the applicable age threshold. Please see our
                <a href={resolve('/privacy-policy')} target="_blank">privacy policy</a>
                for more information or to learn how to contact us regarding children's data.
            </p>

            <h2>4. Open-source licensing and ownership</h2>
            <p>
                <strong>Open-source code:</strong> The bStats Code is provided under the
                <em>MIT License</em>. Your rights to the bStats Code are governed by that license,
                which is separate from these Terms.
            </p>
            <p>
                <strong>Plugins:</strong> Developers retain all rights to their plugin/mod code. Nothing
                in these Terms transfers ownership of any plugin intellectual property to bStats.
            </p>

            <h2>5. Metrics Class integrity (use of the Service)</h2>
            <p>
                While the open-source license for the bStats Code may permit modifications, your
                access to and use of the
                <em>Service</em> (i.e., bStats' hosted collectors, dashboards, and related
                infrastructure) is expressly conditioned on leaving the
                <strong>Metrics Class</strong>
                unmodified, <em>except</em> for package-name relocation. The only permitted change
                is to relocate the package name (either by manually editing the <code>package</code>
                declaration or by using relocation/shading that performs
                <em>package relocation only</em>).
            </p>
            <ul>
                <li>
                    <strong>All other modifications are prohibited.</strong> You must not alter source
                    or bytecode, rename classes, methods, or fields, change logic or data collected,
                    inject additional endpoints, wrap or intercept calls, or otherwise modify the Metrics
                    Class. You must exclude the Metrics Class from obfuscation, shrinking, minification,
                    instrumentation, or any transformation beyond package relocation.
                </li>
                <li>
                    <strong>Opt-out integrity.</strong> You must not remove, disable, hide, or interfere
                    with the bStats opt-out or any related configuration checks.
                </li>
                <li>
                    <strong>Forks sending data to non-bStats servers.</strong> If you modify the
                    Metrics Class (or bStats Code) to post data to any server other than bStats'
                    official collectors, you may <em>not</em> use the Service. In that case you must:
                    (i) remove all bStats branding, names, and identifiers from code, user interfaces,
                    and documentation; and (ii) not use, ship, read, or modify any bStats configuration
                    file(s) or directories (e.g., any “bStats” config), and ensure the modified code
                    does not contact bStats infrastructure.
                </li>
                <li>
                    <strong>Use the public APIs instead of modifying the Metrics Class.</strong> If you
                    need additional telemetry (e.g., Custom Charts), implement it via your plugin/mod
                    using the documented bStats APIs without altering the Metrics Class itself.
                </li>
                <li>
                    <strong>Enforcement.</strong> We may block, throttle, or otherwise restrict clients
                    that violate this section and may remove or disable related dashboards or datasets.
                </li>
                <li>
                    <strong>License clarification.</strong> This section governs access to the
                    Service and does not limit your rights under the applicable open-source license
                    when using the code <em>without</em> connecting to the Service.
                </li>
            </ul>

            <h2>6. Prohibited data (including Custom Charts)</h2>
            <p>
                Do not configure or use bStats to collect, submit, or transmit data that is personal
                or sensitive, including but not limited to:
            </p>
            <ul>
                <li>
                    IP addresses (full or truncated), device or hardware identifiers, MAC addresses,
                    advertising IDs;
                </li>
                <li>
                    Player usernames, player UUIDs/IDs (including hashed or salted), emails, account
                    IDs from any platform;
                </li>
                <li>
                    Chat logs, command history, free-text fields likely to contain personal data;
                </li>
                <li>Geolocation (including GPS coordinates), precise location, or addresses;</li>
                <li>Server IP addresses/domains or other sensitive server-specific information;</li>
                <li>Secrets, API tokens, private keys, passwords, or authentication material.</li>
            </ul>
            <p>
                bStats reserves the right to investigate and remove any plugins or Developers who
                misuse the Service by collecting prohibited data, and to delete offending datasets.
            </p>

            <h2>7. Data roles and Developer obligations</h2>
            <ol>
                <li>
                    <strong>Roles.</strong> bStats provides telemetry infrastructure and dashboards
                    and designs the Service to avoid processing personal data. For service and
                    security data that bStats collects directly (e.g., server logs, abuse signals),
                    bStats acts as an independent controller. bStats is <em>not</em> a processor for
                    Developer-submitted telemetry. No controller-processor relationship is created by
                    your use of the Service, and bStats will not enter into a Data Processing Agreement
                    (DPA). If you require a processor or a DPA, you must not use the Service.
                </li>
                <li>
                    <strong>Obligations.</strong> For any data you send, you represent that you have
                    a lawful basis to collect and transmit such data and that required notices have been
                    provided.
                </li>
                <li>
                    <strong>No personal data.</strong> You will not submit personal data or data reasonably
                    linkable to an individual. If you accidentally submit such data, you must notify
                    us promptly and remove the submission.
                </li>
            </ol>

            <h2>8. User responsibilities</h2>
            <ul>
                <li>
                    <strong>Compliance with laws:</strong> You will use the Service only in compliance
                    with all applicable laws and regulations.
                </li>
                <li>
                    <strong>Accurate information:</strong> If you create an account, you must provide
                    accurate information and safeguard your credentials.
                </li>
                <li>
                    <strong>No abuse of Service:</strong> You will not access non-public areas, interfere
                    with infrastructure, reverse engineer, or circumvent security features.
                </li>
            </ul>

            <h2>9. Privacy policy</h2>
            <p>
                Your use of the Service is also governed by our
                <a href={resolve('/privacy-policy')} target="_blank">privacy policy</a>, which
                explains how we collect, use, and protect data. In the event of a conflict between
                these Terms and our privacy policy regarding data handling, the privacy policy
                prevails.
            </p>

            <h2>10. Service changes and availability</h2>
            <p>
                bStats is open-source and maintained by volunteers and contributors. We may modify,
                suspend, or discontinue the Site or any feature of the Service at any time without
                liability. We do not guarantee that the Service or code will be free from defects or
                available without interruption.
            </p>

            <h2>11. Security and vulnerability disclosure</h2>
            <p>
                We implement reasonable technical and organizational measures appropriate to the
                nature of the Service. Do not perform testing that could disrupt the Service. Report
                vulnerabilities privately and allow a reasonable remediation period before public
                disclosure.
            </p>

            <h2>12. API, rate limits, and anti-scraping</h2>
            <p>
                We may publish or change API endpoints, quotas, and rate limits at any time. You may
                not scrape, bulk export, or rehost dashboards or datasets without prior written
                consent. Caching for personal or project use is allowed within published limits and
                must respect robots directives and caching headers.
            </p>

            <h2>13. Intellectual property; complaints; trademarks</h2>
            <ul>
                <li>
                    <strong>Content ownership:</strong> The Site and Service may display plugin names,
                    versions, and aggregated metrics. Third-party names and marks remain the property
                    of their respective owners.
                </li>
                <li>
                    <strong>Notice and takedown:</strong> If you believe content on the Service infringes
                    your rights, send us a notice with: (i) identification of the work; (ii) the infringing
                    material/URL; (iii) your contact details; and (iv) a statement under penalty of perjury
                    that you are authorized to act. We may remove or disable access and notify the submitter.
                </li>
                <li>
                    <strong>Trademarks:</strong> "bStats" and related logos are our trademarks. You may
                    not use them without prior written permission, except for nominative fair use.
                </li>
            </ul>

            <h2>14. Disclaimers of warranties</h2>
            <ul>
                <li>
                    <strong>"As-Is" and "As Available":</strong> The Service and all associated software
                    (including bStats Code) are provided on an "as-is" and "as available" basis.
                </li>
                <li>
                    <strong>No warranty:</strong> To the fullest extent permitted by law, we disclaim
                    all warranties and conditions, whether express, implied, statutory, or otherwise,
                    including implied warranties of merchantability, fitness for a particular purpose,
                    and non-infringement.
                </li>
                <li>
                    <strong>Open-source nature:</strong> We do not guarantee that the Service or code
                    will be free from defects or available without interruption.
                </li>
            </ul>

            <h2>15. Limitation of liability</h2>
            <ul>
                <li>
                    <strong>Exclusion of damages:</strong> To the fullest extent permitted by law, bStats
                    shall not be liable for any indirect, incidental, consequential, special, or exemplary
                    damages, loss of data, loss of profits, or costs of procurement of substitute goods
                    or services arising out of or related to your use of (or inability to use) the Service.
                </li>
                <li>
                    <strong>Aggregate liability cap:</strong> In no event shall bStats' total liability
                    to you for all claims arising out of or relating to these Terms exceed the amount
                    you paid (if any) for using the Service in the preceding twelve (12) months (or EUR
                    €0.00 if you have not paid any fees).
                </li>
                <li>
                    <strong>Exception:</strong> Some jurisdictions do not allow the limitation or exclusion
                    of liability for certain damages; in such cases, the liability will be limited to
                    the greatest extent permitted by law. Nothing in these Terms limits or excludes liability
                    of bStats (a) for intent or gross negligence; (b) for injury to life, body or health;
                    (c) under the German Product Liability Act; or (d) where we have assumed a guarantee
                    or fraudulently concealed a defect. In the event of simple negligence, we are liable
                    only for breach of such contractual duties the fulfillment of which is essential
                    for the proper performance of the contract and on the observance of which you regularly
                    rely (wesentliche Vertragspflichten); in such cases our liability is limited to the
                    foreseeable damage typical for the contract. Otherwise, liability is excluded to
                    the extent permitted by law.
                </li>
            </ul>

            <h2>16. Indemnification</h2>
            <p>
                You will defend, indemnify, and hold harmless bStats and its contributors from and
                against all claims, liabilities, damages, losses, and expenses (including reasonable
                legal fees) arising out of or related to: (a) your use of the Service; (b) your
                breach of these Terms; or (c) any data you submit to the Service.
            </p>

            <h2>17. Third-party services</h2>
            <p>
                The Service may rely on or link to third-party services (e.g., Discord, GitHub,
                hosting/CDN providers). Your use of those services is subject to their terms, and we
                are not responsible for them.
            </p>

            <h2>18. Public stats and content license</h2>
            <p>
                You acknowledge that plugin names, versions, and aggregated usage metrics may be
                publicly displayed on the Site. To the extent necessary for that display, you grant
                bStats a worldwide, non-exclusive, royalty-free license to host, display, and
                reproduce such content in connection with the Service.
            </p>

            <h2>19. Export control and sanctions</h2>
            <p>
                You represent that you are not located in, resident of, or organized under the laws
                of a country or territory subject to comprehensive sanctions and that you are not a
                denied or restricted party. You will not use the Service for prohibited end uses
                under applicable export laws.
            </p>

            <h2>20. Termination</h2>
            <ul>
                <li>
                    <strong>By you:</strong> You may stop using the Service at any time. If you have
                    an account, you may delete it.
                </li>
                <li>
                    <strong>By us:</strong> We may suspend or terminate your access to the Service or
                    specific functionality if we reasonably believe you have violated these Terms or
                    engaged in fraudulent or illegal conduct.
                </li>
                <li>
                    <strong>Effect:</strong> Upon termination, your right to access or use the Service
                    ceases immediately. Clauses that by their nature survive termination (e.g., disclaimers,
                    limitation of liability, indemnification) remain in effect.
                </li>
            </ul>

            <h2>21. Governing law and jurisdiction</h2>
            <p>
                These Terms are governed by and construed in accordance with the laws of the Federal
                Republic of Germany, without regard to conflict-of-law principles. You agree that
                any dispute arising out of or relating to these Terms shall be submitted to the
                exclusive jurisdiction of the competent courts located in Germany, unless otherwise
                required by a mandatory law of your jurisdiction.
            </p>

            <h2>22. Changes to these Terms</h2>
            <p>
                We may update or modify these Terms from time to time. The "Last updated" date
                indicates when changes were made. Your continued use of the Service following any
                changes signifies your acceptance of the revised Terms. If you do not agree to the
                changes, you should discontinue use before the effective date.
            </p>

            <h2>23. Force majeure</h2>
            <p>
                We are not liable for delays or failures due to events beyond our reasonable
                control, including outages, DDoS attacks, acts of government, war, labor disputes,
                or natural disasters.
            </p>

            <h2>24. Assignment</h2>
            <p>
                You may not assign or transfer these Terms without our prior written consent. We may
                assign or transfer these Terms in connection with a merger, acquisition, or transfer
                of assets.
            </p>

            <h2>25. Entire agreement; severability; interpretation</h2>
            <ul>
                <li>
                    <strong>Entire agreement:</strong> These Terms, together with our privacy policy
                    and any applicable open-source license terms, constitute the entire agreement between
                    you and bStats regarding the Service.
                </li>
                <li>
                    <strong>Severability:</strong> If any provision of these Terms is held invalid or
                    unenforceable, that provision will be enforced to the maximum extent permissible,
                    and the remaining provisions will remain in full force and effect.
                </li>
                <li>
                    <strong>No waiver:</strong> Failure to enforce a provision is not a waiver of the
                    right to do so later.
                </li>
                <li>
                    <strong>Headings; translations:</strong> Headings are for convenience only. If these
                    Terms are translated, the English version controls (unless a mandatory law requires
                    otherwise).
                </li>
            </ul>

            <h2>26. Support and contact</h2>
            <ul>
                <li>
                    <strong>Support and issue tracking:</strong> For help or bug reports, reach out
                    via our
                    <a href="https://discord.gg/qTXtXuf" target="_blank" rel="noopener noreferrer">
                        Discord channel
                    </a>
                    or open an issue in our
                    <a
                        href="https://github.com/Bastian/bStats"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub repository
                    </a>.
                </li>
                <li>
                    <strong>Legal inquiries / DPA requests:</strong>
                    Please refer to the contact information provided in the bStats
                    <a href={resolve('/privacy-policy')} target="_blank">privacy policy</a>.
                </li>
            </ul>

            <p class="text-sm text-slate-500 italic">
                Thank you for using bStats! If you have any questions about these Terms or the
                privacy policy, please contact us using the channels above.
            </p>
        </article>
    </section>
</main>
