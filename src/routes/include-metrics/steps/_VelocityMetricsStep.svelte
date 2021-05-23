<script lang="ts">
    import CodeBlock from "$components/code-highlight/CodeBlock.svelte";
    import Step from "$components/Step.svelte";
    import type { BuildTool } from "./_SelectBuildToolStep.svelte";

    export let serviceId: number | null;
    export let selectedBuildTool: BuildTool;
    export let step: number;

    let code: string;
    $: code = `
        @Plugin(id = "exampleplugin", name = "My first plugin", version = "0.1.0-SNAPSHOT",
                url = "https://example.org", description = "I did it!", authors = {"Me"})
        public class ExamplePlugin {

            private final ProxyServer server;
            private final Logger logger;
            private final Metrics.Factory metricsFactory;

            @Inject
            public ExamplePlugin(ProxyServer server, Logger logger, Metrics.Factory metricsFactory) {
                this.server = server;
                this.logger = logger;
                this.metricsFactory = metricsFactory;
            }

            @Subscribe
            public void onProxyInitialization(ProxyInitializeEvent event) {
                ${
                    serviceId
                        ? ""
                        : "// You can find the service id of your service on the page\n                // https://bstats.org/what-is-my-service-id\n                "
                }int serviceId = ${serviceId ?? "<service-id>"};${
        serviceId ? "" : " // Replace with your service id"
    }
                Metrics metrics = metricsFactory.make(this, serviceId);
            
                // You can also add custom charts:
                metrics.addCustomChart(new ${
                    selectedBuildTool == "copy-paste" ? "Metrics." : ""
                }SimplePie("chart_id", () -> "value"));
            }
        }
    `;
</script>

<Step {step} title="Initialize the Metrics class">
    <span slot="description">
        Now you can initialize the bStats Metrics class by injecting the
        <code class="text-gray-700 dark:text-gray-200">Metrics.Factory</code>
        into your constructor and then calling the
        <code class="text-gray-700 dark:text-gray-200">make(...)</code>
        method with the id of your service in your
        <code class="text-gray-700 dark:text-gray-200">
            onProxyInitialization(...)
        </code>
        method.
    </span>

    <CodeBlock language="java" class="mt-2" {code} />
</Step>
