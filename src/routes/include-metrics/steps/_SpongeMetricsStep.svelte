<script lang="ts">
    import CodeBlock from "$components/code-highlight/CodeBlock.svelte";
    import Step from "$components/Step.svelte";
    import type { BuildTool } from "./_SelectBuildToolStep.svelte";

    export let serviceId: number | null;
    export let selectedBuildTool: BuildTool;
    export let step: number;

    let code: string;
    $: code = `
        @Plugin(id = "exampleplugin", name = "ExamplePlugin", version = "1.0")
        public class ExamplePlugin {

            private final Metrics metrics;

            // The metricsFactory parameter gets injected using @Inject.
            // Check out https://docs.spongepowered.org/master/en/plugin/injection.html
            // if you don't know what @Inject does
            @Inject
            public ExamplePlugin(Metrics.Factory metricsFactory) {
                ${
                    serviceId
                        ? ""
                        : "// You can find the service id of your service on the page\n                // https://bstats.org/what-is-my-service-id\n                "
                }int serviceId = ${serviceId ?? "<service-id>"};${
        serviceId ? "" : " // Replace with your service id"
    }
                metrics = metricsFactory.make(serviceId);
            }

            // Optional: Add custom charts
            @Listener
            public void onServerStart(GameStartedServerEvent event) {
                metrics.addCustomChart(new ${
                    selectedBuildTool == "copy-paste" ? "Metrics." : ""
                }SimplePie("chart_id", () -> "My value"));
            }

        }
    `;
</script>

<Step {step} title="Initialize the Metrics class">
    <span slot="description">
        Now you can initialize the bStats Metrics class by injecting the
        <code class="text-gray-700 dark:text-gray-200">Metrics.Factory</code>
        into your constructor and calling the
        <code class="text-gray-700 dark:text-gray-200">make(...)</code>
        method with the id of your service.
    </span>

    <CodeBlock language="java" class="mt-2" {code} />
</Step>
