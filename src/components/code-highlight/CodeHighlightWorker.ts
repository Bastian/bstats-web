import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import java from "highlight.js/lib/languages/java";
import kotlin from "highlight.js/lib/languages/kotlin";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("java", java);
hljs.registerLanguage("kotlin", kotlin);

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
