import * as hljs from "highlight.js";

addEventListener(
    "message",
    (message: MessageEvent<{ code: string; language?: string }>) => {
        postMessage(
            hljs.highlightAuto(
                message.data.code,
                message.data.language ? [message.data.language] : undefined
            ).value
        );
    }
);
