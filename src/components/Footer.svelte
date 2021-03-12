<script lang="ts">
    const toggleDarkMode = () => {
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            metaThemeColor.setAttribute("content", "#1D4ED8");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            metaThemeColor.setAttribute("content", "#111827");
        }
    };
</script>

<div class="w-full bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
    <div class="container flex flex-col items-center p-8 mx-auto sm:items-start sm:justify-evenly sm:flex-row">
        <div class="flex flex-col items-center py-4 sm:p-8 sm:items-start">
            <span class="text-xl font-semibold text-blue-900 dark:text-blue-400">
                Useful Links
            </span>
            <a class="mt-4" href="/">Getting Started</a>
            <a class="mt-4" href="/">Credits / Sponsor</a>
            <a class="mt-4" href="/">What is my plugin id?</a>
            <button class="mt-4 focus:outline-none" on:click={toggleDarkMode}>Toggle Dark Mode</button>
        </div>
        <div class="flex flex-col items-center py-4 sm:p-8 sm:items-start">
            <span class="text-xl font-semibold text-blue-900 dark:text-blue-400">
                Social
            </span>
            <a class="mt-4" href="/">Discord Server</a>
            <a class="mt-4" href="/">GitHub</a>
        </div>
        <div class="flex flex-col items-center py-4 sm:p-8 sm:items-start">
            <span class="text-xl font-semibold text-blue-900 dark:text-blue-400">
                Legal
            </span>
            <a class="mt-4" href="/">Terms of Use</a>
            <a class="mt-4" href="/">Privacy Policy</a>
            <a class="mt-4" href="/">Imprint</a>
        </div>
    </div>
</div>

<div class="flex justify-center w-full text-white bg-blue-900">
    <span class="p-6">
        © 2021 Bastian Oppermann
    </span>
</div>
