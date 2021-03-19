<script lang="ts">
    import StandardNavigation from "../../components/navigation/StandardNavigation.svelte";
    import TextField from "../../components/forms/TextField.svelte";
    import MailIcon from "../../components/hero-icons/MailIcon.svelte";
    import KeyIcon from "../../components/hero-icons/KeyIcon.svelte";
    import Button from "../../components/forms/Button.svelte";
    import GoogleIcon from "../../components/icons/GoogleIcon.svelte";
    import GithubIcon from "../../components/icons/GithubIcon.svelte";
    import TwitterIcon from "../../components/icons/TwitterIcon.svelte";
    import Checkbox from "../../components/forms/Checkbox.svelte";
    import OauthButton from "./_components/OauthButton.svelte";
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<StandardNavigation/>

<div class="flex flex-grow justify-center items-center bg-gray-100 dark:bg-gray-900">
    <div class="flex flex-col items-center my-24 mx-8 w-full max-w-xl">
        <span class="text-3xl font-bold text-blue-900 dark:text-blue-400">
            Login to your account
        </span>
        <div class="p-8 mt-4 w-full bg-white rounded shadow dark:bg-gray-800">
            <TextField id="email" label="Email or Username">
                <MailIcon slot="icon"/>
            </TextField>
            <TextField id="password" label="Password" type="password" class="mt-4">
                <KeyIcon slot="icon"/>
            </TextField>

            <Checkbox id="remember-me" label="Remember me" class="mt-4" />
            <Button class="mt-4 w-full">Login</Button>

            <div class="flex relative justify-center my-8">
                <div class="absolute top-3 h-0.5 bg-gray-300 w-full dark:bg-gray-500"></div>
                <span class="z-10 px-2 text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300">
                    or continue with
                </span>
            </div>

            <div class="grid gap-y-2 gap-x-4 sm:space-y-0 sm:grid-cols-3">
                <OauthButton>
                    <GoogleIcon slot="icon"/> Google
                </OauthButton>
                <OauthButton>
                    <GithubIcon class="fill-current" slot="icon"/> GitHub
                </OauthButton>
                <OauthButton>
                    <TwitterIcon slot="icon"/> Twitter
                </OauthButton>
            </div>
        </div>
        <a href="/register" class="mt-4 font-medium text-blue-900 dark:text-gray-200">
            Create new account
        </a>
    </div>
</div>
