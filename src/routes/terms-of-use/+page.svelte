<script>
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
</script>

<svelte:head>
	<meta name="description" content="Terms of Use" />
	<title>bStats - Terms of Use</title>
</svelte:head>

<main class="pb-24">
	<PageHero>
		{#snippet badge()}<Badge>Legal</Badge>{/snippet}
		{#snippet title()}Terms of Use{/snippet}
		{#snippet content()}
			Please read these terms carefully before using bStats. By accessing or using any part of the
			Service, you agree to be bound by these Terms of Use.
		{/snippet}
	</PageHero>

	<section class="doc-container mt-12">
		<article class="doc-card prose" style="max-width: none">
			<p class="text-sm text-slate-500 italic"><strong>Last Updated:</strong> 2025/03/13</p>

			<h2>1. Introduction</h2>
			<p>
				<strong>bStats</strong> ("we," "us," or "our") is an open-source analytics service that plugin/mod
				developers integrate into their software to gather technical usage data. These Terms of Use govern
				your use of:
			</p>
			<ul>
				<li>
					The bStats website (<strong>bStats.org</strong>) and any related subdomains (collectively,
					the "Site").
				</li>
				<li>The bStats code, including the Metrics class embedded in plugins ("bStats Code").</li>
				<li>
					Any other services, dashboards, or tools provided by bStats (collectively, the "Service").
				</li>
			</ul>
			<p>
				By accessing or using any part of the Service, you agree to be bound by these TOS. If you do
				not agree, you must discontinue use of the Service immediately.
			</p>

			<h2>2. Scope and Eligibility</h2>
			<h3>Who Is Covered</h3>
			<ul>
				<li>
					<strong>Plugin Developers:</strong> Individuals or entities who include bStats Code in their
					plugins or mods.
				</li>
				<li>
					<strong>Server Owners:</strong> Individuals or entities who operate game servers (e.g., Minecraft
					servers) running plugins that include bStats Code.
				</li>
				<li>
					<strong>Website Visitors:</strong> Anyone who visits the Site to view analytics or other information.
				</li>
			</ul>
			<h3>Age Restrictions</h3>
			<p>
				bStats is not intended for use by anyone under the age of 13 (or 16, depending on local
				regulations). If you are a minor under applicable law, you may only use bStats under the
				supervision of a parent or legal guardian who agrees to be bound by these TOS on your
				behalf. Please see our
				<a href={resolve('/privacy-policy')} target="_blank">Privacy Policy</a>
				for more information regarding children's privacy.
			</p>

			<h2>3. Open-Source Licensing and Ownership</h2>
			<p>
				<strong>Open-Source Code:</strong> The bStats Code is provided under an open-source license,
				which is separate from these TOS. Your use of bStats Code is governed by that open-source license.
			</p>
			<p>
				<strong>Plugins:</strong> Plugin developers retain their respective rights to their original
				plugin code. Nothing in these TOS transfers ownership of any plugin intellectual property to
				bStats.
			</p>

			<h2>4. Prohibited Modifications and Data Collection</h2>
			<p>
				<strong>Metrics Class Modifications:</strong>
			</p>
			<ul>
				<li>
					Unless explicitly permitted, you must not modify, adapt, or create derivative works of any
					part of the Metrics class.
				</li>
				<li>
					Relocation of the Java Metrics class is explicitly permitted, either by manually editing
					the "package" when using the copy-paste Metrics classes or by using relocation tools when
					using build tools like Maven or Gradle.
				</li>
				<li>
					The following are non-exhaustive examples of prohibited modifications:
					<ul>
						<li>Removing or circumventing the bStats opt-out functionality.</li>
						<li>
							Modifying bStats Code to enable support for server software that is not officially
							supported (e.g., Nukkit) or for client-side use cases (e.g., Minecraft client
							plugins).
						</li>
						<li>Obfuscation.</li>
					</ul>
				</li>
			</ul>
			<p>
				<strong>Prohibited Data in Custom Charts:</strong>
			</p>
			<ul>
				<li>
					<strong>Personal Data:</strong> You must not configure or use bStats to collect data that could
					be considered personal under the GDPR or similar privacy regulations. This includes, but is
					not limited to, IP addresses or any identifiers traceable to an individual.
				</li>
				<li>
					<strong>Sensitive Server Data:</strong> You must not include server IP addresses or other sensitive
					server-specific information in custom charts.
				</li>
				<li>
					bStats reserves the right to investigate and remove any plugins or developers who misuse
					the Service by collecting personal or otherwise prohibited data.
				</li>
			</ul>

			<h2>5. User Responsibilities</h2>
			<ul>
				<li>
					<strong>Compliance with Laws:</strong> You agree to use the Service only in compliance with
					all applicable laws and regulations, including data protection laws relevant to your jurisdiction.
				</li>
				<li>
					<strong>Accurate Information:</strong> If you create an account on the Site, you must provide
					accurate and truthful information (e.g., username). You are responsible for maintaining the
					confidentiality of your login credentials.
				</li>
				<li>
					<strong>No Abuse of Service:</strong> You will not attempt to access any non-public areas of
					our Service, interfere with bStats infrastructure, attempt to reverse engineer or circumvent
					any security features, or otherwise exploit the Service in an unauthorized manner.
				</li>
			</ul>

			<h2>6. Privacy Policy</h2>
			<p>
				Your use of the Service is also governed by our
				<a href={resolve('/privacy-policy')} target="_blank">Privacy Policy</a>, which explains how
				we collect, use, and protect data. In the event of a conflict between these TOS and our
				Privacy Policy regarding data handling, the Privacy Policy prevails.
			</p>

			<h2>7. Disclaimers of Warranties</h2>
			<ul>
				<li>
					<strong>"As-Is" and "As Available":</strong> The Service and all associated software (including
					bStats Code) are provided on an "as-is" and "as available" basis.
				</li>
				<li>
					<strong>No Warranty:</strong> To the fullest extent permitted by applicable law, we disclaim
					all warranties and conditions, whether express, implied, statutory, or otherwise, including
					any implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
				</li>
				<li>
					<strong>Open-Source Nature:</strong> bStats is open-source software maintained by volunteers
					and contributors. We do not guarantee that the Service or code will be free from defects or
					available without interruption.
				</li>
			</ul>

			<h2>8. Limitation of Liability</h2>
			<ul>
				<li>
					<strong>Exclusion of Damages:</strong> To the fullest extent permitted by applicable law, bStats
					shall not be liable for any indirect, incidental, consequential, or special damages, loss of
					data, loss of profits, or costs of procurement of substitute goods or services, arising out
					of or related to your use of (or inability to use) the Service.
				</li>
				<li>
					<strong>Aggregate Liability Cap:</strong> In no event shall bStats' total liability to you
					for all claims arising out of or relating to these TOS exceed the amount you paid (if any)
					for using the Service in the preceding twelve (12) months (or EUR €0.00 if you have not paid
					any fees).
				</li>
				<li>
					<strong>Exception:</strong> Some jurisdictions do not allow the limitation or exclusion of
					liability for certain damages; in such cases, the liability will be limited to the greatest
					extent permitted by law.
				</li>
			</ul>

			<h2>9. Termination</h2>
			<ul>
				<li>
					<strong>Termination by You:</strong> You may stop using the Service at any time. If you have
					an account on our Site, you may delete it.
				</li>
				<li>
					<strong>Termination by Us:</strong> We reserve the right to suspend or terminate your access
					to the Service, or to specific functionality, at any time if we reasonably believe you have
					violated these TOS or engaged in fraudulent or illegal conduct.
				</li>
				<li>
					<strong>Effect of Termination:</strong> Upon termination, your right to access or use the Service
					immediately ceases. Any clauses in these TOS that by their nature should survive termination
					(e.g., disclaimers, limitation of liability) shall remain in effect.
				</li>
			</ul>

			<h2>10. Governing Law and Jurisdiction</h2>
			<p>
				<strong>Governing Law:</strong> These TOS are governed by and construed in accordance with the
				laws of the Federal Republic of Germany, without regard to conflict-of-law principles.
			</p>
			<p>
				<strong>Jurisdiction:</strong> You agree that any dispute arising out of or relating to these
				TOS shall be submitted to the exclusive jurisdiction of the competent courts located in Germany,
				unless otherwise required by a mandatory law of your jurisdiction.
			</p>

			<h2>11. Changes to the Terms of Use</h2>
			<p>
				We may update or modify these TOS from time to time at our discretion. The "Last Updated"
				date at the top of this page indicates when changes were made. We encourage you to review
				the TOS periodically. Your continued use of the Service following any changes signifies your
				acceptance of the revised TOS.
			</p>

			<h2>12. Support and Contact</h2>
			<ul>
				<li>
					<strong>Support and Issue Tracking:</strong> If you need assistance or wish to report a
					bug, please reach out via our
					<a href="https://discord.gg/qTXtXuf" target="_blank"> Discord channel </a>
					or by opening an issue on our
					<a href="https://github.com/Bastian/bStats" target="_blank"> GitHub repository </a>.
				</li>
				<li>
					<strong>Legal Inquiries:</strong> For legal inquiries, please refer to the contact
					information provided in the bStats
					<a href={resolve('/privacy-policy')} target="_blank">Privacy Policy</a>.
				</li>
			</ul>

			<h2>13. Entire Agreement and Severability</h2>
			<ul>
				<li>
					<strong>Entire Agreement:</strong> These TOS, together with our Privacy Policy and any relevant
					open-source license terms, constitute the entire agreement between you and bStats concerning
					the Service.
				</li>
				<li>
					<strong>Severability:</strong> If any provision of these TOS is held invalid or unenforceable,
					that provision will be enforced to the maximum extent permissible, and the remaining provisions
					will remain in full force and effect.
				</li>
			</ul>

			<p class="text-sm text-slate-500 italic">
				Thank you for using bStats! If you have any questions about these Terms of Use or the
				Privacy Policy, please contact us as set out in our Privacy Policy.
			</p>
		</article>
	</section>
</main>
