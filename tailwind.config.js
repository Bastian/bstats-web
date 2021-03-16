module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
        "./src/**/*.svelte",
        "./src/**/*.ts",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
                body: ["Roboto", "sans-serif"],
            },
            container: {
                padding: {
                    DEFAULT: "1rem",
                    sm: "2rem",
                    lg: "4rem",
                    xl: "5rem",
                    "2xl": "6rem",
                },
            },
        },
        container: {
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
