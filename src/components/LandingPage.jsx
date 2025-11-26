import React, { useState } from 'react';
import { Heart, Film, Lock, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div className="min-h-screen w-full relative overflow-hidden font-sans text-midnight selection:bg-rosegold selection:text-white">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blush via-lavender to-peach animate-gradient bg-[length:400%_400%] -z-10" />

            {/* Overlay for softness */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] -z-10" />

            <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-screen space-y-16">

                {/* Hero Section */}
                <div className="w-full max-w-4xl bg-cream/30 backdrop-blur-2xl border border-white/40 rounded-[3rem] shadow-2xl p-8 md:p-12 flex flex-col items-center text-center animate-fade-in-up relative overflow-hidden">
                    {/* Soft Glow behind illustration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/40 blur-[100px] rounded-full -z-10 pointer-events-none" />

                    {/* Illustration */}
                    <div className="mb-8 relative group">
                        <img
                            src="/hero_illustration.png"
                            alt="Couple on moon"
                            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Typography */}
                    <h1 className="font-heading font-semibold text-3xl md:text-5xl mb-4 leading-tight text-midnight drop-shadow-sm">
                        Closing the distance,<br /> one movie night at a time.
                    </h1>
                    <p className="font-sans font-medium text-lg md:text-xl text-midnight/80 mb-10 max-w-2xl">
                        Your private digital sanctuary. No links, no noise. Just the two of you.
                    </p>

                    {/* CTA Block */}
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
                        {/* Primary Action */}
                        <button
                            onClick={createRoom}
                            className="group relative bg-gradient-to-r from-rosegold to-peach text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-rosegold/30 hover:shadow-rosegold/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 overflow-hidden cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <Heart className="w-6 h-6 fill-current animate-heartbeat" />
                            <span className="relative z-10">Create Our Room</span>
                        </button>

                        {/* Secondary Action */}
                        <div className="flex items-center bg-white/40 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-sm focus-within:ring-2 focus-within:ring-rosegold/50 transition-all">
                            <input
                                type="text"
                                value={partnerCode}
                                onChange={(e) => setPartnerCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                                placeholder="Enter partner code..."
                                className="bg-transparent border-none outline-none px-4 py-2 text-midnight placeholder:text-midnight/50 font-cute w-48"
                            />
                            <button
                                onClick={joinRoom}
                                className="bg-white/60 hover:bg-white text-midnight px-6 py-2.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                            >
                                Join Them <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p className="mt-6 font-cute text-sm text-midnight/60 flex items-center gap-2">
                        <Heart className="w-3 h-3 fill-rosegold text-rosegold" /> Made for love
                    </p>
                </div>

                {/* Why Us Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                    {/* Card 1 */}
                    <FeatureCard
                        icon={<Film className="w-8 h-8 text-lavender" />}
                        title="Cinema for Two"
                        text="Dim the lights. Watch movies in perfect sync with HD screen sharing."
                        delay="0s"
                    />
                    {/* Card 2 */}
                    <FeatureCard
                        icon={<Lock className="w-8 h-8 text-rosegold" />}
                        title="Just Us"
                        text="No group calls, no unwanted guests. A locked room strictly for two."
                        delay="1s"
                    />
                    {/* Card 3 */}
                    <FeatureCard
                        icon={<Camera className="w-8 h-8 text-peach" />}
                        title="Memory Snaps"
                        text="Capture cute moments in custom frames while you hang out."
                        delay="2s"
                    />
                </div>

            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, text, delay }) => (
    <div
        className="bg-cream/20 backdrop-blur-xl border border-white/30 p-8 rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-float-bob"
        style={{ animationDelay: delay }}
    >
        <div className="bg-white/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            {icon}
        </div>
        <h3 className="font-heading font-semibold text-xl mb-3 text-midnight">{title}</h3>
        <p className="font-sans text-midnight/70 leading-relaxed">{text}</p>
    </div>
);

export default LandingPage;
