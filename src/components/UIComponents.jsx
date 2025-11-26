import React from 'react';
import { X, Loader, AlertCircle, HelpCircle } from 'lucide-react';

// Permission Error Modal
export const PermissionModal = ({ error, onRetry, onClose }) => {
    if (!error) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-midnight border-2 border-rosegold/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(232,164,164,0.3)] animate-fade-in-up">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-rosegold/20 rounded-full">
                        <AlertCircle className="w-6 h-6 text-rosegold" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-white mb-2">{error.title}</h3>
                        <p className="text-lavender/80 font-cute text-sm leading-relaxed">{error.message}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onRetry}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-rosegold to-peach text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(232,164,164,0.5)] transition-all duration-300"
                    >
                        {error.action}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Toast Notification
export const Toast = ({ message, type = 'info', onClose }) => {
    if (!message) return null;

    const bgColors = {
        info: 'bg-lavender/20 border-lavender/30',
        success: 'bg-green-500/20 border-green-500/30',
        error: 'bg-red-500/20 border-red-500/30',
        loading: 'bg-peach/20 border-peach/30'
    };

    return (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[90] px-6 py-3 rounded-full backdrop-blur-md border ${bgColors[type]} shadow-lg animate-fade-in-down flex items-center gap-3`}>
            {type === 'loading' && <Loader className="w-5 h-5 animate-spin text-peach" />}
            <span className="text-white font-cute font-medium">{message}</span>
            {onClose && type !== 'loading' && (
                <button onClick={onClose} className="text-white/60 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Tutorial Overlay
export const TutorialOverlay = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="max-w-2xl w-full bg-gradient-to-b from-midnight to-midnight/80 border-2 border-lavender/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(201,179,255,0.4)]">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-lavender/20 rounded-full">
                            <HelpCircle className="w-6 h-6 text-lavender" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-white">Quick Start Guide</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white/60 hover:text-white" />
                    </button>
                </div>

                <div className="space-y-4 mb-8">
                    <TutorialStep emoji="🎥" title="Start Video Call" description="Share your room code with your partner or enter theirs to connect" />
                    <TutorialStep emoji="🎬" title="Watch Together" description="Click the projector icon to share your screen and watch movies in sync" />
                    <TutorialStep emoji="❤️" title="Send Reactions" description="Express yourself with floating reactions during your call" />
                    <TutorialStep emoji="📸" title="Capture Memories" description="Take polaroid-style snapshots of your time together" />
                    <TutorialStep emoji="🎨" title="Change Themes" description="Switch between Romantic, Starry Night, and Minimal themes" />
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-lavender mb-2 uppercase tracking-wider">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between"><span className="text-white/60">Mute/Unmute:</span><kbd className="bg-white/10 px-2 py-1 rounded text-white">Space</kbd></div>
                        <div className="flex justify-between"><span className="text-white/60">Toggle Video:</span><kbd className="bg-white/10 px-2 py-1 rounded text-white">V</kbd></div>
                        <div className="flex justify-between"><span className="text-white/60">Hide UI:</span><kbd className="bg-white/10 px-2 py-1 rounded text-white">H</kbd></div>
                        <div className="flex justify-between"><span className="text-white/60">Send Heart:</span><kbd className="bg-white/10 px-2 py-1 rounded text-white">L</kbd></div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-rosegold to-peach text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(232,164,164,0.6)] transition-all duration-300"
                >
                    Got it! Let's start
                </button>
            </div>
        </div>
    );
};

const TutorialStep = ({ emoji, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <span className="text-3xl">{emoji}</span>
        <div>
            <h4 className="font-semibold text-white mb-1">{title}</h4>
            <p className="text-sm text-lavender/80 font-cute">{description}</p>
        </div>
    </div>
);

// Cinema Mode Badge
export const CinemaModeBadge = ({ onExit }) => (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2 animate-fade-in">
        <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-peach/30 rounded-full shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-peach rounded-full animate-pulse"></div>
            <span className="text-peach font-cute font-bold text-sm tracking-wide">Cinema Mode</span>
        </div>
        <button
            onClick={onExit}
            className="p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 transition-all group"
            aria-label="Exit Cinema Mode"
            title="Exit Cinema Mode"
        >
            <X className="w-5 h-5 text-white/60 group-hover:text-white" />
        </button>
    </div>
);

// Mobile Menu
export const MobileMenu = ({ isOpen, onClose, theme, onThemeChange, onMemorySnap, showSettings, setShowSettings }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] md:hidden animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="absolute bottom-0 left-0 right-0 bg-midnight border-t-2 border-lavender/30 rounded-t-3xl p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-heading font-bold text-white">Settings</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <X className="w-6 h-6 text-white/60" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-lavender mb-3 uppercase tracking-wider">Theme</h4>
                        <div className="space-y-2">
                            <ThemeButton active={theme === 'romantic'} onClick={() => { onThemeChange('romantic'); onClose(); }}>
                                🌹 Romantic
                            </ThemeButton>
                            <ThemeButton active={theme === 'starry'} onClick={() => { onThemeChange('starry'); onClose(); }}>
                                ✨ Starry Night
                            </ThemeButton>
                            <ThemeButton active={theme === 'minimal'} onClick={() => { onThemeChange('minimal'); onClose(); }}>
                                ☁️ Minimal
                            </ThemeButton>
                        </div>
                    </div>

                    <button
                        onClick={() => { onMemorySnap(); onClose(); }}
                        className="w-full px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all font-cute"
                    >
                        📸 Capture Memory
                    </button>
                </div>
            </div>
        </div>
    );
};

const ThemeButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${active ? 'bg-rosegold/20 text-rosegold font-bold border-2 border-rosegold/30' : 'bg-white/5 text-white hover:bg-white/10'
            }`}
    >
        {children}
    </button>
);
