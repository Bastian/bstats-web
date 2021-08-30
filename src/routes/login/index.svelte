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
    import { loginWithEmailAndPassword } from "$helpers/auth/loginWithEmailAndPassword";
    import { loginWithProvider } from "$helpers/auth/loginWithProvider";
    import type { LoginProvider } from "$helpers/auth/loginWithProvider";
    import ErrorHandler from "$helpers/ErrorHandler.svelte";
    import type { Load } from "@sveltejs/kit";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";

    export const load: Load = async ({ session, page }) => {
        // The user is already logged in, so let's redirect them to the landing page
        if (session.user) {
            return { status: 307, redirect: "/" };
        }
        return {
            props: {
                redirectUrl: page.query.has("redirect")
                    ? page.query.get("redirect")
                    : "/",
            },
        };
    };
</script>

<script lang="ts">
    export let redirectUrl: string;
    let error = null;

    const { form, errors, handleChange, handleSubmit } = createForm({
        initialValues: {
            emailOrUsername: "",
            password: "",
        },
        validationSchema: yup.object().shape({
            emailOrUsername: yup
                .string()
                .required("Please enter your Email or Username"),
            password: yup.string().required("Please enter a password"),
        }),
        onSubmit: async (values) => {
            try {
                await loginWithEmailAndPassword(
                    values.emailOrUsername,
                    values.password
                );
                redirect();
            } catch (e) {
                error = e;
            }
        },
    });

    async function handleLoginWithProvider(provider: LoginProvider) {
        try {
            await loginWithProvider(provider);
            redirect();
        } catch (e) {
            error = e;
        }
    }

    function redirect() {
        // We don't want to be vulnerable to a "Unvalidated Redirection Attack".
        // Since we only have to redirect on the page itself and not to external
        // sites, we can easily validate the url by just checking if it starts
        // with a "/".
        if (redirectUrl && redirectUrl.startsWith("/")) {
            window.location.assign(redirectUrl);
        } else {
            window.location.assign("/");
        }
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<Auth />
<StandardNavigation />

<ErrorHandler bind:error />

<div
    class="flex items-center justify-center flex-grow bg-gray-100 dark:bg-gray-900"
>
    <Card
        class="mx-4 my-12 sm:my-24 sm:mx-8"
        title="Login to your account"
        link={{ text: "Create new account", href: "/register" }}
    >
        <form on:submit={handleSubmit}>
            <TextField
                bind:value={$form.emailOrUsername}
                on:change={handleChange}
                id="email"
                name="emailOrUsername"
                label="Email or Username"
                error={$errors.emailOrUsername}
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

            <div
                class="flex flex-col-reverse justify-between mt-2 sm:flex-row sm:mt-4"
            >
                <Checkbox
                    id="remember-me"
                    label="Remember me"
                    class="mt-4 sm:mt-0"
                />
                <a
                    href="/forgot-password"
                    class="text-sm text-blue-900 dark:text-blue-200"
                >
                    Forgot your password?
                </a>
            </div>

            <Button class="w-full mt-4" type="submit">Login</Button>
        </form>
        <Divider text="or continue with" class="my-8" />

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
