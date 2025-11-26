import React, { useState, useEffect } from 'react';

// Ripple Effect Button Component
export const RippleButton = ({ children, onClick, className, ...props }) => {
    const [ripples, setRipples] = useState([]);

    const addRipple = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(event);
    };

    return (
        <button
            {...props}
            className={`relative overflow-hidden ${className}`}
            onClick={addRipple}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
        </button>
    );
};

// Confetti Component
export const Confetti = ({ active, onComplete }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                rotation: Math.random() * 360,
                color: ['#E11D48', '#FCD34D', '#C9B3FF', '#E8A4A4', '#FFC7A5'][Math.floor(Math.random() * 5)],
                size: Math.random() * 10 + 5,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: Math.random() * 3 + 2,
            }));
            setParticles(newParticles);

            setTimeout(() => {
                setParticles([]);
                if (onComplete) onComplete();
            }, 3000);
        }
    }, [active, onComplete]);

    if (!active && particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        animation: `confettiFall 3s ease-out forwards`,
                        '--velocity-x': particle.velocityX,
                        '--velocity-y': particle.velocityY,
                    }}
                />
            ))}
        </div>
    );
};

// Glow Button Component
export const GlowButton = ({ children, onClick, className, glowColor = 'rgba(225, 29, 72, 0.5)', ...props }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            {...props}
            className={`relative transition-all duration-300 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{
                boxShadow: isHovered ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` : 'none',
            }}
        >
            {children}
            {isHovered && (
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-50 pointer-events-none"
                    style={{ backgroundColor: glowColor }}
                />
            )}
        </button>
    );
};

// Sound Manager
export class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.sounds = {};
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        return this.enabled;
    }

    play(soundName) {
        if (!this.enabled) return;

        // Using Web Audio API for simple tones
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const sounds = {
            click: { frequency: 800, duration: 0.1 },
            connect: { frequency: 600, duration: 0.3 },
            disconnect: { frequency: 400, duration: 0.3 },
            reaction: { frequency: 1000, duration: 0.15 },
            snap: { frequency: 1200, duration: 0.1 },
        };

        const sound = sounds[soundName] || sounds.click;

        oscillator.frequency.value = sound.frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    }
}

// Sound Toggle Component
export const SoundToggle = ({ soundManager }) => {
    const [enabled, setEnabled] = useState(soundManager.enabled);

    const toggle = () => {
        const newState = soundManager.toggle();
        setEnabled(newState);
        soundManager.play('click');
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            title={enabled ? 'Sound On' : 'Sound Off'}
        >
            {enabled ? '🔊' : '🔇'}
        </button>
    );
};

// Loading Spinner with Glow
export const GlowSpinner = ({ size = 'md', color = 'velvet' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const colors = {
        velvet: 'border-velvet',
        gold: 'border-gold',
        lavender: 'border-lavender',
    };

    return (
        <div className="relative">
            <div
                className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
            />
            <div
                className={`absolute inset-0 ${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full blur-md animate-spin opacity-50`}
            />
        </div>
    );
};

// Pulse Indicator
export const PulseIndicator = ({ color = 'rosegold', size = 'md' }) => {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className="relative flex items-center justify-center">
            <div className={`${sizes[size]} bg-${color} rounded-full animate-ping absolute`} />
            <div className={`${sizes[size]} bg-${color} rounded-full`} />
        </div>
    );
};

// Smooth Page Transition
export const PageTransition = ({ children, show }) => {
    return (
        <div
            className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
        >
            {children}
        </div>
    );
};

// Magnetic Button (follows cursor)
export const MagneticButton = ({ children, onClick, className, ...props }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        setPosition({
            x: x * 0.3, // Magnetic strength
            y: y * 0.3,
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <button
            {...props}
            className={`transition-transform duration-200 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
            }}
        >
            {children}
        </button>
    );
};

export default {
    RippleButton,
    Confetti,
    GlowButton,
    SoundManager,
    SoundToggle,
    GlowSpinner,
    PulseIndicator,
    PageTransition,
    MagneticButton,
};
