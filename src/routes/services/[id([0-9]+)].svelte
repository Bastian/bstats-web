<script context="module" lang="ts">
    export async function preload(page, session) {
        const { id } = page.params;
        return { id };
    }
</script>

<script lang="ts">
    import Navigation from "../../components/navigation/Navigation.svelte";
    import ServerIcon from "../../components/hero-icons/ServerIcon.svelte";
    import ExampleChart from "../../components/DummyLineChart.svelte";
    import Footer from "../../components/Footer.svelte";
    import UsersIcon from "../../components/hero-icons/UsersIcon.svelte";

    // export let id: string;
</script>

<style>
    @media (min-width: 1024px) {
        .servers-players-box {
            max-width: 700px;
        }
    }
</style>

<div class="text-white bg-gradient-to-r from-purple-900 via-blue-900 to-blue-400 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-700">
    <div class="container py-4 mx-auto">
        <Navigation/>

        <div class="pt-16">
            <div class="text-6xl font-semibold">
                SafeTrade
            </div>
            <div class="py-4">
                by <a href="/" class="font-semibold">BtoBastian</a>
            </div>
        </div>

        <div class="flex justify-end pt-4 -mb-32 md:-mb-16">
            <div class="grid z-10 grid-cols-1 self-end p-6 w-full text-black bg-white rounded-md shadow-md md:grid-cols-2 dark:bg-gray-800 sm:p-8 servers-players-box dark:text-white">
                <div class="pb-4 sm:pl-4 md:pb-0">
                    <div class="inline-flex items-center text-gray-500 dark:text-gray-200">
                        <ServerIcon class="h-5 stroke-current"/>
                        <span class="pl-2 pt-0.5">Servers</span>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">123,123</span>
                        <span class="text-gray-700 dark:text-gray-200"> / 234,234</span>
                    </div>
                </div>
                <div class="pt-4 border-t sm:pl-4 md:pt-0 md:pl-8 md:border-l md:border-t-0">
                    <div class="inline-flex items-center text-gray-500 dark:text-gray-200">
                        <UsersIcon class="h-5 stroke-current"/>
                        <span class="pl-2 pt-0.5">Players</span>
                    </div>
                    <div class="pt-2">
                        <span class="pr-1 text-4xl">123,123</span>
                        <span class="text-gray-700 dark:text-gray-200"> / 234,234</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="pt-28 bg-gray-100 dark:bg-gray-900 md:pt-12">
    <div class="container pt-4 pb-16 mx-auto">
        <ExampleChart title="Servers"/>
        <ExampleChart title="Players"/>
    </div>
</div>

<Footer/>

