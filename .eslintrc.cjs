module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "svelte3",
        "@typescript-eslint"
    ],
    overrides: [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3"
        }
    ],
    "settings": {
        "svelte3/typescript": true
    },
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "max-len": ["error", { 
            "code": 100,
            "ignorePattern": "^\\s*import\\s.+\\sfrom\\s.+;$"
        }],
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"]
    }
};
