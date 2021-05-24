<script>
    import HeartIcon from "$components/hero-icons/HeartIcon.svelte";
    import StandardNavigation from "$components/navigation/StandardNavigation.svelte";
</script>

<svelte:head>
    <title>bStats</title>
</svelte:head>

<StandardNavigation />

<div
    class="flex flex-col items-center justify-center pt-24 bg-gray-50 dark:bg-gray-900 background"
>
    <h1 class="mb-4 text-6xl font-bold text-blue-900 dark:text-blue-500">
        bStats
    </h1>
    <span
        class="flex flex-wrap items-center justify-center px-4 text-2xl text-gray-800 dark:text-gray-200"
    >
        Plugin Metrics made
        <span class="flex items-center ml-1">
            with
            <HeartIcon
                small
                class="w-10 h-10 ml-2 -mt-1 text-red-600 animate-heartbeat"
            />
        </span>
    </span>
</div>

<div class="flex-grow pb-24 bg-gray-50 dark:bg-gray-900 background">
    <div class="container mx-auto md:pt-24">
        <div class="flex flex-col-reverse md:flex-row">
            <div
                class="flex flex-col justify-center mx-12 leading-loose md:mx-0 md:w-2/5 2xl:pr-24 lg:pl-8 xl:pl-16"
            >
                <div class="mt-4">
                    <span
                        class="mr-1 text-3xl font-bold text-blue-900 dark:text-blue-500"
                    >
                        bStats
                    </span>
                    <span class="text-xl text-gray-800 dark:text-gray-200">
                        is the all-in-one solution to tracking and analyzing
                        your Minecraft plugin's usage across a wide range of
                        multiplayer networks.
                    </span>
                    <button
                        class="block px-4 py-2 mt-4 text-white bg-blue-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Learn More
                    </button>
                </div>
            </div>
            <div class="m-12 rounded md:w-3/5 md:m-0 md:ml-8 xl:mr-16">
                <div class="flex items-center h-6 bg-gray-200 rounded-t-lg">
                    <div class="w-2 h-2 ml-2 bg-red-500 rounded-full" />
                    <div class="w-2 h-2 ml-1 bg-yellow-500 rounded-full" />
                    <div class="w-2 h-2 ml-1 bg-green-500 rounded-full" />
                    <div class="flex-grow h-3 ml-4 mr-12 bg-white rounded-sm" />
                </div>
                <img
                    class="w-full h-full rounded-b-lg shadow-xl"
                    src="/img/landing-page.png"
                    alt="Website Screenshot"
                />
            </div>
        </div>
    </div>
</div>

<style>
    .background {
        background-image: url("/patterns/geometry-low-contrast.png");
        background-repeat: repeat;
    }

    :global(.dark) .background {
        background-image: unset;
    }
</style>
