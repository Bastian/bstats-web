<script context="module" lang="ts">
    import type {Load} from "@sveltejs/kit"

    export const load: Load = async ({ session }) => {
        // The user is already logged in, so let's redirect them to the landing page
        if (session.user) {
            return { status: 307,  redirect: `/` }
        }
        return { };
    }
</script>

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
    import Divider from "../../components/Divider.svelte";
    import Card from "../../components/Card.svelte";
    import LightButton from "../../components/forms/LightButton.svelte";
    import {loginWithProvider} from "../../helpers/auth/loginWithProvider";
    import type {LoginProvider} from "../../helpers/auth/loginWithProvider";
    import Auth from "../../components/Auth.svelte";

    async function handleLoginWithProvider(provider: LoginProvider) {
        try {
            await loginWithProvider(provider);
        } catch (error) {
            switch (error.code) {
                case "auth/account-exists-with-different-credential":
                    // TODO Render nicely in the UI
                    alert("Your E-Mail address is already in use with another authentication method. " +
                        "If you want to link your existing account with another third-party provider, " +
                        "please login first with your existing provider and then link your account in " +
                        "your profile settings");
                    break;
                case "auth/cancelled-popup-request":
                case "auth/popup-closed-by-user":
                    // Can be ignored
                    break;
                default:
                    if (error.message) {
                        alert(error.message);
                    }
                    console.log(error);
            }
        }
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<Auth/>
<StandardNavigation/>

<div class="flex flex-grow justify-center items-center bg-gray-100 dark:bg-gray-900">
    <Card class="my-12 sm:my-24 mx-4 sm:mx-8" title="Login to your account" link={{ text: "Create new account", href: "/register" }}>
        <TextField id="email" label="Email or Username">
            <MailIcon slot="icon"/>
        </TextField>
        <TextField id="password" label="Password" type="password" class="mt-4">
            <KeyIcon slot="icon"/>
        </TextField>

        <div class="flex flex-col-reverse sm:flex-row justify-between mt-2 sm:mt-4">
            <Checkbox id="remember-me" label="Remember me" class="mt-4 sm:mt-0" />
            <a href="/forgot-password" class="text-blue-900 dark:text-blue-200 text-sm">
                Forgot your password?
            </a>
        </div>

        <Button class="mt-4 w-full">Login</Button>

        <Divider text="or continue with" class="my-8"/>

        <div class="grid gap-y-2 gap-x-4 sm:space-y-0 sm:grid-cols-3">
            <LightButton on:click={() => handleLoginWithProvider("google")}>
                <GoogleIcon slot="icon"/> Google
            </LightButton>
            <LightButton on:click={() => handleLoginWithProvider("github")}>
                <GithubIcon class="fill-current" slot="icon"/> GitHub
            </LightButton>
            <LightButton on:click={() => handleLoginWithProvider("twitter")}>
                <TwitterIcon slot="icon"/> Twitter
            </LightButton>
        </div>
    </Card>
</div>
