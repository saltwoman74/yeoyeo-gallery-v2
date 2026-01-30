/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Midnight Luxury Theme
                navy: {
                    950: '#020617', // Deepest background
                    900: '#0f172a', // Secondary background
                    800: '#1e293b', // Card background
                },
                gold: {
                    400: '#d4af37', // Bright gold
                    500: '#c5a059', // Primary Champagne Gold
                    600: '#b08d55', // Darker gold
                }
            },
            fontFamily: {
                sans: ['"Noto Sans KR"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
