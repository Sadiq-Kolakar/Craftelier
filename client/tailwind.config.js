/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'agraham': ['"Agraham"', 'Georgia', 'serif', 'system-ui'],
            },
            colors: {
                cream: {
                    50: '#FEFDFB',
                    100: '#FDF9F0',
                    200: '#FAF0DC',
                    300: '#F5E3C0',
                },
                charcoal: {
                    700: '#2D2D2D',
                    800: '#1A1A1A',
                    900: '#0D0D0D',
                },
                gold: {
                    400: '#D4A853',
                    500: '#C4963A',
                    600: '#A67C2E',
                },
                sage: {
                    400: '#8BA888',
                    500: '#6B8F68',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
};
