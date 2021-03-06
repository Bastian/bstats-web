<script context="module" lang="ts">
    import Auth from "$components/Auth.svelte";
    import Card from "$components/Card.svelte";
    import Divider from "$components/Divider.svelte";
    import Button from "$components/forms/Button.svelte";
    import Checkbox from "$components/forms/Checkbox.svelte";
    import LightButton from "$components/forms/LightButton.svelte";
    import TextField from "$components/forms/TextField.svelte";
    import KeyIcon from "$components/hero-icons/KeyIcon.svelte";
    import MailIcon from "$components/hero-icons/MailIcon.svelte";
    import GithubIcon from "$components/icons/GithubIcon.svelte";
    import GoogleIcon from "$components/icons/GoogleIcon.svelte";
    import TwitterIcon from "$components/icons/TwitterIcon.svelte";
    import StandardNavigation from "$components/navigation/StandardNavigation.svelte";
    import PasswordStrengthIndicator from "$components/PasswordStrengthIndicator.svelte";
    import type { LoginProvider } from "$helpers/auth/loginWithEmailAndPassword";
    import { loginWithProvider } from "$helpers/auth/loginWithProvider";
    import { registerWithEmailAndPassword } from "$helpers/auth/registerWithEmailAndPassword";
    import ErrorHandler from "$helpers/ErrorHandler.svelte";
    import type { Load } from "@sveltejs/kit";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";

    export const load: Load = async ({ session }) => {
        // The user is already logged in, so let's redirect them to the landing page
        if (session.user) {
            return { status: 307, redirect: "/" };
        }
        return {};
    };
</script>

<script lang="ts">
    let error = null;

    const { form, errors, handleChange, handleSubmit } = createForm({
        initialValues: {
            email: "",
            password: "",
            passwordRepeat: "",
            acceptTermsOfUseChecked: false,
        },
        validationSchema: yup.object().shape({
            email: yup
                .string()
                .email("Please enter an valid email")
                .required("Please enter an valid email"),
            password: yup
                .string()
                .min(8, "Password must have at least 8 chars")
                .required("Please enter a password"),
            passwordRepeat: yup
                .string()
                .oneOf([yup.ref("password"), null], "Passwords must match")
                .required("Please repeat your password"),
            acceptTemsOfUseChecked: yup.boolean().isTrue("Please accept"),
        }),
        onSubmit: async (values) => {
            try {
                await registerWithEmailAndPassword(
                    values.email,
                    values.password
                );
                window.location.assign("/");
            } catch (e) {
                error = e;
            }
        },
    });

    async function handleLoginWithProvider(provider: LoginProvider) {
        try {
            await loginWithProvider(provider);
            window.location.assign("/");
        } catch (e) {
            error = e;
        }
    }
</script>

<svelte:head>
    <title>Create Account</title>
</svelte:head>

<Auth />
<StandardNavigation />

<ErrorHandler bind:error />

<div
    class="flex items-center justify-center flex-grow bg-gray-100 dark:bg-gray-900"
>
    <Card
        class="mx-4 my-12 sm:my-24 sm:mx-8"
        title="Create account"
        link={{ text: "Login with existing account", href: "/login" }}
    >
        <form on:submit={handleSubmit}>
            <TextField
                bind:value={$form.email}
                on:change={handleChange}
                id="email"
                name="email"
                label="Email"
                error={$errors.email}
            >
                <MailIcon slot="icon" />
            </TextField>

            <TextField
                bind:value={$form.password}
                on:change={handleChange}
                id="password"
                name="password"
                label="Password"
                type="password"
                class="mt-4"
                error={$errors.password}
            >
                <KeyIcon slot="icon" />
            </TextField>
            {#if $form.password.length > 0}
                <PasswordStrengthIndicator password={$form.password} />
            {/if}

            <TextField
                bind:value={$form.passwordRepeat}
                on:change={handleChange}
                id="password-repeat"
                name="passwordRepeat"
                label="Repeat Password"
                type="password"
                class="mt-4"
                error={$errors.passwordRepeat}
            >
                <KeyIcon slot="icon" />
            </TextField>

            <Checkbox
                bind:checked={$form.acceptTermsOfUseChecked}
                on:change={handleChange}
                id="accept-terms-of-use"
                label="Accept Terms of Use"
                class="mt-4"
                name="acceptTermsOfUseChecked"
                error={$errors.acceptTermsOfUseChecked}
            />

            <Button class="w-full mt-4" type="submit">Create Account</Button>
        </form>

        <Divider text="or login with" class="my-8" />

        <div class="grid gap-y-2 gap-x-4 sm:space-y-0 sm:grid-cols-3">
            <LightButton on:click={() => handleLoginWithProvider("google")}>
                <GoogleIcon slot="icon" /> Google
            </LightButton>
            <LightButton on:click={() => handleLoginWithProvider("github")}>
                <GithubIcon class="fill-current" slot="icon" /> GitHub
            </LightButton>
            <LightButton on:click={() => handleLoginWithProvider("twitter")}>
                <TwitterIcon slot="icon" /> Twitter
            </LightButton>
        </div>
    </Card>
</div>
