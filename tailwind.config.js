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
            animation: {
                'fade-in': 'fade-in 0.3s ease-out 0s 1 normal forwards',
            },
            keyframes: {
                'fade-in': {
                    '0%': { transform: 'translateY(2%)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                }
            }
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
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
