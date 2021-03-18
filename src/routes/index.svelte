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

<div class="text-white bg-gradient-to-r from-purple-900 via-blue-900 to-blue-400">
    <div class="container py-4 mx-auto border-blue-700">
        <Navigation/>
    </div>
</div>

<div class="pt-24 bg-gray-50 dark:bg-gray-900 flex justify-center flex-col items-center background">
    <h1 class="mb-4 text-7xl font-bold text-blue-900 dark:text-blue-500">
        bStats
    </h1>
    <span class="flex items-center text-3xl text-gray-800 dark:text-gray-200">
        Plugin Metrics made with
        <HeartIcon small class="text-red-600 h-8 ml-2 -mt-1"/>
    </span>
</div>

<div class="flex-grow bg-gray-50 dark:bg-gray-900 background pb-24">
    <div class="container mx-auto md:pt-24">
        <div class="flex flex-col-reverse md:flex-row">
            <div class="mx-12 md:mx-0 md:w-2/5 flex flex-col justify-center leading-loose 2xl:pr-24 lg:pl-8">
                <div class="mt-4">
                    <span class="text-3xl mr-1 font-bold text-blue-900 dark:text-blue-500">
                        bStats
                    </span>
                    <span class="text-xl text-gray-800 dark:text-gray-200">
                        is the all-in-one solution to tracking and analyzing your Minecraft plugin's usage across a wide range of multiplayer networks.
                    </span>
                    <button class="block mt-4 py-2 px-4 bg-blue-800 rounded text-white focus:outline-none focus:ring focus:border-blue-300">
                        Learn More
                    </button>
                </div>
            </div>
            <div class="md:w-3/5 shadow-xl rounded m-12 md:m-0 md:ml-8 xl:mr-8">
                <img class="h-full w-full rounded-lg" src="/img/landing-page.png" alt="Website Screenshot">
            </div>
        </div>
    </div>
</div>
