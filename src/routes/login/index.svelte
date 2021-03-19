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
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<StandardNavigation/>

<div class="flex flex-grow justify-center items-center bg-gray-100 dark:bg-gray-900">
    <Card class="animate-fade-in my-12 sm:my-24 mx-4 sm:mx-8" title="Login to your account" link={{ text: "Create new account", href: "/register" }}>
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
            <LightButton>
                <GoogleIcon slot="icon"/> Google
            </LightButton>
            <LightButton>
                <GithubIcon class="fill-current" slot="icon"/> GitHub
            </LightButton>
            <LightButton>
                <TwitterIcon slot="icon"/> Twitter
            </LightButton>
        </div>
    </Card>
</div>
