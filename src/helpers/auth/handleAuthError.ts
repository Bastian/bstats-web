export function handleAuthError(error: unknown): void {
    if (typeof error["code"] != "string") {
        alert(error);
        return;
    }
    switch (error["code"]) {
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
            if (error["message"]) {
                alert(error["message"]);
            } else {
                alert(error);
            }
            console.log(error);
    }
}
