<script>
    import Navigation from "../components/navigation/Navigation.svelte";
    import HeartIcon from "../components/hero-icons/HeartIcon.svelte";
</script>

<svelte:head>
    <title>bStats</title>
</svelte:head>

<style>
    .background {
        background-image: url("/patterns/geometry-low-contrast.png");
        background-repeat: repeat;
    }

    :global(.dark) .background {
        background-image: unset;
    }
</style>

<div class="text-white bg-gradient-to-r from-purple-900 via-blue-900 to-blue-400 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-700">
    <div class="container py-4 mx-auto border-blue-700">
        <Navigation/>
    </div>
</div>

<div class="flex flex-col justify-center items-center pt-24 bg-gray-50 dark:bg-gray-900 background">
    <h1 class="mb-4 text-6xl font-bold text-blue-900 dark:text-blue-500">
        bStats
    </h1>
    <span class="flex flex-wrap justify-center items-center px-4 text-2xl text-gray-800 dark:text-gray-200">
        Plugin Metrics made
        <span class="flex items-center ml-1">with <HeartIcon small class="ml-2 -mt-1 h-8 text-red-600"/></span>
    </span>
</div>

<div class="flex-grow pb-24 bg-gray-50 dark:bg-gray-900 background">
    <div class="container mx-auto md:pt-24">
        <div class="flex flex-col-reverse md:flex-row">
            <div class="flex flex-col justify-center mx-12 leading-loose md:mx-0 md:w-2/5 2xl:pr-24 lg:pl-8 xl:pl-16">
                <div class="mt-4">
                    <span class="mr-1 text-3xl font-bold text-blue-900 dark:text-blue-500">
                        bStats
                    </span>
                    <span class="text-xl text-gray-800 dark:text-gray-200">
                        is the all-in-one solution to tracking and analyzing your Minecraft plugin's usage across a wide range of multiplayer networks.
                    </span>
                    <button class="block py-2 px-4 mt-4 text-white bg-blue-800 rounded focus:outline-none focus:ring focus:border-blue-300">
                        Learn More
                    </button>
                </div>
            </div>
            <div class="m-12 rounded shadow-xl md:w-3/5 md:m-0 md:ml-8 xl:mr-16">
                <img class="w-full h-full rounded-lg" src="/img/landing-page.png" alt="Website Screenshot">
            </div>
        </div>
    </div>
</div>
