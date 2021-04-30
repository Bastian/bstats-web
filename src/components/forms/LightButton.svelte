<button on:click class="block flex justify-center items-center py-2 pr-4 pl-2 w-full text-gray-700 rounded border border-gray-300 dark:text-gray-200 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div class="mr-2 w-6 h-6 flex items-center">
        <slot name="icon"></slot>
    </div>
    <slot></slot>
</button>
