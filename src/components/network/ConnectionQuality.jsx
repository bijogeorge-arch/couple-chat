import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const ConnectionQuality = ({ peerConnection, isConnected }) => {
    const [stats, setStats] = useState({
        latency: 0,
        quality: 'excellent',
        bandwidth: 0,
        packetLoss: 0,
        videoQuality: 'HD'
    });
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (!peerConnection || !isConnected) {
            setStats(prev => ({ ...prev, quality: 'disconnected' }));
            return;
        }

        const interval = setInterval(async () => {
            try {
                const statsReport = await peerConnection.getStats();
                let latency = 0;
                let packetLoss = 0;
                let bandwidth = 0;

                statsReport.forEach(report => {
                    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                        latency = report.currentRoundTripTime * 1000 || 0;
                    }

                    if (report.type === 'inbound-rtp' && report.kind === 'video') {
                        const packetsLost = report.packetsLost || 0;
                        const packetsReceived = report.packetsReceived || 1;
                        packetLoss = (packetsLost / (packetsLost + packetsReceived)) * 100;
                        bandwidth = (report.bytesReceived || 0) / 1024; // KB
                    }
                });

                // Determine quality based on latency
                let quality = 'excellent';
                let videoQuality = 'HD';

                if (latency < 50) {
                    quality = 'excellent';
                    videoQuality = 'HD';
                } else if (latency < 150) {
                    quality = 'good';
                    videoQuality = 'HD';
                } else if (latency < 300) {
                    quality = 'fair';
                    videoQuality = 'SD';
                } else {
                    quality = 'poor';
                    videoQuality = 'LD';
                }

                setStats({
                    latency: Math.round(latency),
                    quality,
                    bandwidth: Math.round(bandwidth),
                    packetLoss: Math.round(packetLoss * 10) / 10,
                    videoQuality
                });
            } catch (error) {
                console.error('Error getting connection stats:', error);
            }
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, [peerConnection, isConnected]);

    const getQualityColor = () => {
        switch (stats.quality) {
            case 'excellent':
                return 'text-green-400';
            case 'good':
                return 'text-yellow-400';
            case 'fair':
                return 'text-orange-400';
            case 'poor':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getQualityIcon = () => {
        if (!isConnected) {
            return <WifiOff className="w-4 h-4" />;
        }
        return <Wifi className="w-4 h-4" />;
    };

    const getQualityDots = () => {
        const dots = stats.quality === 'excellent' ? 4 :
            stats.quality === 'good' ? 3 :
                stats.quality === 'fair' ? 2 : 1;

        return (
            <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 h-3 rounded-full transition-all duration-300 ${i < dots ? getQualityColor().replace('text-', 'bg-') : 'bg-white/10'
                            }`}
                        style={{ height: `${(i + 1) * 4}px` }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 ${getQualityColor()}`}
                title="Connection Quality"
            >
                {getQualityIcon()}
                {getQualityDots()}
                <span className="text-xs font-medium">{stats.latency}ms</span>
            </button>

            {/* Details Panel */}
            {showDetails && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-midnight/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-heading font-semibold text-white">Connection Stats</h3>
                        <Activity className="w-4 h-4 text-blush animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        {/* Latency */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Latency</span>
                            <span className={`text-sm font-semibold ${getQualityColor()}`}>
                                {stats.latency}ms
                            </span>
                        </div>

                        {/* Quality */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Quality</span>
                            <span className={`text-sm font-semibold capitalize ${getQualityColor()}`}>
                                {stats.quality}
                            </span>
                        </div>

                        {/* Video Quality */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Video Quality</span>
                            <span className="text-sm font-semibold text-white">
                                {stats.videoQuality}
                            </span>
                        </div>

                        {/* Packet Loss */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Packet Loss</span>
                            <span className={`text-sm font-semibold ${stats.packetLoss < 1 ? 'text-green-400' :
                                    stats.packetLoss < 5 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {stats.packetLoss}%
                            </span>
                        </div>

                        {/* Bandwidth */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Bandwidth</span>
                            <span className="text-sm font-semibold text-white">
                                {stats.bandwidth} KB/s
                            </span>
                        </div>
                    </div>

                    {/* Quality Indicator Bar */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${stats.quality === 'excellent' ? 'bg-green-400 w-full' :
                                            stats.quality === 'good' ? 'bg-yellow-400 w-3/4' :
                                                stats.quality === 'fair' ? 'bg-orange-400 w-1/2' :
                                                    'bg-red-400 w-1/4'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {stats.quality === 'poor' && (
                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-300">
                                ⚠️ Poor connection detected. Try moving closer to your router.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConnectionQuality;
