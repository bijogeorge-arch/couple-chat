import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Aperture, Shield, Zap, ArrowRight, Monitor, Lock, Heart, Video, Sparkles, Check, ChevronDown, Github, Twitter, Mail } from 'lucide-react';

const EnhancedLandingPage = () => {
    const navigate = useNavigate();
    const [partnerCode, setPartnerCode] = useState('');
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);

    const createRoom = () => {
        const roomId = Math.random().toString(36).substring(2, 9);
        navigate(`/room/${roomId}`);
    };

    const joinRoom = () => {
        if (partnerCode.trim()) {
            navigate(`/room/${partnerCode}`);
        }
    };

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const testimonials = [
        {
            text: "This app saved our long-distance relationship! We watch movies every Friday night like we're in the same room. ❤️",
            author: "Sarah & Mike",
            location: "NYC ↔ LA"
        },
        {
            text: "Finally, a video call app that doesn't feel like a business meeting. It's intimate, beautiful, and just for us.",
            author: "Priya & James",
            location: "London ↔ Mumbai"
        },
        {
            text: "The cinema mode is incredible! We binged an entire series together and it felt like a real date night.",
            author: "Alex & Jordan",
            location: "Toronto ↔ Vancouver"
        }
    ];

    const faqs = [
        {
            question: "Is my video call private?",
            answer: "Absolutely! Your room is ephemeral and encrypted. We don't store any video, audio, or chat data. Once you close the room, everything is gone forever."
        },
        {
            question: "Can we watch Netflix/YouTube together?",
            answer: "Yes! Use the screen share feature to watch any content from your browser. Your partner will see and hear everything in perfect sync."
        },
        {
            question: "Do we both need to create accounts?",
            answer: "Nope! No accounts, no sign-ups. Just create a room, share the code with your partner, and start connecting."
        },
        {
            question: "What if my internet is slow?",
            answer: "The app automatically adjusts video quality based on your connection. We recommend at least 2 Mbps for the best experience."
        },
        {
            question: "Can we use this on mobile?",
            answer: "Yes! The app is fully responsive and works beautifully on phones and tablets."
        }
    ];

    const comparisons = [
        { feature: "Designed for couples", us: true, them: false },
        { feature: "No time limits", us: true, them: false },
        { feature: "Beautiful themes", us: true, them: false },
        { feature: "Romantic reactions", us: true, them: false },
        { feature: "Memory snapshots", us: true, them: false },
        { feature: "Cinema mode", us: true, them: false },
        { feature: "No account needed", us: true, them: true },
        { feature: "Screen sharing", us: true, them: true },
    ];

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-charcoal text-white font-sans selection:bg-velvet selection:text-white">

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-charcoal" />
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-velvet/20 rounded-full blur-[120px] animate-orb-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-gold/10 rounded-full blur-[100px] animate-orb-float" style={{ animationDelay: '-5s' }} />
                <div className="absolute top-[40%] left-[60%] w-[25vw] h-[25vw] bg-red-900/20 rounded-full blur-[80px] animate-orb-float" style={{ animationDelay: '-10s' }} />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Navigation */}
            <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <div className="text-2xl font-cinzel font-semibold tracking-widest text-white/90">
                    LUMIÈRE
                </div>
                <div className="text-sm font-sans tracking-widest text-gray-400 uppercase">
                    Private Beta
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 min-h-screen flex flex-col items-center justify-center relative z-10 pt-20">

                {/* Hero Section */}
                <div className="w-full max-w-5xl flex flex-col items-center text-center mb-24 animate-fade-in-slow">
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-white mb-8 drop-shadow-2xl">
                        Distance fades when the <br />
                        <span className="italic text-white/90">lights go down.</span>
                    </h1>

                    <p className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-gray-400 mb-16 max-w-2xl leading-loose">
                        Experience cinema, conversation, and connection in a private digital suite.
                    </p>

                    {/* CTA Section */}
                    <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">
                        <button
                            onClick={createRoom}
                            className="group relative px-10 py-4 bg-gradient-to-b from-velvet to-red-950 rounded-md shadow-[0_0_30px_rgba(225,29,72,0.2)] hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] transition-all duration-700 ease-out overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <span className="relative z-10 font-heading font-medium text-lg tracking-wide text-white/90 group-hover:text-white transition-colors">
                                Enter Private Suite
                            </span>
                        </button>

                        <div className="hidden md:block w-px h-12 bg-white/10" />

                        <div className="flex flex-col items-start gap-2 group">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={partnerCode}
                                    onChange={(e) => setPartnerCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                                    placeholder="HAVE A CODE?"
                                    className="bg-transparent border-b border-white/20 text-white placeholder-gray-600 placeholder:uppercase py-2 px-2 w-48 focus:outline-none focus:border-gold/60 transition-all duration-500 font-sans text-sm tracking-wide text-center"
                                />
                                <button
                                    onClick={joinRoom}
                                    className="absolute right-0 text-gray-500 hover:text-gold transition-colors duration-300"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl animate-fade-in-up mb-24" style={{ animationDelay: '0.5s' }}>
                    <FeatureCard
                        icon={<Monitor className="w-6 h-6 stroke-[1]" />}
                        title="4K Sync Theatre"
                        description="Invisible technology. Watch movies in perfect synchronization with ultra-low latency. The focus is on the shared experience, not the buffering."
                    />
                    <FeatureCard
                        icon={<Lock className="w-6 h-6 stroke-[1]" />}
                        title="End-to-End Intimacy"
                        description="Your room is ephemeral and encrypted. No logs, no history. Just a secure, secluded space for two."
                    />
                </div>

                {/* Testimonials Section */}
                <div className="w-full max-w-4xl mb-24 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                    <h2 className="text-3xl md:text-4xl font-heading font-light text-center mb-12 text-white/90">
                        Loved by couples worldwide
                    </h2>
                    <div className="relative bg-glass-sm backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl min-h-[200px]">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute inset-8 md:inset-12 transition-all duration-700 ${index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                                    }`}
                            >
                                <p className="text-lg md:text-xl font-light text-white/90 mb-6 italic leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-velvet to-gold flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-white fill-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.author}</p>
                                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center gap-2 mt-48">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-velvet w-8' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="w-full max-w-4xl mb-24 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                    <h2 className="text-3xl md:text-4xl font-heading font-light text-center mb-4 text-white/90">
                        Why choose Lumière?
                    </h2>
                    <p className="text-center text-gray-400 mb-12 font-sans">
                        Not just another video call app. Built specifically for couples.
                    </p>
                    <div className="bg-glass-sm backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/5">
                            <div></div>
                            <div className="text-center">
                                <p className="font-heading font-semibold text-velvet">Lumière</p>
                            </div>
                            <div className="text-center">
                                <p className="font-sans text-sm text-gray-400">Others</p>
                            </div>
                        </div>
                        {comparisons.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <div className="text-white/80 font-sans text-sm">{item.feature}</div>
                                <div className="flex justify-center">
                                    {item.us ? <Check className="w-5 h-5 text-velvet" /> : <span className="text-white/20">—</span>}
                                </div>
                                <div className="flex justify-center">
                                    {item.them ? <Check className="w-5 h-5 text-white/20" /> : <span className="text-white/20">—</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="w-full max-w-4xl mb-24 animate-fade-in-up" style={{ animationDelay: '2s' }}>
                    <h2 className="text-3xl md:text-4xl font-heading font-light text-center mb-12 text-white/90">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-glass-sm backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                    className="w-full p-6 flex justify-between items-center text-left"
                                >
                                    <span className="font-heading text-lg text-white">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="px-6 pb-6 text-gray-400 font-sans leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full max-w-6xl border-t border-white/5 pt-12 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="font-cinzel text-xl mb-4 text-white/90">LUMIÈRE</h3>
                            <p className="text-sm text-gray-400 font-sans leading-relaxed">
                                A private digital suite for couples to connect, watch, and create memories together.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-heading font-semibold mb-4 text-white/80">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-velvet transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-velvet transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-velvet transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-heading font-semibold mb-4 text-white/80">Connect</h4>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Twitter className="w-5 h-5 text-gray-400" />
                                </a>
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Github className="w-5 h-5 text-gray-400" />
                                </a>
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 font-sans">
                        <p>© 2025 Lumière. Designed for love in the digital age.</p>
                    </div>
                </footer>

            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="group bg-glass-sm backdrop-blur-md border border-white/5 p-8 rounded-lg hover:bg-glass-md transition-all duration-700 hover:border-white/10">
        <div className="mb-6 text-gold/70 group-hover:text-gold transition-colors duration-700">
            {icon}
        </div>
        <h3 className="font-heading text-xl text-white mb-3">{title}</h3>
        <p className="font-sans text-gray-400 font-light leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default EnhancedLandingPage;
