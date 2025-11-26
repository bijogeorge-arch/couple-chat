import React from 'react';
import { Camera, CameraOff, Wifi, WifiOff, AlertCircle, Video, Monitor, RefreshCw, Settings } from 'lucide-react';

// Camera Permission Blocked State
export const CameraBlockedState = ({ onRetry, onSettings }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-fade-in">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-velvet/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative p-6 bg-midnight/80 rounded-full border-2 border-velvet/30">
                <CameraOff className="w-16 h-16 text-velvet" />
            </div>
        </div>

        <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Camera Access Needed
        </h2>

        <p className="text-lavender/80 font-cute text-lg mb-6 max-w-md leading-relaxed">
            We need access to your camera and microphone to connect you with your partner.
            Please allow permissions when prompted.
        </p>

        <div className="bg-white/5 rounded-2xl p-6 mb-8 max-w-lg">
            <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">How to enable:</h3>
            <ol className="text-left space-y-3 text-sm text-lavender/70">
                <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-velvet/20 rounded-full flex items-center justify-center text-velvet font-bold">1</span>
                    <span>Click the camera icon in your browser's address bar</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-velvet/20 rounded-full flex items-center justify-center text-velvet font-bold">2</span>
                    <span>Select "Allow" for camera and microphone</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-velvet/20 rounded-full flex items-center justify-center text-velvet font-bold">3</span>
                    <span>Click "Retry" below to reconnect</span>
                </li>
            </ol>
        </div>

        <div className="flex gap-4">
            <button
                onClick={onRetry}
                className="px-8 py-3 bg-gradient-to-r from-velvet to-red-950 text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 flex items-center gap-2"
            >
                <RefreshCw className="w-5 h-5" />
                Retry Connection
            </button>
            {onSettings && (
                <button
                    onClick={onSettings}
                    className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                    <Settings className="w-5 h-5" />
                    Browser Settings
                </button>
            )}
        </div>
    </div>
);

// Partner Not Joining State
export const PartnerWaitingState = ({ roomCode, onCopyCode, waitTime = 0 }) => {
    const formatWaitTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-fade-in">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-rosegold/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative p-6 bg-midnight/80 rounded-full border-2 border-rosegold/30">
                    <Video className="w-16 h-16 text-rosegold animate-pulse" />
                </div>
            </div>

            <h2 className="text-3xl font-heading font-bold text-white mb-4">
                Waiting for Your Partner...
            </h2>

            <p className="text-lavender/80 font-cute text-lg mb-6 max-w-md leading-relaxed">
                Share this code with your partner so they can join you
            </p>

            <div className="bg-gradient-to-r from-velvet/10 to-gold/10 rounded-2xl p-6 mb-8 border border-white/10">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Room Code</p>
                <div className="flex items-center gap-4">
                    <code className="text-4xl font-bold text-white tracking-widest font-mono select-all">
                        {roomCode}
                    </code>
                    <button
                        onClick={onCopyCode}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm text-white"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {waitTime > 0 && (
                <div className="text-sm text-white/40 mb-4">
                    Waiting for {formatWaitTime(waitTime)}
                </div>
            )}

            <div className="flex items-center gap-2 text-lavender/60 text-sm">
                <div className="w-2 h-2 bg-rosegold rounded-full animate-ping" />
                <span>Connection ready • Waiting for partner</span>
            </div>

            <div className="mt-8 bg-white/5 rounded-xl p-4 max-w-md">
                <p className="text-xs text-white/50 italic">
                    💡 Tip: Make sure your partner has the same room code. They can join by entering it on the landing page.
                </p>
            </div>
        </div>
    );
};

// Screen Share Failed State
export const ScreenShareFailedState = ({ onRetry, onCancel, errorMessage }) => (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-midnight border-2 border-peach/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,199,165,0.3)]">
            <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-peach/20 rounded-full">
                    <Monitor className="w-12 h-12 text-peach" />
                </div>
            </div>

            <h2 className="text-2xl font-heading font-bold text-white mb-4 text-center">
                Screen Share Failed
            </h2>

            <p className="text-lavender/80 font-cute text-center mb-6 leading-relaxed">
                {errorMessage || "We couldn't start screen sharing. This might be due to browser permissions or system settings."}
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Troubleshooting:</h3>
                <ul className="space-y-2 text-sm text-lavender/70">
                    <li className="flex items-start gap-2">
                        <span className="text-peach">•</span>
                        <span>Make sure you selected the correct window/tab</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-peach">•</span>
                        <span>Check if another app is using screen capture</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-peach">•</span>
                        <span>Try refreshing the page and reconnecting</span>
                    </li>
                </ul>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onRetry}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-peach to-velvet text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(255,199,165,0.5)] transition-all duration-300"
                >
                    Try Again
                </button>
                <button
                    onClick={onCancel}
                    className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// Connection Test Component
