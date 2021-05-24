<script lang="ts">
    import CodeBlock from "$components/code-highlight/CodeBlock.svelte";
    import Step from "$components/Step.svelte";
    import type { Platform } from "./_SelectPlatformStep.svelte";

    export let selectedPlatform: Platform;
    export let step: number;

    let mavenDependency: string;
    $: mavenDependency = `
        <dependency>
          <groupId>org.bstats</groupId>
          <artifactId>bstats-${selectedPlatform}</artifactId>
          <version>2.2.1</version>
          <scope>compile</scope>
        </dependency>
    `;

    let mavenShade: string;
    $: mavenShade = `
        <build>
          <plugins>
            <plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-shade-plugin</artifactId>
              <version>3.1.0</version>
              <configuration>
                <relocations>
                  <relocation>
                    <pattern>org.bstats</pattern>
                    <!-- Replace this with your package! -->
                    <shadedPattern>your.package</shadedPattern>
                  </relocation>
                </relocations>
              </configuration>
              <executions>
                <execution>
                <phase>package</phase>
                <goals>
                  <goal>shade</goal>
                </goals>
                </execution>
              </executions>
            </plugin>
          </plugins>
        </build>
    `;
</script>

<Step {step} title="Add and shade Maven dependency">
    <span slot="description">Add the following Maven dependency</span>

    <CodeBlock language="xml" class="mt-2" code={mavenDependency} />

    <span
        class="block mt-2 text-gray-500 text-md dark:text-gray-400 max-w-prose"
    >
        and then shade bStats into your service. Shading copies bStats into your
        service and relocates it into its own package. Make sure to change
        <code class="text-gray-700 dark:text-gray-200">"your.package"</code>
        to your own package.
    </span>

    <CodeBlock language="xml" class="mt-2" code={mavenShade} />
</Step>
