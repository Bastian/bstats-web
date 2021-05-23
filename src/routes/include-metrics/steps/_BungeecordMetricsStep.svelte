<script lang="ts">
    import CodeBlock from "$components/code-highlight/CodeBlock.svelte";
    import Step from "$components/Step.svelte";
    import type { BuildTool } from "./_SelectBuildToolStep.svelte";

    export let serviceId: number | null;
    export let selectedBuildTool: BuildTool;
    export let step: number;

    let code: string;
    $: code = `
        public class ExamplePlugin extends Plugin {

            @Override
            public void onEnable() {
                ${
                    serviceId
                        ? ""
                        : "// You can find the service id of your service on the page\n                // https://bstats.org/what-is-my-service-id\n                "
                }int serviceId = ${serviceId ?? "<service-id>"};${
        serviceId ? "" : " // Replace with your service id"
    }
                Metrics metrics = new Metrics(this, serviceId);

                // Optional: Add custom charts
                metrics.addCustomChart(new ${
                    selectedBuildTool == "copy-paste" ? "Metrics." : ""
                }SimplePie("chart_id", () -> "My value"));
            }

        }
    `;
</script>

<Step {step} title="Initialize the Metrics class">
    <span slot="description">
        Now you can initialize the bStats Metrics class by creating an instance
        of it in your
        <code class="text-gray-700 dark:text-gray-200">onEnable()</code>
        method.
    </span>

    <CodeBlock language="java" class="mt-2" {code} />
</Step>
