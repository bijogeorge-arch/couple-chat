import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Aperture, Shield, Zap, ArrowRight, Monitor, Lock } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [partnerCode, setPartnerCode] = useState('');

    const createRoom = () => {
        const roomId = Math.random().toString(36).substring(2, 9);
        navigate(`/room/${roomId}`);
    };

    const joinRoom = () => {
        if (partnerCode.trim()) {
            navigate(`/room/${partnerCode}`);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-charcoal text-white font-sans selection:bg-velvet selection:text-white">

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Deep Background */}
                <div className="absolute inset-0 bg-charcoal" />

                {/* Bokeh Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-velvet/20 rounded-full blur-[120px] animate-orb-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-gold/10 rounded-full blur-[100px] animate-orb-float" style={{ animationDelay: '-5s' }} />
                <div className="absolute top-[40%] left-[60%] w-[25vw] h-[25vw] bg-red-900/20 rounded-full blur-[80px] animate-orb-float" style={{ animationDelay: '-10s' }} />

                {/* Noise Texture Overlay (Optional for film grain feel) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Navigation (Minimal) */}
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

                    {/* Headline */}
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-white mb-8 drop-shadow-2xl">
                        Distance fades when the <br />
                        <span className="italic text-white/90">lights go down.</span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-gray-400 mb-16 max-w-2xl leading-loose">
                        Experience cinema, conversation, and connection in a private digital suite.
                    </p>

                    {/* CTA Section */}
                    <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">

                        {/* Primary Button */}
                        <button
                            onClick={createRoom}
                            className="group relative px-10 py-4 bg-gradient-to-b from-velvet to-red-950 rounded-md shadow-[0_0_30px_rgba(225,29,72,0.2)] hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] transition-all duration-700 ease-out overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <span className="relative z-10 font-heading font-medium text-lg tracking-wide text-white/90 group-hover:text-white transition-colors">
                                Enter Private Suite
                            </span>
                        </button>

                        {/* Divider (Visual) */}
                        <div className="hidden md:block w-px h-12 bg-white/10" />

                        {/* Secondary Input */}
                        <div className="flex flex-col items-start gap-2 group">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={partnerCode}
                                    onChange={(e) => setPartnerCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                                    placeholder="HAVE A CODE?"
                                    className="bg-transparent border-b border-white/20 text-white placeholder-gray-600 py-2 px-2 w-48 focus:outline-none focus:border-gold/60 transition-all duration-500 font-sans text-sm tracking-widest uppercase text-center"
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

                {/* Features Grid (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>

                    {/* Feature 1: The Theatre */}
                    <div className="group bg-glass-sm backdrop-blur-md border border-white/5 p-8 rounded-lg hover:bg-glass-md transition-all duration-700 hover:border-white/10">
                        <div className="mb-6 text-gold/70 group-hover:text-gold transition-colors duration-700">
                            <Monitor className="w-6 h-6 stroke-[1]" />
                        </div>
                        <h3 className="font-heading text-xl text-white mb-3">4K Sync Theatre</h3>
                        <p className="font-sans text-gray-400 font-light leading-relaxed text-sm">
                            Invisible technology. Watch movies in perfect synchronization with ultra-low latency. The focus is on the shared experience, not the buffering.
                        </p>
                    </div>

                    {/* Feature 2: The Privacy */}
                    <div className="group bg-glass-sm backdrop-blur-md border border-white/5 p-8 rounded-lg hover:bg-glass-md transition-all duration-700 hover:border-white/10">
                        <div className="mb-6 text-gold/70 group-hover:text-gold transition-colors duration-700">
                            <Lock className="w-6 h-6 stroke-[1]" />
                        </div>
                        <h3 className="font-heading text-xl text-white mb-3">End-to-End Intimacy</h3>
                        <p className="font-sans text-gray-400 font-light leading-relaxed text-sm">
                            Your room is ephemeral and encrypted. No logs, no history. Just a secure, secluded space for two.
                        </p>
                    </div>

                </div>

                {/* Footer Note */}
                <div className="mt-24 mb-8 text-center opacity-30 hover:opacity-60 transition-opacity duration-700">
                    <p className="font-cinzel text-xs tracking-[0.3em] text-white">
                        DESIGNED FOR LOVE IN THE DIGITAL AGE
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
