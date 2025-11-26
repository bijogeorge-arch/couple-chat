/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Legacy
                blush: '#F8D7E3',
                lavender: '#C9B3FF',
                rosegold: '#E8A4A4',
                midnight: '#1F1B2E',
                peach: '#FFC7A5',
                cream: '#FFF7F2',
                // New "Dark Mode Elegance"
                charcoal: '#0F1115',
                'midnight-deep': '#0B0D17',
                velvet: '#E11D48',
                sienna: '#F97316',
                gold: '#FCD34D',
                'glass-sm': 'rgba(255, 255, 255, 0.05)',
                'glass-md': 'rgba(255, 255, 255, 0.10)',
            },
            fontFamily: {
                sans: ['Lato', 'Inter', 'sans-serif'], // Prioritize Lato
                heading: ['Playfair Display', 'Poppins', 'serif'], // Prioritize Playfair
                cute: ['Quicksand', 'sans-serif'],
                cinzel: ['Cinzel', 'serif'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            animation: {
                'heartbeat': 'heartbeat 3s infinite ease-in-out',
                'gradient': 'gradient 15s ease infinite',
                'float-sway': 'floatSway 3s ease-out forwards',
                'twinkle': 'twinkle 4s ease-in-out infinite',
                'float-bob': 'floatBob 6s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'fade-in-slow': 'fadeIn 1.5s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.3s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'orb-float': 'orbFloat 20s infinite linear',
                'ripple': 'ripple 0.6s ease-out',
                'confetti-fall': 'confettiFall 3s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                floatSway: {
                    '0%': { transform: 'translateY(0) translateX(0) scale(0.5)', opacity: '0' },
                    '10%': { opacity: '1', transform: 'translateY(-20px) translateX(-5px) scale(1)' },
                    '25%': { transform: 'translateY(-50px) translateX(5px)' },
                    '50%': { transform: 'translateY(-100px) translateX(-5px)' },
                    '75%': { transform: 'translateY(-150px) translateX(5px)' },
                    '100%': { transform: 'translateY(-250px) translateX(0) scale(1.2)', opacity: '0' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
                    '50%': { opacity: '1', transform: 'scale(1.2)' },
                },
                floatBob: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                orbFloat: {
                    '0%': { transform: 'translate(0, 0)' },
                    '33%': { transform: 'translate(30px, -50px)' },
                    '66%': { transform: 'translate(-20px, 20px)' },
                    '100%': { transform: 'translate(0, 0)' },
                },
                ripple: {
                    '0%': { transform: 'scale(0)', opacity: '1' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                },
                confettiFall: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': {
                        transform: 'translateY(100vh) translateX(calc(var(--velocity-x) * 100px)) rotate(720deg)',
                        opacity: '0'
                    },
                },
            }
        },
    },
    plugins: [],
}
