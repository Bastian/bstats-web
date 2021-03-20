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
    <title>Create Account</title>
</svelte:head>

<StandardNavigation/>

<div class="flex flex-grow justify-center items-center bg-gray-100 dark:bg-gray-900">
    <Card class="my-12 sm:my-24 mx-4 sm:mx-8" title="Create account" link={{ text: "Login with existing account", href: "/login" }}>
        <TextField id="email" label="Email">
            <MailIcon slot="icon"/>
        </TextField>
        <TextField id="password" label="Password" type="password" class="mt-4">
            <KeyIcon slot="icon"/>
        </TextField>
        <TextField id="password-repeat" label="Repeat Password" type="password" class="mt-4">
            <KeyIcon slot="icon"/>
        </TextField>

        <Checkbox id="remember-me" label="Accept Terms of Use" class="mt-4" />

        <Button class="mt-4 w-full">Create Account</Button>

        <Divider text="or login with" class="my-8"/>

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