export const ConnectionTest = ({ onComplete }) => {
    const [testResults, setTestResults] = React.useState({
        camera: 'testing',
        microphone: 'testing',
        network: 'testing',
    });

    React.useEffect(() => {
        runTests();
    }, []);

    const runTests = async () => {
        // Test Camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setTestResults(prev => ({ ...prev, camera: 'success' }));
        } catch (err) {
            setTestResults(prev => ({ ...prev, camera: 'failed' }));
        }

        // Test Microphone
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setTestResults(prev => ({ ...prev, microphone: 'success' }));
        } catch (err) {
            setTestResults(prev => ({ ...prev, microphone: 'failed' }));
        }

        // Test Network (simple check)
        setTimeout(() => {
            if (navigator.onLine) {
                setTestResults(prev => ({ ...prev, network: 'success' }));
            } else {
                setTestResults(prev => ({ ...prev, network: 'failed' }));
            }
        }, 1000);
    };

    const allTestsPassed = Object.values(testResults).every(result => result === 'success');

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="max-w-md w-full bg-midnight border-2 border-lavender/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(201,179,255,0.3)]">
                <h2 className="text-2xl font-heading font-bold text-white mb-6 text-center">
                    Testing Your Connection
                </h2>

                <div className="space-y-4 mb-8">
                    <TestItem
                        icon={<Camera className="w-5 h-5" />}
                        label="Camera"
                        status={testResults.camera}
                    />
                    <TestItem
                        icon={<Video className="w-5 h-5" />}
                        label="Microphone"
                        status={testResults.microphone}
                    />
                    <TestItem
                        icon={<Wifi className="w-5 h-5" />}
                        label="Network"
                        status={testResults.network}
                    />
                </div>

                {allTestsPassed && (
                    <button
                        onClick={onComplete}
                        className="w-full px-6 py-3 bg-gradient-to-r from-lavender to-rosegold text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(201,179,255,0.5)] transition-all duration-300"
                    >
                        Continue to Room
                    </button>
                )}

                {!allTestsPassed && Object.values(testResults).every(r => r !== 'testing') && (
                    <div className="text-center">
                        <p className="text-sm text-lavender/60 mb-4">
                            Some tests failed. Please check your permissions and try again.
                        </p>
                        <button
                            onClick={runTests}
                            className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300"
                        >
                            Retry Tests
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TestItem = ({ icon, label, status }) => {
    const statusConfig = {
        testing: { color: 'text-lavender', bg: 'bg-lavender/20', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
        success: { color: 'text-green-400', bg: 'bg-green-400/20', icon: <span className="text-lg">✓</span> },
        failed: { color: 'text-red-400', bg: 'bg-red-400/20', icon: <span className="text-lg">✗</span> },
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
                <div className={`${config.color}`}>
                    {icon}
                </div>
                <span className="text-white font-medium">{label}</span>
            </div>
            <div className={`${config.bg} ${config.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                {config.icon}
            </div>
        </div>
    );
};

// No Internet Connection State
export const NoInternetState = ({ onRetry }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-fade-in">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative p-6 bg-midnight/80 rounded-full border-2 border-red-500/30">
                <WifiOff className="w-16 h-16 text-red-400" />
            </div>
        </div>

        <h2 className="text-3xl font-heading font-bold text-white mb-4">
            No Internet Connection
        </h2>

        <p className="text-lavender/80 font-cute text-lg mb-8 max-w-md leading-relaxed">
            Looks like you're offline. Please check your internet connection and try again.
        </p>

        <button
            onClick={onRetry}
            className="px-8 py-3 bg-gradient-to-r from-velvet to-red-950 text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 flex items-center gap-2"
        >
            <RefreshCw className="w-5 h-5" />
            Retry Connection
        </button>
    </div>
);

export default {
    CameraBlockedState,
    PartnerWaitingState,
    ScreenShareFailedState,
    ConnectionTest,
    NoInternetState,
};
