/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                blush: '#F8D7E3',
                lavender: '#C9B3FF',
                rosegold: '#E8A4A4',
                midnight: '#1F1B2E',
                peach: '#FFC7A5',
                cream: '#FFF7F2',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
                cute: ['Quicksand', 'sans-serif'],
            },
            animation: {
                'heartbeat': 'heartbeat 3s infinite ease-in-out',
                'gradient': 'gradient 15s ease infinite',
                'float-sway': 'floatSway 3s ease-out forwards',
                'twinkle': 'twinkle 4s ease-in-out infinite',
                'float-bob': 'floatBob 6s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
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
                }
            }
        },
    },
    plugins: [],
}
