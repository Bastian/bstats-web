<script lang="ts">
    import ProgressBar from "./ProgressBar.svelte";

    export let password = "";

    function getPasswordQuality(pw: string): number {
        const boolToNumber = (b: boolean) => b ? 1 : 0;

        const has8OrMoreChars = boolToNumber(/.{8,}/.test(pw));
        const has12OrMoreChars = boolToNumber(/.{12,}/.test(pw));
        const has16OrMoreChars = boolToNumber(/.{16,}/.test(pw));
        const has24OrMoreChars = boolToNumber(/.{24,}/.test(pw));
        const has32OrMoreChars = boolToNumber(/.{32,}/.test(pw));
        const hasLowerLetter = boolToNumber(/[a-z]/.test(pw));
        const hasUpperLetter = boolToNumber(/[A-Z]/.test(pw));
        const hasDigit = boolToNumber(/\d/.test(pw));
        const hasSpecialChar = boolToNumber(/[^A-Za-z0-9]/.test(pw));

        const score = has8OrMoreChars * (
            has12OrMoreChars 
            + has16OrMoreChars 
            + has24OrMoreChars
            + has32OrMoreChars
            + hasLowerLetter 
            + hasUpperLetter 
            + hasDigit
            + hasSpecialChar
        );

        return Math.min(6, score);
    }

    export let passwordQuality: number;
    $: passwordQuality = getPasswordQuality(password);
    $: progress = passwordQuality / 6;

    let backgroundClass: string;
    let progressClass: string;
    $: switch (passwordQuality) {
        case 0:
        case 1:
        case 2:
            backgroundClass = "bg-red-200 dark:bg-red-300";
            progressClass = "bg-red-500";
            break;
        case 3:
            backgroundClass = "bg-orange-200";
            progressClass = "bg-orange-500";
            break;
        case 4:
            backgroundClass = "bg-yellow-200";
            progressClass = "bg-yellow-500";
            break;
        case 5:
        case 6:
            backgroundClass = "bg-green-200";
            progressClass = "bg-green-500";
            break;
        default:
            break;
    }
</script>

<div class="mt-1">
    <ProgressBar {progress} {backgroundClass} {progressClass} />
        <div class="text-sm mt-1 text-gray-600 dark:text-gray-200">
            {#if passwordQuality <= 1}
                Even my mother has a better password...
            {:else if passwordQuality <= 2}
                You can do better. I believe in you!
            {:else if passwordQuality <= 3}
                Almost not bad
            {:else if passwordQuality <= 4}
                Good enough
            {:else if passwordQuality <= 5}
                Pretty good
            {:else if passwordQuality <= 6}
                You either use a password manager or are Chuck Norris
            {/if}
        </div>
</div>
