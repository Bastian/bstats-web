<script lang="ts">
    import CodeBlock from "$components/code-highlight/CodeBlock.svelte";
    import Step from "$components/Step.svelte";
    import type { Platform } from "./_SelectPlatformStep.svelte";

    export let selectedPlatform: Platform;
    export let step: number;

    let dependency: string;
    $: dependency = `
        repositories {
            mavenCentral()
            // ... your other repositories
        }

        dependencies {
            implementation("org.bstats:bstats-${selectedPlatform}:2.2.1")
            // ... your other dependencies
        }
    `;

    let shadowPlugin: string;
    $: shadowPlugin = `
        plugins {
            id("com.github.johnrengelman.shadow") version "6.1.0"
            // ... your other plugins
        }
    `;

    let shadowJar: string;
    $: shadowJar = `
        tasks {
            named<ShadowJar>("shadowJar") {
                // See https://github.com/johnrengelman/shadow/issues/448
                project.configurations.implementation.get().isCanBeResolved = true

                configurations = listOf(project.configurations.runtimeClasspath.get())
                dependencies { exclude { it.moduleGroup != "org.bstats" } }
                relocate("org.bstats", group)
            }
        }
    `;

    let fullBuildScript: string;
    $: fullBuildScript = `
        import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
        ${shadowPlugin}
        group = "org.example"
        version = "1.0.0"
        description = "An example plugin"
        ${dependency}${shadowJar}
    `;
</script>

<Step {step} title="Add and shade Gradle dependency">
    <span slot="description">
        Make sure that you have the
        <code class="text-gray-700 dark:text-gray-200">mavenCentral()</code>
        repository in your repositories list and then add the bStats dependency like
        shown below.
    </span>

    <CodeBlock language="gradle" class="mt-2" code={dependency} />

    <span
        class="block mt-2 text-gray-500 text-md dark:text-gray-400 max-w-prose"
    >
        Next, you have to make sure that bStats in included in your software
        when building it. The easiest way to do this is by adding the
        <a
            class="border-b-2 border-gray-300 dark:border-gray-400"
            href="https://github.com/johnrengelman/shadow"
            target="_blank"
            rel="noopener noreferrer"
        >
            Gradle Shadow
        </a>
        plugin
    </span>

    <CodeBlock language="gradle" class="mt-2" code={shadowPlugin} />

    <span
        class="block mt-2 text-gray-500 text-md dark:text-gray-400 max-w-prose"
    >
        and then configure the
        <code class="text-gray-700 dark:text-gray-200">shadowJar</code>
        task as shown below.
    </span>

    <CodeBlock language="gradle" class="mt-2" code={shadowJar} />

    <span
        class="block mt-2 text-gray-500 text-md dark:text-gray-400 max-w-prose"
    >
        Executing
        <code class="text-gray-700 dark:text-gray-200">
            ./gradlew shadowJar
        </code>
        will now build a JAR file that has bStats included. Your full build script
        should now look similar to the one shown below.
    </span>

    <CodeBlock language="gradle" class="mt-2" code={fullBuildScript} />
</Step>
