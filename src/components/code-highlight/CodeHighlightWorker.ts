import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import java from "highlight.js/lib/languages/java";
import gradle from "highlight.js/lib/languages/gradle";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("java", java);
hljs.registerLanguage("gradle", gradle);

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
